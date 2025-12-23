import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarCheck, Search, Filter, XCircle, UserCheck, Plus,
    Clock, MapPin, Monitor, X, AlertTriangle, Calendar, User
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './ManageBookings.css';

function ManageBookings() {
    const { bookings, facilities, addBooking, cancelBooking, checkInBooking } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // New reservation form state
    const [newReservation, setNewReservation] = useState({
        facilityId: '',
        pcNumber: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });

    // Filter active and upcoming bookings
    const activeBookings = bookings.filter(b =>
        b.status === 'active' || b.status === 'pending' || b.status === 'approved'
    );

    const filteredBookings = activeBookings.filter(booking => {
        const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return { label: 'Aktif', class: 'status-active' };
            case 'pending':
                return { label: 'Menunggu', class: 'status-pending' };
            case 'approved':
                return { label: 'Disetujui', class: 'status-approved' };
            default:
                return { label: status, class: '' };
        }
    };

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (selectedBooking) {
            cancelBooking(selectedBooking.id, 'Admin Request');
            alert(`✅ Booking ${selectedBooking.id} telah dibatalkan.\nPC ${selectedBooking.pcNumber || 'N/A'} kembali tersedia.`);
        }
        setShowCancelModal(false);
        setSelectedBooking(null);
    };

    const handleManualCheckIn = (booking) => {
        checkInBooking(booking.id);
        alert(`✅ ${booking.userName} telah di-check-in secara manual untuk ${booking.facilityName}`);
    };

    const handleCreateReservation = (e) => {
        e.preventDefault();

        const facility = facilities.find(f => f.id === parseInt(newReservation.facilityId));

        const newBooking = {
            id: `BK-ADM-${Date.now().toString().slice(-4)}`,
            userId: 'ADMIN',
            userName: 'Reservasi Internal',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            facilityId: parseInt(newReservation.facilityId),
            facilityName: facility?.name || 'Unknown',
            pcNumber: newReservation.pcNumber || null,
            date: newReservation.date,
            startTime: newReservation.startTime,
            endTime: newReservation.endTime,
            duration: '2h',
            status: 'approved',
            purpose: newReservation.purpose,
            isInternal: true
        };

        addBooking(newBooking);

        alert(`✅ Reservasi internal berhasil dibuat: ${newBooking.id}`);
        setShowCreateModal(false);
        setNewReservation({
            facilityId: '',
            pcNumber: '',
            date: '',
            startTime: '',
            endTime: '',
            purpose: ''
        });
    };

    return (
        <div className="manage-bookings-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-title">
                    <CalendarCheck size={24} />
                    <h1>Manajemen Booking</h1>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={16} />
                    Buat Reservasi Internal
                </button>
            </div>

            {/* Stats */}
            <div className="booking-stats">
                <div className="stat-item">
                    <span className="stat-value">{activeBookings.filter(b => b.status === 'active').length}</span>
                    <span className="stat-label">Aktif</span>
                </div>
                <div className="stat-item pending">
                    <span className="stat-value">{activeBookings.filter(b => b.status === 'pending').length}</span>
                    <span className="stat-label">Menunggu</span>
                </div>
                <div className="stat-item approved">
                    <span className="stat-value">{activeBookings.filter(b => b.status === 'approved').length}</span>
                    <span className="stat-label">Disetujui</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama atau ID booking..."
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
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bookings-table-container">
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pengguna</th>
                            <th>Fasilitas</th>
                            <th>Jadwal</th>
                            <th>Tujuan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);
                            return (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={booking.isInternal ? 'internal-booking' : ''}
                                >
                                    <td>
                                        <span className="booking-id">
                                            {booking.id}
                                            {booking.isInternal && <span className="internal-badge">INT</span>}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <img src={booking.userAvatar} alt="" className="user-avatar" />
                                            <span>{booking.userName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="facility-cell">
                                            <MapPin size={14} />
                                            <span>{booking.facilityName}</span>
                                            {booking.pcNumber && (
                                                <span className="pc-badge">
                                                    <Monitor size={12} />
                                                    {booking.pcNumber}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="schedule-cell">
                                            <span className="date">{formatDate(booking.date)}</span>
                                            <span className="time">
                                                <Clock size={12} />
                                                {booking.startTime} - {booking.endTime}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="purpose">{booking.purpose}</span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${statusConfig.class}`}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {(booking.status === 'pending' || booking.status === 'approved') && (
                                                <button
                                                    className="action-btn checkin"
                                                    title="Check-in Manual"
                                                    onClick={() => handleManualCheckIn(booking)}
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                            )}
                                            <button
                                                className="action-btn cancel"
                                                title="Batalkan Booking"
                                                onClick={() => handleCancelClick(booking)}
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredBookings.length === 0 && (
                    <div className="empty-state">
                        <CalendarCheck size={48} />
                        <p>Tidak ada booking aktif</p>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && selectedBooking && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCancelModal(false)}
                    >
                        <motion.div
                            className="modal-content cancel-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <AlertTriangle size={24} className="text-warning" />
                                <h3>Batalkan Booking</h3>
                                <button className="close-btn" onClick={() => setShowCancelModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Yakin ingin membatalkan booking ini?</p>
                                <div className="booking-preview">
                                    <div className="preview-row">
                                        <span>ID:</span>
                                        <strong>{selectedBooking.id}</strong>
                                    </div>
                                    <div className="preview-row">
                                        <span>User:</span>
                                        <strong>{selectedBooking.userName}</strong>
                                    </div>
                                    <div className="preview-row">
                                        <span>Fasilitas:</span>
                                        <strong>{selectedBooking.facilityName}</strong>
                                    </div>
                                    <div className="preview-row">
                                        <span>PC:</span>
                                        <strong>{selectedBooking.pcNumber || '-'}</strong>
                                    </div>
                                </div>
                                <p className="warning-text">
                                    ⚠️ PC terkait akan otomatis kembali tersedia
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCancelModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleConfirmCancel}
                                >
                                    <XCircle size={16} />
                                    Ya, Batalkan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Internal Reservation Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="modal-content create-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <Plus size={24} className="text-primary" />
                                <h3>Buat Reservasi Internal</h3>
                                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateReservation}>
                                <div className="modal-body">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Fasilitas *</label>
                                            <select
                                                required
                                                value={newReservation.facilityId}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    facilityId: e.target.value
                                                }))}
                                            >
                                                <option value="">Pilih Fasilitas</option>
                                                {facilities.map(f => (
                                                    <option key={f.id} value={f.id}>{f.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>PC (Opsional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. PC-05"
                                                value={newReservation.pcNumber}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    pcNumber: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tanggal *</label>
                                            <input
                                                type="date"
                                                required
                                                value={newReservation.date}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    date: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Waktu Mulai *</label>
                                            <input
                                                type="time"
                                                required
                                                value={newReservation.startTime}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    startTime: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Waktu Selesai *</label>
                                            <input
                                                type="time"
                                                required
                                                value={newReservation.endTime}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    endTime: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Tujuan/Keterangan *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Ujian Semester, Maintenance"
                                                value={newReservation.purpose}
                                                onChange={(e) => setNewReservation(prev => ({
                                                    ...prev,
                                                    purpose: e.target.value
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <CalendarCheck size={16} />
                                        Buat Reservasi
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ManageBookings;
