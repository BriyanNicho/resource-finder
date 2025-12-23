import { motion } from 'framer-motion';
import { QrCode, MapPin, Clock, X, Navigation, CheckCircle } from 'lucide-react';
import './BookingTicket.css';

function BookingTicket({ booking, onClose, onNavigate }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            className="booking-ticket-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="booking-ticket"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.button
                    className="close-btn"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={24} />
                </motion.button>

                <div className="ticket-header">
                    <motion.div
                        className="success-icon"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                    >
                        <CheckCircle size={48} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Booking Berhasil!
                    </motion.h2>
                </div>

                <motion.div
                    className="qr-section"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="qr-code">
                        <QrCode size={120} strokeWidth={1} />
                    </div>
                    <p className="qr-hint">Scan QR di lokasi untuk check-in</p>
                </motion.div>

                <div className="ticket-divider">
                    <div className="divider-notch left" />
                    <div className="divider-line" />
                    <div className="divider-notch right" />
                </div>

                <motion.div
                    className="ticket-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="facility-name">{booking.facilityName}</h3>

                    <div className="detail-row">
                        <MapPin size={18} />
                        <span>{booking.building}, {booking.floor}</span>
                    </div>

                    <div className="detail-row">
                        <Clock size={18} />
                        <span>{formatDate(booking.date)}</span>
                    </div>

                    <div className="time-slot">
                        <span className="time-label">Waktu:</span>
                        <span className="time-value">{booking.startTime} - {booking.endTime}</span>
                    </div>

                    {booking.pcNumber && (
                        <motion.div
                            className="pc-number"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span>🖥️</span>
                            <span>{booking.pcNumber}</span>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="ticket-warning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    ⚡ Check-in dalam 15 menit atau booking hangus
                </motion.div>

                <div className="ticket-actions">
                    <motion.button
                        className="btn btn-secondary"
                        onClick={onNavigate}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Navigation size={18} />
                        Navigasi
                    </motion.button>
                    <motion.button
                        className="btn btn-ghost text-danger"
                        onClick={onClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <X size={18} />
                        Batalkan
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default BookingTicket;
