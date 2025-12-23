import { motion } from 'framer-motion';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { facilities } from '../../utils/mockData';
import './Dashboard.css';

function Dashboard() {
    const stats = [
        { label: 'Total Booking', value: '124', icon: CheckCircle, color: 'text-success' },
        { label: 'Sedang Digunakan', value: '45', icon: Users, color: 'text-primary' },
        { label: 'Isu Aktif', value: '3', icon: AlertCircle, color: 'text-danger' },
        { label: 'Rata-rata Durasi', value: '1.5h', icon: Clock, color: 'text-warning' },
    ];

    return (
        <div className="admin-dashboard">
            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`stat-icon-wrapper ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Live Occupancy */}
            <div className="section-header">
                <h3 className="section-title">Live Occupancy Monitor</h3>
                <span className="live-indicator">
                    <span className="pulse-dot" /> Live
                </span>
            </div>

            <div className="occupancy-grid">
                {facilities.map((facility, index) => (
                    <motion.div
                        key={facility.id}
                        className={`occupancy-card ${facility.status}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="occupancy-header">
                            <h4 className="occupancy-name">{facility.name}</h4>
                            <span className={`status-badge ${facility.status}`}>
                                {facility.status === 'maintenance' ? '🔧' : '●'}
                            </span>
                        </div>

                        <div className="occupancy-progress">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${(facility.available / facility.capacity) * 100}%`,
                                    background: facility.status === 'full' ? 'var(--status-full)' :
                                        facility.status === 'limited' ? 'var(--status-warning)' :
                                            'var(--status-available)'
                                }}
                            />
                        </div>

                        <div className="occupancy-stats">
                            <span>{facility.available} / {facility.capacity} Available</span>
                            <span>{facility.building}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
