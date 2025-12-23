import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, MapPin, Clock, Monitor, Users,
    AlertTriangle, ChevronDown, Bell, Check
} from 'lucide-react';
import BookingTicket from '../components/molecules/BookingTicket';
import PCSelectionGrid from '../components/organisms/PCSelectionGrid';
import TimeSlotPicker from '../components/molecules/TimeSlotPicker';
import BookingConfirmModal from '../components/organisms/BookingConfirmModal';
import { facilities, timeSlots } from '../utils/mockData';
import './FacilityDetail.css';

function FacilityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPC, setSelectedPC] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [showTicket, setShowTicket] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const facility = facilities.find(f => f.id === parseInt(id));

    if (!facility) {
        return (
            <div className="facility-detail error">
                <p>Fasilitas tidak ditemukan</p>
                <button className="btn btn-primary" onClick={() => navigate('/explore')}>
                    Kembali ke Explore
                </button>
            </div>
        );
    }

    const getStatusConfig = (status, available, capacity) => {
        const percentage = (available / capacity) * 100;
        if (status === 'maintenance') return { label: 'Maintenance', class: 'maintenance' };
        if (status === 'full' || available === 0) return { label: 'Penuh', class: 'full' };
        if (percentage <= 30) return { label: 'Hampir Penuh', class: 'warning' };
        return { label: 'Tersedia', class: 'available' };
    };

    const statusConfig = getStatusConfig(facility.status, facility.available, facility.capacity);

    const handleBooking = () => {
        if (!selectedTime) return;

        // If this is a computer lab with PC selection
        if (facility.computers && facility.computers.length > 0) {
            if (!selectedPC) {
                alert('Silakan pilih komputer terlebih dahulu');
                return;
            }
            setShowConfirmModal(true);
        } else {
            // For non-computer facilities, show ticket directly
            setShowTicket(true);
        }
    };

    const handleConfirmBooking = (bookingData) => {
        console.log('Booking confirmed:', bookingData);
        setShowConfirmModal(false);
        setBookingSuccess(true);

        // Show success message then show ticket
        setTimeout(() => {
            setShowTicket(true);
            setBookingSuccess(false);
        }, 1500);
    };

    const getTimeSlotStatus = (slot) => {
        if (slot.status === 'class') return 'blocked';
        if (slot.status === 'full') return 'full';
        if (slot.status === 'limited') return 'warning';
        return 'available';
    };

    // Check if facility has computers (is a computer lab)
    const isComputerLab = facility.computers && facility.computers.length > 0;

    return (
        <div className="facility-detail">
            {/* Header Image */}
            <div className="detail-header">
                <img src={facility.image} alt={facility.name} className="header-image" />
                <div className="header-overlay" />

                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>

                <div className="header-content">
                    <span className={`badge badge-${statusConfig.class}`}>
                        {statusConfig.label}
                    </span>
                    <h1 className="facility-title">{facility.name}</h1>
                    <div className="facility-location">
                        <MapPin size={16} />
                        <span>{facility.building}, {facility.floor}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="detail-content">
                {/* Quick Stats */}
                <div className="stats-row">
                    <div className="stat-item">
                        <Monitor size={20} />
                        <div className="stat-info">
                            <span className="stat-value">{facility.available}/{facility.capacity}</span>
                            <span className="stat-label">Tersedia</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <MapPin size={20} />
                        <div className="stat-info">
                            <span className="stat-value">{facility.distance}m</span>
                            <span className="stat-label">Jarak</span>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <section className="detail-section">
                    <h3 className="section-title">📋 Spesifikasi</h3>
                    <div className="specs-list">
                        {facility.specs?.map((spec, i) => (
                            <span key={i} className="spec-tag">{spec}</span>
                        ))}
                    </div>

                    {facility.software?.length > 0 && (
                        <>
                            <h4 className="subsection-title">Software Tersedia</h4>
                            <div className="specs-list">
                                {facility.software.map((sw, i) => (
                                    <span key={i} className="spec-tag software">{sw}</span>
                                ))}
                            </div>
                        </>
                    )}

                    {facility.equipment?.length > 0 && (
                        <>
                            <h4 className="subsection-title">Peralatan</h4>
                            <div className="specs-list">
                                {facility.equipment.map((eq, i) => (
                                    <span key={i} className="spec-tag equipment">{eq}</span>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Rules */}
                <section className="detail-section">
                    <h3 className="section-title">⚠️ Peraturan</h3>
                    <ul className="rules-list">
                        {facility.rules?.map((rule, i) => (
                            <li key={i}>{rule}</li>
                        ))}
                    </ul>
                </section>

                {/* PC Selection Grid - Only for computer labs */}
                {isComputerLab && facility.status !== 'maintenance' && (
                    <PCSelectionGrid
                        computers={facility.computers}
                        rows={facility.rows || 5}
                        cols={facility.cols || 6}
                        selectedPC={selectedPC}
                        onSelectPC={setSelectedPC}
                    />
                )}

                {/* Time Slot Picker */}
                {facility.status !== 'maintenance' && (
                    <section className="detail-section">
                        <h3 className="section-title">⏰ Pilih Waktu</h3>

                        <div className="time-slots-grid">
                            {timeSlots.map((slot, i) => {
                                const slotStatus = getTimeSlotStatus(slot);
                                const isSelected = selectedTime === slot.time;
                                const isBlocked = slotStatus === 'blocked';

                                return (
                                    <button
                                        key={i}
                                        className={`time-slot ${slotStatus} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => !isBlocked && setSelectedTime(slot.time)}
                                        disabled={isBlocked}
                                        title={slot.classInfo || ''}
                                    >
                                        <span className="slot-time">{slot.time}</span>
                                        {isBlocked && (
                                            <span className="slot-blocked">📚</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="time-legend">
                            <span className="legend-item">
                                <span className="legend-box blocked" /> Jam Kuliahmu
                            </span>
                            <span className="legend-item">
                                <span className="legend-box available" /> Tersedia
                            </span>
                        </p>

                        {/* Duration Selector */}
                        <div className="duration-selector">
                            <label>Durasi Booking:</label>
                            <select
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                                className="duration-select"
                            >
                                <option value={30}>30 Menit</option>
                                <option value={60}>1 Jam</option>
                                <option value={90}>1.5 Jam</option>
                                <option value={120}>2 Jam</option>
                            </select>
                        </div>
                    </section>
                )}

                {/* Booking Summary */}
                {(selectedPC || selectedTime) && (
                    <motion.div
                        className="booking-summary"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h4>📝 Ringkasan Booking</h4>
                        <div className="summary-items">
                            {selectedPC && (
                                <div className="summary-item">
                                    <Monitor size={16} />
                                    <span>{selectedPC.id}</span>
                                </div>
                            )}
                            {selectedTime && (
                                <div className="summary-item">
                                    <Clock size={16} />
                                    <span>{selectedTime} - {parseInt(selectedTime) + Math.floor(selectedDuration / 60)}:{(selectedDuration % 60).toString().padStart(2, '0')}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Notify Me (when full) */}
                {(facility.status === 'full' || facility.available === 0) && (
                    <button className="btn btn-secondary btn-full notify-btn">
                        <Bell size={18} />
                        Kabari jika kosong
                    </button>
                )}

                {/* Book Button */}
                {facility.status !== 'maintenance' && facility.available > 0 && (
                    <motion.button
                        className="btn btn-primary btn-lg btn-full book-btn"
                        onClick={handleBooking}
                        disabled={!selectedTime || (isComputerLab && !selectedPC)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ✨ Booking Sekarang
                    </motion.button>
                )}

                {facility.status === 'maintenance' && (
                    <div className="maintenance-notice">
                        <AlertTriangle size={20} />
                        <span>Fasilitas sedang dalam perbaikan</span>
                    </div>
                )}
            </div>

            {/* Booking Success Toast */}
            <AnimatePresence>
                {bookingSuccess && (
                    <motion.div
                        className="success-toast"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <Check size={24} />
                        <span>Booking Berhasil!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Confirm Modal */}
            {isComputerLab && selectedPC && (
                <BookingConfirmModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmBooking}
                    facility={facility}
                    selectedPC={selectedPC}
                    selectedTime={selectedTime}
                />
            )}

            {/* Booking Ticket Modal */}
            <AnimatePresence>
                {showTicket && (
                    <BookingTicket
                        booking={{
                            facilityName: facility.name,
                            building: facility.building,
                            floor: facility.floor,
                            date: new Date().toISOString().split('T')[0],
                            startTime: selectedTime,
                            endTime: `${parseInt(selectedTime) + Math.floor(selectedDuration / 60)}:${(selectedDuration % 60).toString().padStart(2, '0')}`,
                            pcNumber: selectedPC?.id || null,
                        }}
                        onClose={() => setShowTicket(false)}
                        onNavigate={() => {
                            setShowTicket(false);
                            navigate('/my-booking');
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default FacilityDetail;
