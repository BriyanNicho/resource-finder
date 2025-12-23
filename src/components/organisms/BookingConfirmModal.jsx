import { X, Monitor, Clock, MapPin, Check } from 'lucide-react';
import './BookingConfirmModal.css';

function BookingConfirmModal({ isOpen, onClose, onConfirm, facility, selectedPC, selectedTime }) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm({
            facilityId: facility.id,
            facilityName: facility.name,
            pcId: selectedPC.id,
            time: selectedTime,
            building: facility.building,
            floor: facility.floor,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <div className="modal-icon">
                        <Check size={32} />
                    </div>
                    <h2>Konfirmasi Booking</h2>
                    <p>Pastikan detail booking sudah benar</p>
                </div>

                <div className="booking-details">
                    <div className="detail-row">
                        <div className="detail-icon">
                            <MapPin size={18} />
                        </div>
                        <div className="detail-info">
                            <span className="detail-label">Lokasi</span>
                            <span className="detail-value">{facility.name}</span>
                            <span className="detail-sub">{facility.building}, {facility.floor}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-icon">
                            <Monitor size={18} />
                        </div>
                        <div className="detail-info">
                            <span className="detail-label">Komputer</span>
                            <span className="detail-value">{selectedPC.id}</span>
                            <span className="detail-sub">{selectedPC.specs}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-icon">
                            <Clock size={18} />
                        </div>
                        <div className="detail-info">
                            <span className="detail-label">Waktu</span>
                            <span className="detail-value">{selectedTime} - {parseInt(selectedTime) + 1}:00</span>
                            <span className="detail-sub">Hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Batal
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm}>
                        <Check size={18} />
                        Konfirmasi Booking
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingConfirmModal;
