import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Wrench, MoreVertical, AlertTriangle, Calendar } from 'lucide-react';
import { facilities } from '../../utils/mockData';
import FacilityDetailModal from './FacilityDetailModal';
import './Assets.css';

function Assets() {
    const [assetList, setAssetList] = useState(facilities);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get display status info for a facility
    const getStatusDisplay = (asset) => {
        // Room is in full maintenance mode
        if (asset.status === 'maintenance') {
            return {
                text: 'Maintenance',
                class: 'maintenance',
                isRoomMaintenance: true
            };
        }

        // Check for partial maintenance (some PCs in maintenance)
        if (asset.computers && asset.computers.length > 0) {
            const maintenancePCs = asset.computers.filter(pc => pc.status === 'maintenance').length;
            if (maintenancePCs > 0) {
                return {
                    text: `Tersedia (${maintenancePCs} PC Maintenance)`,
                    class: 'partial-maintenance',
                    maintenanceCount: maintenancePCs
                };
            }
        }

        // Normal status
        return {
            text: asset.status,
            class: asset.status
        };
    };

    // Get row class based on status
    const getRowClass = (asset) => {
        if (asset.status === 'maintenance') {
            return 'row-maintenance';
        }

        if (asset.computers && asset.computers.length > 0) {
            const maintenancePCs = asset.computers.filter(pc => pc.status === 'maintenance').length;
            if (maintenancePCs > 0) {
                return 'row-partial-maintenance';
            }
        }

        return '';
    };

    // Toggle room status (quick action)
    const toggleStatus = (id, e) => {
        e.stopPropagation(); // Prevent row click
        setAssetList(prev => prev.map(item => {
            if (item.id === id) {
                const newStatus = item.status === 'maintenance' ? 'available' : 'maintenance';
                const newComputers = item.computers?.map(pc => ({
                    ...pc,
                    status: newStatus
                }));
                return {
                    ...item,
                    status: newStatus,
                    computers: newComputers || item.computers
                };
            }
            return item;
        }));
    };

    // Handle row click to open modal
    const handleRowClick = (asset) => {
        setSelectedFacility(asset);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFacility(null);
    };

    // Handle facility update from modal
    const handleUpdateFacility = (updatedFacility) => {
        setAssetList(prev => prev.map(item =>
            item.id === updatedFacility.id ? updatedFacility : item
        ));
        setSelectedFacility(updatedFacility);
    };

    // Handle More button click
    const handleMoreClick = (asset, e) => {
        e.stopPropagation();
        handleRowClick(asset);
    };

    return (
        <div className="assets-page">
            <div className="page-actions">
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Tambah Aset
                </button>
            </div>

            <div className="assets-table-container">
                <table className="assets-table">
                    <thead>
                        <tr>
                            <th>Facility Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Last Serviced</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assetList.map((asset) => {
                            const statusDisplay = getStatusDisplay(asset);
                            const rowClass = getRowClass(asset);

                            return (
                                <tr
                                    key={asset.id}
                                    className={`clickable-row ${rowClass}`}
                                    onClick={() => handleRowClick(asset)}
                                >
                                    <td>
                                        <div className="asset-info">
                                            <img src={asset.image} alt="" className="asset-thumb" />
                                            <span className="asset-name">{asset.name}</span>
                                        </div>
                                    </td>
                                    <td>{asset.building} - {asset.floor}</td>
                                    <td>{asset.capacity} Seats</td>
                                    <td>
                                        <span className="last-serviced">
                                            <Calendar size={12} />
                                            {asset.lastServiced ? new Date(asset.lastServiced).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${statusDisplay.class}`}>
                                            {statusDisplay.maintenanceCount && (
                                                <AlertTriangle size={12} />
                                            )}
                                            {statusDisplay.text}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button
                                                className={`action-btn ${asset.status === 'maintenance' ? 'text-primary' : ''}`}
                                                title="Maintenance Mode"
                                                onClick={(e) => toggleStatus(asset.id, e)}
                                            >
                                                <Wrench size={18} />
                                            </button>
                                            <button
                                                className="action-btn"
                                                title="More"
                                                onClick={(e) => handleMoreClick(asset, e)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Facility Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedFacility && (
                    <FacilityDetailModal
                        facility={selectedFacility}
                        onClose={handleCloseModal}
                        onUpdateFacility={handleUpdateFacility}
                        onDeleteFacility={(id) => {
                            setAssetList(prev => prev.filter(item => item.id !== id));
                            handleCloseModal();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Assets;
