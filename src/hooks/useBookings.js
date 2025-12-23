import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { bookings as mockBookings } from '../utils/mockData';

/**
 * Hook for managing bookings
 * Falls back to mock data if Supabase is not configured
 */
export function useBookings(userId) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If Supabase is not configured, use mock data
        if (!isSupabaseConfigured()) {
            setBookings(mockBookings);
            setLoading(false);
            return;
        }

        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
            *,
            facilities (name, building, floor, image_url),
            computers (pc_number, specs)
          `)
                    .eq('user_id', userId)
                    .order('booking_date', { ascending: false });

                if (error) throw error;

                // Transform data to match existing format
                const transformedBookings = data.map(booking => ({
                    id: booking.id,
                    facilityId: booking.facility_id,
                    facilityName: booking.facilities?.name,
                    building: booking.facilities?.building,
                    floor: booking.facilities?.floor,
                    date: booking.booking_date,
                    startTime: booking.start_time,
                    endTime: booking.end_time,
                    status: booking.status,
                    pcNumber: booking.computers?.pc_number,
                    qrCode: booking.qr_code,
                }));

                setBookings(transformedBookings);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError(err.message);
                setBookings(mockBookings); // Fallback to mock
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId]);

    return { bookings, loading, error };
}

/**
 * Hook for creating a new booking
 */
export function useCreateBooking() {
    const [creating, setCreating] = useState(false);

    const createBooking = async (bookingData) => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured. Booking saved locally.');
            // Return mock success with generated ID
            return {
                success: true,
                data: {
                    ...bookingData,
                    id: `BK-${Date.now()}`,
                    qrCode: `RF-${Date.now()}`
                }
            };
        }

        setCreating(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    user_id: bookingData.userId,
                    facility_id: bookingData.facilityId,
                    computer_id: bookingData.computerId,
                    booking_date: bookingData.date,
                    start_time: bookingData.startTime,
                    end_time: bookingData.endTime,
                    status: 'upcoming',
                    qr_code: `RF-${Date.now()}`
                })
                .select()
                .single();

            if (error) throw error;

            // Update computer status to reserved
            if (bookingData.computerId) {
                await supabase
                    .from('computers')
                    .update({
                        status: 'reserved',
                        occupied_by: bookingData.userId,
                        occupied_until: bookingData.endTime
                    })
                    .eq('id', bookingData.computerId);
            }

            return { success: true, data };
        } catch (err) {
            console.error('Error creating booking:', err);
            return { success: false, error: err.message };
        } finally {
            setCreating(false);
        }
    };

    return { createBooking, creating };
}

/**
 * Hook for cancelling a booking
 */
export function useCancelBooking() {
    const [cancelling, setCancelling] = useState(false);

    const cancelBooking = async (bookingId) => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured. Cancellation skipped.');
            return { success: true };
        }

        setCancelling(true);
        try {
            // Get booking details first to release computer
            const { data: booking } = await supabase
                .from('bookings')
                .select('computer_id')
                .eq('id', bookingId)
                .single();

            // Update booking status
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId);

            if (error) throw error;

            // Release computer if there was one
            if (booking?.computer_id) {
                await supabase
                    .from('computers')
                    .update({
                        status: 'available',
                        occupied_by: null,
                        occupied_until: null
                    })
                    .eq('id', booking.computer_id);
            }

            return { success: true };
        } catch (err) {
            console.error('Error cancelling booking:', err);
            return { success: false, error: err.message };
        } finally {
            setCancelling(false);
        }
    };

    return { cancelBooking, cancelling };
}
