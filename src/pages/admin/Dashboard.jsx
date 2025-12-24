import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, Clock, AlertCircle, CheckCircle, BarChart3, Wrench, TrendingUp,
    Monitor, History, MapPin, LogIn, LogOut, Calendar, AlertTriangle, Download,
    Search, QrCode, Building, Award
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import UsageTrendChart from '../../components/molecules/UsageTrendChart';
import '../../components/molecules/UsageTrendChart.css';
import QRScanner from '../../components/admin/QRScanner';
import './Dashboard.css';

function Dashboard() {
    const { bookings, facilities, activityLogs, usageHistory, stats: contextStats } = useAdmin();
    const [isDownloading, setIsDownloading] = useState(false);
    const [scanInput, setScanInput] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [showScanner, setShowScanner] = useState(false);

    const stats = [
        { label: 'Total Booking', value: contextStats.totalBookings, icon: CheckCircle, color: 'text-success' },
        { label: 'Booking Aktif', value: contextStats.activeBookings, icon: Users, color: 'text-primary' },
        { label: 'Isu Aktif', value: contextStats.activeIssues, icon: AlertCircle, color: 'text-danger' },
        { label: 'Rata-rata Durasi', value: contextStats.avgDuration, icon: Clock, color: 'text-warning' },
    ];

    // Calculate top booked facilities from REAL context data
    const topFacilities = useMemo(() => {
        const facilityCounts = {};
        bookings.forEach(booking => {
            const name = booking.facilityName;
            facilityCounts[name] = (facilityCounts[name] || 0) + 1;
        });
        return Object.entries(facilityCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [bookings]);

    // Get top 3 most-used PCs from facilities context
    const allComputers = facilities
        .filter(f => f.computers)
        .flatMap(f => f.computers.map(pc => ({
            ...pc,
            facility: f.name,
            facilityId: f.id
        })))
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 3);

    // Get PCs needing maintenance (usageCount > 200)
    const maintenanceAlerts = facilities
        .filter(f => f.computers)
        .flatMap(f => f.computers.map(pc => ({
            ...pc,
            facility: f.name,
            facilityId: f.id
        })))
        .filter(pc => (pc.usageCount || 0) > 200);

    // Calculate max usage for bar width
    const maxUsage = Math.max(...allComputers.map(pc => pc.usageCount || 0)) || 1;

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
            case 'cancel-booking':
                return { icon: <AlertTriangle size={14} />, color: 'danger', label: 'Cancelled' };
            default:
                return { icon: <History size={14} />, color: 'default', label: action };
        }
    };

    const handleDownloadReport = () => {
        setIsDownloading(true);

        // Generate CSV content
        const headers = ['ID', 'User', 'Facility', 'PC', 'Date', 'Time', 'Status', 'Purpose'];
        const csvContent = [
            headers.join(','),
            ...bookings.map(b => [
                b.id,
                `"${b.userName}"`, // Quote to handle commas in names
                `"${b.facilityName}"`,
                b.pcNumber || '-',
                b.date,
                `${b.startTime}-${b.endTime}`,
                b.status,
                `"${b.purpose}"`
            ].join(','))
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Laporan_Booking_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);

        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            setIsDownloading(false);
            // alert('Laporan Bulanan berhasil diunduh!'); // Removed alert for cleaner UX
        }, 1000);
    };

    // Scan Simulator logic using Context Bookings
    const handleScan = (scannedId = null) => {
        const idToVerify = typeof scannedId === 'string' ? scannedId : scanInput;

        if (!idToVerify.trim()) {
            setScanResult({ status: 'error', message: 'Masukkan ID Booking' });
            return;
        }

        const booking = bookings.find(b =>
            b.id.toLowerCase() === idToVerify.toLowerCase()
        );

        if (!booking) {
            setScanResult({
                status: 'invalid',
                message: 'Booking tidak ditemukan',
                icon: <AlertCircle size={20} />
            });
        } else if (booking.status === 'cancelled') {
            setScanResult({
                status: 'expired',
                message: 'Booking sudah dibatalkan',
                booking,
                icon: <AlertTriangle size={20} />
            });
        } else if (booking.status === 'completed') {
            setScanResult({
                status: 'expired',
                message: 'Booking sudah selesai',
                booking,
                icon: <AlertTriangle size={20} />
            });
        } else {
            setScanResult({
                status: 'valid',
                message: 'Booking valid!',
                booking,
                icon: <CheckCircle size={20} />
            });
        }

        // If it was a successful camera scan, close the scanner
        if (typeof scannedId === 'string') {
            setShowScanner(false);
            setScanInput(scannedId); // Fill input for visibility
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Dashboard Header with Download Button */}
            <div className="dashboard-header">
                <h2 className="dashboard-title">Dashboard Admin</h2>
                <button
                    className="btn btn-secondary download-btn"
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <>
                            <span className="spinner-small" />
                            Mengunduh...
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Unduh Laporan Bulanan
                        </>
                    )}
                </button>
            </div>

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

            {/* Scan Simulator & Booking Trend Row */}
            <div className="dashboard-analytics-row">
                {/* Scan Simulator */}
                <motion.div
                    className="scan-simulator"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="section-header">
                        <div className="section-title-group">
                            <QrCode size={20} className="section-icon" />
                            <h3 className="section-title">Scanner Booking</h3>
                        </div>
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setShowScanner(true)}
                        >
                            <QrCode size={14} /> Scan Kamera
                        </button>
                    </div>
                    <p className="scan-description">Verifikasi ID Booking via Kamera atau ID</p>

                    <div className="scan-input-group">
                        <input
                            type="text"
                            placeholder="Masukkan ID Booking (e.g. BK-001)"
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        />
                        <button className="btn btn-primary" onClick={handleScan}>
                            <Search size={16} />
                            Verifikasi
                        </button>
                    </div>

                    {scanResult && (
                        <motion.div
                            className={`scan-result ${scanResult.status}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {scanResult.icon}
                            <div className="result-content">
                                <span className="result-message">{scanResult.message}</span>
                                {scanResult.booking && (
                                    <div className="result-details">
                                        <span>{scanResult.booking.userName}</span>
                                        <span>•</span>
                                        <span>{scanResult.booking.facilityName}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Real QR Scanner Modal */}
                {showScanner && (
                    <QRScanner
                        onScan={(data) => handleScan(data)}
                        onClose={() => setShowScanner(false)}
                    />
                )}

                {/* Top Booked Facilities */}
                <motion.div
                    className="top-facilities"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="section-header">
                        <div className="section-title-group">
                            <Award size={20} className="section-icon text-warning" />
                            <h3 className="section-title">Fasilitas Paling Laku</h3>
                        </div>
                    </div>

                    <div className="facilities-list">
                        {topFacilities.map((facility, index) => (
                            <motion.div
                                key={facility.name}
                                className="facility-item"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <span className="facility-rank">#{index + 1}</span>
                                <Building size={16} />
                                <span className="facility-name">{facility.name}</span>
                                <span className="facility-count">{facility.count} booking</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Booking Trend Chart */}
            <motion.div
                className="booking-trend-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
            >
                <div className="section-header">
                    <div className="section-title-group">
                        <TrendingUp size={20} className="section-icon" />
                        <h3 className="section-title">Booking per Hari (30 Hari)</h3>
                    </div>
                </div>
                <UsageTrendChart data={usageHistory} width={800} height={180} />
            </motion.div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Asset Insights Section */}
                <motion.div
                    className="insights-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
                        <span>PC dengan penggunaan tinggi perlu rotasi maintenance</span>
                    </div>

                    <div className="top-pcs-list">
                        {allComputers.map((pc, index) => (
                            <motion.div
                                key={`${pc.facilityId}-${pc.id}`}
                                className="top-pc-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
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
                                            transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="pc-stats">
                                        <span>{pc.usageCount} sesi</span>
                                        <span>{pc.totalHours}h total</span>
                                    </div>
                                </div>
                                {pc.status === 'maintenance' && (
                                    <span className="maintenance-badge">🔧</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Maintenance Alerts Section */}
                <motion.div
                    className="alerts-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="section-header">
                        <div className="section-title-group">
                            <AlertTriangle size={20} className="section-icon text-warning" />
                            <h3 className="section-title">Maintenance Alerts</h3>
                        </div>
                        <span className="alert-count">{maintenanceAlerts.length} PC</span>
                    </div>

                    <div className="alerts-description">
                        PC dengan &gt;200 sesi perlu maintenance segera
                    </div>

                    <div className="alerts-list">
                        {maintenanceAlerts.length > 0 ? (
                            maintenanceAlerts.slice(0, 5).map((pc, index) => (
                                <motion.div
                                    key={`alert-${pc.facilityId}-${pc.id}`}
                                    className={`alert-item ${pc.status === 'maintenance' ? 'in-maintenance' : ''}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                >
                                    <Monitor size={14} />
                                    <span className="alert-pc">{pc.id}</span>
                                    <span className="alert-facility">{pc.facility}</span>
                                    <span className="alert-usage">{pc.usageCount} sesi</span>
                                    {pc.status === 'maintenance' ? (
                                        <span className="alert-status done">🔧 Dalam Perbaikan</span>
                                    ) : (
                                        <span className="alert-status pending">⚠️ Perlu Cek</span>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="no-alerts">
                                <CheckCircle size={24} />
                                <span>Tidak ada alert</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Log */}
            <motion.div
                className="activity-log-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className="section-header">
                    <div className="section-title-group">
                        <History size={20} className="section-icon" />
                        <h3 className="section-title">Recent Activity Log</h3>
                    </div>
                    {/* UPDATED: Link instead of a tag for SPA navigation */}
                    <Link to="/admin/activity" className="view-all-link">Lihat Semua →</Link>
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
                                transition={{ delay: 0.9 + index * 0.05 }}
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
        </div>
    );
}

export default Dashboard;
