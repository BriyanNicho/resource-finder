import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, AlertTriangle, Eye, UserX, Calendar, Mail, GraduationCap, Activity } from 'lucide-react';
import { registeredUsers } from '../../utils/mockData';
import './Users.css';

function AdminUsers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [userList, setUserList] = useState(registeredUsers);

    // Apply filters
    const filteredUsers = userList.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nim.includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return { label: 'Aktif', class: 'status-active' };
            case 'warning':
                return { label: 'Peringatan', class: 'status-warning' };
            case 'suspended':
                return { label: 'Ditangguhkan', class: 'status-suspended' };
            default:
                return { label: status, class: '' };
        }
    };

    const handleIssueWarning = (userId, userName) => {
        setUserList(prev => prev.map(user => {
            if (user.id === userId) {
                const newCount = user.warningCount + 1;
                const newStatus = newCount >= 3 ? 'warning' : user.status;
                alert(`⚠️ Peringatan #${newCount} diberikan kepada ${userName}`);
                return { ...user, warningCount: newCount, status: newStatus };
            }
            return user;
        }));
    };

    const handleSuspend = (userId, userName) => {
        if (confirm(`Yakin ingin menangguhkan akun ${userName}?`)) {
            setUserList(prev => prev.map(user => {
                if (user.id === userId) {
                    return { ...user, status: 'suspended' };
                }
                return user;
            }));
            alert(`🚫 Akun ${userName} telah ditangguhkan`);
        }
    };

    const handleViewActivity = (userId) => {
        alert(`📊 Melihat aktivitas user ${userId}`);
    };

    return (
        <div className="users-page">
            {/* Page Header */}
            <div className="users-header">
                <div className="header-title">
                    <Users size={24} />
                    <h1>Manajemen Pengguna</h1>
                </div>
                <span className="user-count">{filteredUsers.length} pengguna</span>
            </div>

            {/* Stats Overview */}
            <div className="user-stats">
                <div className="user-stat-card">
                    <span className="stat-value">{userList.filter(u => u.status === 'active').length}</span>
                    <span className="stat-label">Aktif</span>
                </div>
                <div className="user-stat-card warning">
                    <span className="stat-value">{userList.filter(u => u.status === 'warning').length}</span>
                    <span className="stat-label">Peringatan</span>
                </div>
                <div className="user-stat-card danger">
                    <span className="stat-value">{userList.filter(u => u.status === 'suspended').length}</span>
                    <span className="stat-label">Ditangguhkan</span>
                </div>
                <div className="user-stat-card info">
                    <span className="stat-value">{userList.reduce((sum, u) => sum + u.totalBookings, 0)}</span>
                    <span className="stat-label">Total Booking</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama, NIM, atau ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={16} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="warning">Peringatan</option>
                        <option value="suspended">Ditangguhkan</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Pengguna</th>
                            <th>NIM</th>
                            <th>Jurusan</th>
                            <th>Status</th>
                            <th>Peringatan</th>
                            <th>Booking</th>
                            <th>Bergabung</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => {
                            const statusConfig = getStatusConfig(user.status);
                            return (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={user.status === 'suspended' ? 'row-suspended' : ''}
                                >
                                    <td>
                                        <div className="user-cell">
                                            <img
                                                src={user.avatar}
                                                alt=""
                                                className="user-avatar"
                                            />
                                            <div className="user-info">
                                                <span className="user-name">{user.name}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="nim-badge">{user.nim}</span>
                                    </td>
                                    <td>
                                        <span className="major-cell">
                                            <GraduationCap size={14} />
                                            {user.major}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${statusConfig.class}`}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`warning-count ${user.warningCount > 0 ? 'has-warnings' : ''}`}>
                                            {user.warningCount > 0 && <AlertTriangle size={14} />}
                                            {user.warningCount}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="booking-count">{user.totalBookings}</span>
                                    </td>
                                    <td>
                                        <span className="date-cell">
                                            <Calendar size={12} />
                                            {formatDate(user.joinDate)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                title="Lihat Aktivitas"
                                                onClick={() => handleViewActivity(user.id)}
                                            >
                                                <Activity size={16} />
                                            </button>
                                            {user.status !== 'suspended' && (
                                                <>
                                                    <button
                                                        className="action-btn warn"
                                                        title="Beri Peringatan"
                                                        onClick={() => handleIssueWarning(user.id, user.name)}
                                                    >
                                                        <AlertTriangle size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn suspend"
                                                        title="Tangguhkan"
                                                        onClick={() => handleSuspend(user.id, user.name)}
                                                    >
                                                        <UserX size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <Users size={48} />
                        <p>Tidak ada pengguna ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
