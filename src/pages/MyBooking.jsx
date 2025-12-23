import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Clock, MapPin, ChevronRight, History } from 'lucide-react';
import BookingTicket from '../components/molecules/BookingTicket';
import { bookings, bookingHistory } from '../utils/mockData';
import './MyBooking.css';

function MyBooking() {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const getStatusBadge = (status) => {
        const configs = {
            active: { label: 'Aktif', class: 'available' },
            upcoming: { label: 'Mendatang', class: 'warning' },
            completed: { label: 'Selesai', class: 'completed' },
            cancelled: { label: 'Dibatalkan', class: 'full' },
        };
        return configs[status] || configs.completed;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Hari Ini';
        if (date.toDateString() === tomorrow.toDateString()) return 'Besok';

        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="my-booking-page">
            <div className="container">
                {/* Tab Switcher */}
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        <QrCode size={18} />
                        Aktif
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={18} />
                        Riwayat
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'active' ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bookings-list"
                        >
                            {bookings.length > 0 ? (
                                bookings.map((booking, index) => {
                                    const statusConfig = getStatusBadge(booking.status);
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            className="booking-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            <div className="booking-header">
                                                <span className={`badge badge-${statusConfig.class}`}>
                                                    {statusConfig.label}
                                                </span>
                                                <span className="booking-id">{booking.id}</span>
                                            </div>

                                            <h3 className="booking-facility">{booking.facilityName}</h3>

                                            <div className="booking-details">
                                                <div className="detail-item">
                                                    <MapPin size={16} />
                                                    <span>{booking.building}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <Clock size={16} />
                                                    <span>{formatDate(booking.date)} • {booking.startTime} - {booking.endTime}</span>
                                                </div>
                                            </div>

                                            {booking.status === 'active' && (
                                                <div className="booking-action">
                                                    <span className="action-hint">Tap untuk lihat QR Code</span>
                                                    <ChevronRight size={18} />
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">🎫</span>
                                    <h3>Belum ada booking aktif</h3>
                                    <p>Booking fasilitas untuk belajar lebih produktif!</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bookings-list"
                        >
                            {bookingHistory.length > 0 ? (
                                bookingHistory.map((booking, index) => {
                                    const statusConfig = getStatusBadge(booking.status);
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            className={`booking-card history ${booking.status}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="booking-header">
                                                <span className={`badge badge-${statusConfig.class}`}>
                                                    {statusConfig.label}
                                                </span>
                                                <span className="booking-date">{formatDate(booking.date)}</span>
                                            </div>

                                            <h3 className="booking-facility">{booking.facilityName}</h3>

                                            <div className="booking-details">
                                                <div className="detail-item">
                                                    <Clock size={16} />
                                                    <span>{booking.startTime} - {booking.endTime}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📋</span>
                                    <h3>Belum ada riwayat</h3>
                                    <p>Riwayat penggunaan fasilitas akan muncul di sini</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Booking Ticket Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <BookingTicket
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                        onNavigate={() => setSelectedBooking(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default MyBooking;
