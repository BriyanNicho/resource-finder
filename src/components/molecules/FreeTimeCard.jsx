import { motion } from 'framer-motion';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import './FreeTimeCard.css';

function FreeTimeCard({ freeTime }) {
    if (!freeTime) return null;

    return (
        <motion.div
            className="free-time-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="free-time-glow" />
            <div className="free-time-content">
                <div className="free-time-header">
                    <span className="free-time-label">⚡ Waktu Kosong Berikutnya</span>
                    <ChevronRight size={20} className="chevron" />
                </div>

                <h2 className="free-time-duration">{freeTime.duration}</h2>

                <div className="free-time-details">
                    <div className="detail-item">
                        <Clock size={16} />
                        <span>Setelah "{freeTime.afterClass}"</span>
                    </div>
                    <div className="detail-item">
                        <MapPin size={16} />
                        <span>{freeTime.location} • {freeTime.startTime} - {freeTime.endTime}</span>
                    </div>
                </div>
            </div>

            <div className="pulse-ring" />
        </motion.div>
    );
}

export default FreeTimeCard;
