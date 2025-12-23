import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { peakHoursData } from '../../utils/mockData';
import './FacilityDensityWidget.css';

function FacilityDensityWidget() {
    // Determine current time slot
    const currentHour = new Date().getHours();
    const getCurrentSlotIndex = () => {
        if (currentHour >= 8 && currentHour < 10) return 0;
        if (currentHour >= 10 && currentHour < 12) return 1;
        if (currentHour >= 12 && currentHour < 14) return 2;
        if (currentHour >= 14 && currentHour < 16) return 3;
        if (currentHour >= 16 && currentHour < 18) return 4;
        if (currentHour >= 18 && currentHour < 20) return 5;
        return -1;
    };

    const currentSlotIndex = getCurrentSlotIndex();

    const getLevelColor = (level) => {
        switch (level) {
            case 'high': return 'var(--status-full)';
            case 'medium': return 'var(--status-warning)';
            case 'low': return 'var(--status-available)';
            default: return 'var(--text-tertiary)';
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'high': return <TrendingUp size={14} />;
            case 'low': return <TrendingDown size={14} />;
            default: return <BarChart3 size={14} />;
        }
    };

    return (
        <div className="density-widget">
            <div className="density-header">
                <div className="density-title">
                    <BarChart3 size={20} />
                    <h3>Kepadatan Fasilitas</h3>
                </div>
                <div className="density-subtitle">
                    <Clock size={14} />
                    <span>Pola penggunaan hari ini</span>
                </div>
            </div>

            <div className="density-chart">
                {peakHoursData.map((slot, index) => (
                    <motion.div
                        key={slot.time}
                        className={`density-bar-container ${currentSlotIndex === index ? 'current' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                    >
                        <div className="bar-time">{slot.time.split(' - ')[0]}</div>
                        <div className="bar-wrapper">
                            <motion.div
                                className="bar-fill"
                                style={{
                                    backgroundColor: getLevelColor(slot.level),
                                    height: `${slot.percentage}%`
                                }}
                                initial={{ height: 0 }}
                                animate={{ height: `${slot.percentage}%` }}
                                transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                            />
                            {currentSlotIndex === index && (
                                <motion.div
                                    className="current-indicator"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                />
                            )}
                        </div>
                        <div
                            className={`bar-label ${slot.level}`}
                            style={{ color: getLevelColor(slot.level) }}
                        >
                            {getLevelIcon(slot.level)}
                            <span>{slot.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="density-legend">
                <span className="legend-item">
                    <span className="legend-dot high"></span> Ramai
                </span>
                <span className="legend-item">
                    <span className="legend-dot medium"></span> Sedang
                </span>
                <span className="legend-item">
                    <span className="legend-dot low"></span> Sepi
                </span>
            </div>
        </div>
    );
}

export default FacilityDensityWidget;
