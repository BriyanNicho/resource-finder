import { createContext, useContext, useState, useEffect } from 'react';
import {
    bookings as initialBookings,
    scheduleBookings as initialScheduleBookings,
    facilities as initialFacilities,
    activityLogs as initialLogs,
    usageHistory
} from '../utils/mockData';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    // Merge mock data sources for a comprehensive list
    const [bookings, setBookings] = useState([...initialScheduleBookings]);
    const [facilities, setFacilities] = useState(initialFacilities);
    const [activityLogs, setActivityLogs] = useState(initialLogs);

    // Calculated stats
    const stats = {
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === 'active' || b.status === 'pending').length,
        activeIssues: 3, // Mock for now, would be from issues data
        avgDuration: '1.5h' // Mock calculation
    };

    const addBooking = (newBooking) => {
        setBookings(prev => [newBooking, ...prev]);
        logAction({
            action: 'booking',
            userName: newBooking.userName,
            facility: newBooking.facilityName,
            booking: newBooking
        });
    };

    const cancelBooking = (bookingId, reason = 'Admin Cancelled') => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));

        // If it was occupying a PC, free it up (mock logic for now)
        if (booking.pcNumber && booking.facilityId) {
            updatePCStatus(booking.facilityId, booking.pcNumber, 'available');
        }

        logAction({
            action: 'cancel-booking',
            userName: booking.userName,
            facility: booking.facilityName,
            metadata: { reason }
        });
    };

    const checkInBooking = (bookingId) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status: 'active', checkedIn: true } : b
        ));

        logAction({
            action: 'check-in',
            userName: booking.userName,
            facility: booking.facilityName,
            pcNumber: booking.pcNumber
        });
    };

    const updatePCStatus = (facilityId, pcId, newStatus) => {
        setFacilities(prev => prev.map(f => {
            if (f.id !== facilityId) return f;
            if (!f.computers) return f;

            return {
                ...f,
                computers: f.computers.map(pc =>
                    pc.id === pcId ? { ...pc, status: newStatus } : pc
                )
            };
        }));
    };

    const logAction = ({ action, userName, facility, pcNumber, metadata }) => {
        const newLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userName: userName || 'Admin',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', // Default admin avatar
            action,
            facility,
            pcNumber,
            ...metadata
        };
        setActivityLogs(prev => [newLog, ...prev]);
    };

    const value = {
        bookings,
        facilities,
        activityLogs,
        usageHistory, // Static for now
        stats,
        addBooking,
        cancelBooking,
        checkInBooking,
        updatePCStatus
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
