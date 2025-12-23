import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Clock, MapPin, Monitor, TrendingUp, Calendar, Star } from 'lucide-react';
import { activityLogs, userWeeklyStats, userData } from '../utils/mockData';
import './ActivityLog.css';

function ActivityLog() {
    const [activeTab, setActiveTab] = useState('history');

    // Filter logs for current user
    const userLogs = activityLogs
        .filter(log => log.userId === userData.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'check-in': return '🟢';
            case 'check-out': return '🔴';
            case 'booking': return '📅';
            default: return '📋';
        }
    };

    const getActionLabel = (action) => {
        switch (action) {
            case 'check-in': return 'Check In';
            case 'check-out': return 'Check Out';
            case 'booking': return 'Booking';
            default: return action;
        }
    };

    return (
        <div className="activity-log-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <History size={24} />
                    <h1>Log Aktivitas</h1>
                </motion.div>

                {/* Tab Navigation */}
                <div className="tab-nav">
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={16} />
                        Riwayat
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <TrendingUp size={16} />
                        Statistik Minggu Ini
                    </button>
                </div>

                {/* History Tab */}
                {activeTab === 'history' && (
                    <motion.div
                        className="activity-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {userLogs.length > 0 ? (
                            userLogs.map((log, index) => (
                                <motion.div
                                    key={log.id}
                                    className="activity-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <span className="activity-icon">{getActionIcon(log.action)}</span>
                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <span className="activity-action">{getActionLabel(log.action)}</span>
                                            <span className="activity-time">
                                                <Clock size={12} />
                                                {formatTimestamp(log.timestamp)}
                                            </span>
                                        </div>
                                        <div className="activity-details">
                                            <span className="facility">
                                                <MapPin size={14} />
                                                {log.facility}
                                            </span>
                                            {log.pcNumber && (
                                                <span className="pc">
                                                    <Monitor size={14} />
                                                    {log.pcNumber}
                                                </span>
                                            )}
                                            {log.duration && (
                                                <span className="duration">⏱️ {log.duration}</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <History size={48} />
                                <p>Belum ada aktivitas</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <motion.div
                        className="stats-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Summary Cards */}
                        <div className="stats-summary">
                            <div className="summary-card">
                                <Clock size={24} />
                                <div className="summary-content">
                                    <span className="summary-value">{userWeeklyStats.totalHours}h</span>
                                    <span className="summary-label">Total Jam</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <Calendar size={24} />
                                <div className="summary-content">
                                    <span className="summary-value">{userWeeklyStats.sessionsCount}</span>
                                    <span className="summary-label">Sesi</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <Star size={24} />
                                <div className="summary-content">
                                    <span className="summary-value">{userWeeklyStats.peakDay}</span>
                                    <span className="summary-label">Hari Paling Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* Favorite Spot */}
                        <div className="favorite-spot">
                            <h3>💻 Tempat Favorit</h3>
                            <p>{userWeeklyStats.favoriteSpot}</p>
                        </div>

                        {/* Weekly Chart */}
                        <div className="weekly-chart">
                            <h3>Penggunaan Mingguan</h3>
                            <div className="chart-bars">
                                {userWeeklyStats.weeklyData.map((day, index) => (
                                    <motion.div
                                        key={day.day}
                                        className="chart-bar"
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <motion.div
                                            className="bar-fill"
                                            style={{
                                                height: `${(day.hours / 4) * 100}%`,
                                                minHeight: day.hours > 0 ? '8px' : '0'
                                            }}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(day.hours / 4) * 100}%` }}
                                            transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                                        />
                                        <span className="bar-label">{day.day}</span>
                                        <span className="bar-value">{day.hours}h</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default ActivityLog;
