import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { facilities } from '../utils/mockData';

/**
 * Hook for real-time computer status updates
 * Falls back to mock data if Supabase is not configured
 */
export function useRealtimeComputers(facilityId) {
    const [computers, setComputers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!facilityId) return;

        // If Supabase is not configured, use mock data
        if (!isSupabaseConfigured()) {
            const facility = facilities.find(f => f.id === parseInt(facilityId));
            setComputers(facility?.computers || []);
            setLoading(false);
            return;
        }

        // Fetch initial data from Supabase
        const fetchComputers = async () => {
            try {
                const { data, error } = await supabase
                    .from('computers')
                    .select('*')
                    .eq('facility_id', facilityId)
                    .order('pc_number');

                if (error) throw error;
                setComputers(data || []);
            } catch (err) {
                console.error('Error fetching computers:', err);
                setError(err.message);
                // Fallback to mock data
                const facility = facilities.find(f => f.id === parseInt(facilityId));
                setComputers(facility?.computers || []);
            } finally {
                setLoading(false);
            }
        };

        fetchComputers();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`computers-${facilityId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'computers',
                    filter: `facility_id=eq.${facilityId}`
                },
                (payload) => {
                    console.log('Real-time update:', payload);

                    if (payload.eventType === 'UPDATE') {
                        setComputers(prev =>
                            prev.map(pc =>
                                pc.id === payload.new.id ? payload.new : pc
                            )
                        );
                    } else if (payload.eventType === 'INSERT') {
                        setComputers(prev => [...prev, payload.new]);
                    } else if (payload.eventType === 'DELETE') {
                        setComputers(prev =>
                            prev.filter(pc => pc.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [facilityId]);

    return { computers, loading, error };
}

/**
 * Hook to update computer status (for admin)
 */
export function useUpdateComputerStatus() {
    const [updating, setUpdating] = useState(false);

    const updateStatus = async (computerId, newStatus) => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured. Status update skipped.');
            return { success: false, error: 'Supabase not configured' };
        }

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('computers')
                .update({ status: newStatus })
                .eq('id', computerId);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error updating computer status:', err);
            return { success: false, error: err.message };
        } finally {
            setUpdating(false);
        }
    };

    return { updateStatus, updating };
}
