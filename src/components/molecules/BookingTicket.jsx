import { motion } from 'framer-motion';
import { QrCode, MapPin, Clock, X, Navigation } from 'lucide-react';
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
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="ticket-header">
                    <div className="success-icon">✅</div>
                    <h2>Booking Berhasil!</h2>
                </div>

                <div className="qr-section">
                    <div className="qr-code">
                        <QrCode size={120} strokeWidth={1} />
                    </div>
                    <p className="qr-hint">Scan QR di lokasi untuk check-in</p>
                </div>

                <div className="ticket-divider">
                    <div className="divider-notch left" />
                    <div className="divider-line" />
                    <div className="divider-notch right" />
                </div>

                <div className="ticket-details">
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
                        <div className="pc-number">
                            <span>🖥️</span>
                            <span>{booking.pcNumber}</span>
                        </div>
                    )}
                </div>

                <div className="ticket-warning">
                    ⚡ Check-in dalam 15 menit atau booking hangus
                </div>

                <div className="ticket-actions">
                    <button className="btn btn-secondary" onClick={onNavigate}>
                        <Navigation size={18} />
                        Navigasi
                    </button>
                    <button className="btn btn-ghost text-danger" onClick={onClose}>
                        <X size={18} />
                        Batalkan
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default BookingTicket;
