import { motion } from 'framer-motion';
import { Users, Clock, AlertCircle, CheckCircle, BarChart3, Wrench, TrendingUp, Monitor, History, MapPin, LogIn, LogOut, Calendar } from 'lucide-react';
import { facilities, activityLogs } from '../../utils/mockData';
import './Dashboard.css';

function Dashboard() {
    const stats = [
        { label: 'Total Booking', value: '124', icon: CheckCircle, color: 'text-success' },
        { label: 'Sedang Digunakan', value: '45', icon: Users, color: 'text-primary' },
        { label: 'Isu Aktif', value: '3', icon: AlertCircle, color: 'text-danger' },
        { label: 'Rata-rata Durasi', value: '1.5h', icon: Clock, color: 'text-warning' },
    ];

    // Get top 3 most-used PCs from all facilities
    const allComputers = facilities
        .filter(f => f.computers)
        .flatMap(f => f.computers.map(pc => ({
            ...pc,
            facility: f.name,
            facilityId: f.id
        })))
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 3);

    // Calculate max usage for bar width
    const maxUsage = Math.max(...allComputers.map(pc => pc.usageCount || 0));

    // Get recent activity logs
    const recentLogs = [...activityLogs]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionConfig = (action) => {
        switch (action) {
            case 'check-in':
                return { icon: <LogIn size={14} />, color: 'success', label: 'Check In' };
            case 'check-out':
                return { icon: <LogOut size={14} />, color: 'danger', label: 'Check Out' };
            case 'booking':
                return { icon: <Calendar size={14} />, color: 'primary', label: 'Booking' };
            default:
                return { icon: <History size={14} />, color: 'default', label: action };
        }
    };

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

            {/* Asset Insights Section */}
            <motion.div
                className="insights-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="section-header">
                    <div className="section-title-group">
                        <BarChart3 size={20} className="section-icon" />
                        <h3 className="section-title">Asset Insights</h3>
                    </div>
                    <span className="insights-badge">
                        <TrendingUp size={14} /> Top Digunakan
                    </span>
                </div>

                <div className="insights-description">
                    <Wrench size={14} />
                    <span>PC dengan penggunaan tinggi perlu rotasi maintenance lebih sering</span>
                </div>

                <div className="top-pcs-list">
                    {allComputers.map((pc, index) => (
                        <motion.div
                            key={`${pc.facilityId}-${pc.id}`}
                            className="top-pc-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <div className="pc-rank">#{index + 1}</div>
                            <div className="pc-details">
                                <div className="pc-header">
                                    <Monitor size={16} />
                                    <span className="pc-name">{pc.id}</span>
                                    <span className="pc-facility">{pc.facility}</span>
                                </div>
                                <div className="pc-usage-bar">
                                    <motion.div
                                        className="usage-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(pc.usageCount / maxUsage) * 100}%` }}
                                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                    />
                                </div>
                                <div className="pc-stats">
                                    <span>{pc.usageCount} sesi</span>
                                    <span>{pc.totalHours}h total</span>
                                    {pc.lastUsedBy && <span>Last: {pc.lastUsedBy}</span>}
                                </div>
                            </div>
                            {pc.status === 'maintenance' && (
                                <span className="maintenance-badge">🔧 Maintenance</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity Log */}
            <motion.div
                className="activity-log-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="section-header">
                    <div className="section-title-group">
                        <History size={20} className="section-icon" />
                        <h3 className="section-title">Recent Activity Log</h3>
                    </div>
                    <a href="/admin/activity" className="view-all-link">Lihat Semua →</a>
                </div>

                <div className="activity-table-compact">
                    {recentLogs.map((log, index) => {
                        const actionConfig = getActionConfig(log.action);
                        return (
                            <motion.div
                                key={log.id}
                                className="activity-row"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.05 }}
                            >
                                <img src={log.userAvatar} alt="" className="activity-avatar" />
                                <div className="activity-info">
                                    <span className="activity-user">{log.userName}</span>
                                    <span className={`activity-action-badge ${actionConfig.color}`}>
                                        {actionConfig.icon}
                                        {actionConfig.label}
                                    </span>
                                </div>
                                <div className="activity-meta">
                                    <span className="activity-facility">
                                        <MapPin size={12} />
                                        {log.facility}
                                    </span>
                                    {log.pcNumber && (
                                        <span className="activity-pc">
                                            <Monitor size={12} />
                                            {log.pcNumber}
                                        </span>
                                    )}
                                </div>
                                <span className="activity-time">{formatTimestamp(log.timestamp)}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

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
