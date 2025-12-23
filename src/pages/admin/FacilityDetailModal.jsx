import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, Monitor, AlertCircle, CheckCircle, Power } from 'lucide-react';
import './FacilityDetailModal.css';

function FacilityDetailModal({ facility, onClose, onUpdateFacility }) {
    const [localFacility, setLocalFacility] = useState(facility);

    // Check if room maintenance is fully enabled
    const isRoomMaintenance = localFacility.status === 'maintenance';

    // Count maintenance PCs
    const maintenancePCCount = localFacility.computers?.filter(
        pc => pc.status === 'maintenance'
    ).length || 0;

    const totalPCCount = localFacility.computers?.length || 0;

    // Handle room-wide maintenance toggle
    const handleRoomMaintenanceToggle = () => {
        const newStatus = isRoomMaintenance ? 'available' : 'maintenance';
        const newComputers = localFacility.computers?.map(pc => ({
            ...pc,
            status: newStatus
        }));

        const updatedFacility = {
            ...localFacility,
            status: newStatus,
            computers: newComputers || localFacility.computers
        };

        setLocalFacility(updatedFacility);
        onUpdateFacility(updatedFacility);
    };

    // Handle individual PC maintenance toggle
    const handlePCMaintenanceToggle = (pcId) => {
        const newComputers = localFacility.computers?.map(pc => {
            if (pc.id === pcId) {
                // Only toggle if current status is available or maintenance
                const newStatus = pc.status === 'maintenance' ? 'available' : 'maintenance';
                return { ...pc, status: newStatus };
            }
            return pc;
        });

        // Check if all PCs are now in maintenance
        const allMaintenance = newComputers?.every(pc => pc.status === 'maintenance');
        // Check if any PC is not maintenance (available or occupied)
        const anyNotMaintenance = newComputers?.some(pc => pc.status !== 'maintenance');

        const updatedFacility = {
            ...localFacility,
            computers: newComputers,
            // If all PCs are maintenance, set room to maintenance
            // If any PC is not maintenance, room should be available
            status: allMaintenance ? 'maintenance' : (anyNotMaintenance ? 'available' : localFacility.status)
        };

        setLocalFacility(updatedFacility);
        onUpdateFacility(updatedFacility);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'pc-available';
            case 'occupied': return 'pc-occupied';
            case 'maintenance': return 'pc-maintenance';
            default: return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'maintenance': return <AlertCircle size={14} />;
            case 'available': return <CheckCircle size={14} />;
            case 'occupied': return <Monitor size={14} />;
            default: return <Monitor size={14} />;
        }
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="facility-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-info">
                        <img src={localFacility.image} alt="" className="modal-image" />
                        <div>
                            <h2>{localFacility.name}</h2>
                            <p>{localFacility.building} - {localFacility.floor}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Stats */}
                <div className="modal-stats">
                    <div className="stat-box">
                        <span className="stat-value">{localFacility.capacity}</span>
                        <span className="stat-label">Kapasitas</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{totalPCCount}</span>
                        <span className="stat-label">Total PC</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{maintenancePCCount}</span>
                        <span className="stat-label">Maintenance</span>
                    </div>
                </div>

                {/* Room Maintenance Toggle */}
                <div className="room-maintenance-section">
                    <div className="room-toggle-info">
                        <Wrench size={20} />
                        <div>
                            <h4>Mode Maintenance Ruangan</h4>
                            <p>Setel seluruh ruangan dan semua PC ke status maintenance</p>
                        </div>
                    </div>
                    <motion.button
                        className={`room-toggle-btn ${isRoomMaintenance ? 'active' : ''}`}
                        onClick={handleRoomMaintenanceToggle}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Power size={18} />
                        {isRoomMaintenance ? 'Nonaktifkan' : 'Aktifkan'}
                    </motion.button>
                </div>

                {/* PC Grid (only for facilities with computers) */}
                {localFacility.computers && localFacility.computers.length > 0 && (
                    <div className="pc-management-section">
                        <div className="section-header">
                            <h3>Manajemen Per Komputer</h3>
                            <div className="pc-legend">
                                <span className="legend-item">
                                    <span className="legend-dot available"></span> Tersedia
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot occupied"></span> Terpakai
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot maintenance"></span> Maintenance
                                </span>
                            </div>
                        </div>

                        <div
                            className="admin-pc-grid"
                            style={{
                                gridTemplateColumns: `repeat(${localFacility.cols || 6}, 1fr)`
                            }}
                        >
                            {localFacility.computers.map((pc) => (
                                <motion.div
                                    key={pc.id}
                                    className={`admin-pc-cell ${getStatusColor(pc.status)}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="pc-info">
                                        {getStatusIcon(pc.status)}
                                        <span className="pc-id">{pc.id}</span>
                                    </div>
                                    <button
                                        className={`pc-toggle-btn ${pc.status === 'maintenance' ? 'active' : ''}`}
                                        onClick={() => handlePCMaintenanceToggle(pc.id)}
                                        disabled={pc.status === 'occupied'}
                                        title={pc.status === 'occupied' ? 'PC sedang digunakan' : 'Toggle maintenance'}
                                    >
                                        <Wrench size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No computers message */}
                {(!localFacility.computers || localFacility.computers.length === 0) && (
                    <div className="no-computers">
                        <Monitor size={32} />
                        <p>Fasilitas ini tidak memiliki komputer individual</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

export default FacilityDetailModal;
