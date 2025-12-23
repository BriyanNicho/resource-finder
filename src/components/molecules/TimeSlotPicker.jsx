import { Clock } from 'lucide-react';
import './TimeSlotPicker.css';

const timeSlots = [
    { time: '08:00', label: '08:00 - 09:00' },
    { time: '09:00', label: '09:00 - 10:00' },
    { time: '10:00', label: '10:00 - 11:00' },
    { time: '11:00', label: '11:00 - 12:00' },
    { time: '12:00', label: '12:00 - 13:00' },
    { time: '13:00', label: '13:00 - 14:00' },
    { time: '14:00', label: '14:00 - 15:00' },
    { time: '15:00', label: '15:00 - 16:00' },
    { time: '16:00', label: '16:00 - 17:00' },
    { time: '17:00', label: '17:00 - 18:00' },
];

function TimeSlotPicker({ selectedSlot, onSelectSlot, bookedSlots = [] }) {
    const isBooked = (time) => bookedSlots.includes(time);

    return (
        <div className="time-slot-picker">
            <div className="picker-header">
                <Clock size={18} />
                <h3>Pilih Waktu</h3>
            </div>

            <div className="time-slots-grid">
                {timeSlots.map((slot) => (
                    <button
                        key={slot.time}
                        className={`time-slot ${selectedSlot === slot.time ? 'selected' : ''} ${isBooked(slot.time) ? 'booked' : ''}`}
                        onClick={() => !isBooked(slot.time) && onSelectSlot(slot.time)}
                        disabled={isBooked(slot.time)}
                    >
                        {slot.label}
                    </button>
                ))}
            </div>

            {selectedSlot && (
                <div className="selected-time-info">
                    <Clock size={16} />
                    <span>Waktu dipilih: <strong>{selectedSlot} - {parseInt(selectedSlot) + 1}:00</strong></span>
                </div>
            )}
        </div>
    );
}

export default TimeSlotPicker;
