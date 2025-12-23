import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Monitor, ChevronRight } from 'lucide-react';
import './FacilityCard.css';

function FacilityCard({ facility, index = 0 }) {
    const navigate = useNavigate();

    const getStatusConfig = (status, available, capacity) => {
        const percentage = (available / capacity) * 100;

        if (status === 'maintenance') {
            return { label: 'Maintenance', class: 'maintenance', dotClass: 'disabled' };
        }
        if (status === 'full' || available === 0) {
            return { label: 'Penuh', class: 'full', dotClass: 'full' };
        }
        if (percentage <= 30) {
            return { label: 'Hampir Penuh', class: 'warning', dotClass: 'warning' };
        }
        return { label: 'Tersedia', class: 'available', dotClass: 'available' };
    };

    const statusConfig = getStatusConfig(facility.status, facility.available, facility.capacity);

    return (
        <motion.div
            className="facility-card card-interactive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => navigate(`/facility/${facility.id}`)}
        >
            <div className="facility-image">
                <img src={facility.image} alt={facility.name} />
                <span className={`facility-status badge badge-${statusConfig.class}`}>
                    <span className={`status-dot ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                </span>
            </div>

            <div className="facility-content">
                <h3 className="facility-name">{facility.name}</h3>

                <div className="facility-meta">
                    <span className="meta-item">
                        <MapPin size={14} />
                        {facility.building}
                    </span>
                    <span className="meta-item">
                        <Monitor size={14} />
                        {facility.available}/{facility.capacity}
                    </span>
                </div>

                <div className="facility-specs">
                    {facility.software?.slice(0, 2).map((sw, i) => (
                        <span key={i} className="spec-chip">{sw}</span>
                    ))}
                    {facility.software?.length > 2 && (
                        <span className="spec-chip more">+{facility.software.length - 2}</span>
                    )}
                </div>

                <div className="facility-footer">
                    <span className="distance">📍 {facility.distance}m</span>
                    <ChevronRight size={18} className="chevron" />
                </div>
            </div>
        </motion.div>
    );
}

export default FacilityCard;
