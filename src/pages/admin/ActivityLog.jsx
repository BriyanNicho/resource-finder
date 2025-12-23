import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Clock, MapPin, Monitor, Filter, Search, LogIn, LogOut, Calendar, AlertTriangle } from 'lucide-react';
import { activityLogs, facilities } from '../../utils/mockData';
import './ActivityLog.css';

function AdminActivityLog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFacility, setFilterFacility] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [warnings, setWarnings] = useState({});

    // Sort logs by timestamp (newest first)
    const sortedLogs = [...activityLogs].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Apply filters
    const filteredLogs = sortedLogs.filter(log => {
        const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFacility = filterFacility === 'all' || log.facilityId === parseInt(filterFacility);
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        return matchesSearch && matchesFacility && matchesAction;
    });

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionConfig = (action) => {
        switch (action) {
            case 'check-in':
                return { icon: <LogIn size={16} />, color: 'success', label: 'Check In' };
            case 'check-out':
                return { icon: <LogOut size={16} />, color: 'danger', label: 'Check Out' };
            case 'booking':
                return { icon: <Calendar size={16} />, color: 'primary', label: 'Booking' };
            default:
                return { icon: <History size={16} />, color: 'default', label: action };
        }
    };

    const handleWarning = (userId, userName) => {
        setWarnings(prev => {
            const currentCount = prev[userId] || 0;
            const newCount = currentCount + 1;
            alert(`⚠️ Peringatan #${newCount} diberikan kepada ${userName} (${userId})`);
            return {
                ...prev,
                [userId]: newCount
            };
        });
    };

    return (
        <div className="admin-activity-log">
            {/* Page Header */}
            <div className="log-header">
                <div className="header-title">
                    <History size={24} />
                    <h1>Log Aktivitas</h1>
                </div>
                <span className="log-count">{filteredLogs.length} aktivitas</span>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama atau ID user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={16} />
                    <select
                        value={filterFacility}
                        onChange={(e) => setFilterFacility(e.target.value)}
                    >
                        <option value="all">Semua Fasilitas</option>
                        {facilities.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                    >
                        <option value="all">Semua Aksi</option>
                        <option value="check-in">Check In</option>
                        <option value="check-out">Check Out</option>
                        <option value="booking">Booking</option>
                    </select>
                </div>
            </div>

            {/* Activity Table */}
            <div className="activity-table-container">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Aksi</th>
                            <th>Fasilitas</th>
                            <th>PC</th>
                            <th>Waktu</th>
                            <th>Durasi</th>
                            <th>Moderasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log, index) => {
                            const actionConfig = getActionConfig(log.action);
                            const userWarnings = warnings[log.userId] || 0;
                            return (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={userWarnings > 0 ? 'row-warned' : ''}
                                >
                                    <td>
                                        <div className="user-cell">
                                            <img
                                                src={log.userAvatar}
                                                alt=""
                                                className="user-avatar"
                                            />
                                            <div className="user-info">
                                                <span className="user-name">
                                                    {log.userName}
                                                    {userWarnings > 0 && (
                                                        <span className="warning-badge" title={`${userWarnings} peringatan`}>
                                                            ⚠️ {userWarnings}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="user-id">{log.userId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`action-badge ${actionConfig.color}`}>
                                            {actionConfig.icon}
                                            {actionConfig.label}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="facility-name">
                                            <MapPin size={14} />
                                            {log.facility}
                                        </span>
                                    </td>
                                    <td>
                                        {log.pcNumber ? (
                                            <span className="pc-badge">
                                                <Monitor size={14} />
                                                {log.pcNumber}
                                            </span>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="timestamp">
                                            <Clock size={14} />
                                            {formatTimestamp(log.timestamp)}
                                        </span>
                                    </td>
                                    <td>
                                        {log.duration ? (
                                            <span className="duration-badge">{log.duration}</span>
                                        ) : (
                                            <span className="text-muted">Ongoing</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="warn-btn"
                                            onClick={() => handleWarning(log.userId, log.userName)}
                                            title="Beri peringatan kepada user ini"
                                        >
                                            <AlertTriangle size={14} />
                                            Peringatan
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredLogs.length === 0 && (
                    <div className="empty-state">
                        <History size={48} />
                        <p>Tidak ada aktivitas ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminActivityLog;
