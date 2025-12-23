import { useState } from 'react';
import { Monitor, AlertCircle, User } from 'lucide-react';
import './PCSelectionGrid.css';

function PCSelectionGrid({ computers, rows, cols, selectedPC, onSelectPC }) {
    const [hoveredPC, setHoveredPC] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'pc-available';
            case 'occupied': return 'pc-occupied';
            case 'maintenance': return 'pc-maintenance';
            case 'reserved': return 'pc-reserved';
            default: return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'maintenance': return <AlertCircle size={14} />;
            case 'occupied': return <User size={14} />;
            default: return <Monitor size={14} />;
        }
    };

    const handleClick = (pc) => {
        if (pc.status === 'available') {
            onSelectPC(pc);
        }
    };

    return (
        <div className="pc-grid-container">
            <div className="pc-grid-header">
                <h3>Pilih Komputer</h3>
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
                    <span className="legend-item">
                        <span className="legend-dot selected"></span> Dipilih
                    </span>
                </div>
            </div>

            <div
                className="pc-grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
            >
                {computers.map((pc) => (
                    <div
                        key={pc.id}
                        className={`pc-cell ${getStatusColor(pc.status)} ${selectedPC?.id === pc.id ? 'pc-selected' : ''}`}
                        onClick={() => handleClick(pc)}
                        onMouseEnter={() => setHoveredPC(pc)}
                        onMouseLeave={() => setHoveredPC(null)}
                    >
                        {getStatusIcon(pc.status)}
                        <span className="pc-number">{pc.id}</span>
                    </div>
                ))}
            </div>

            {/* Tooltip */}
            {hoveredPC && (
                <div className="pc-tooltip">
                    <div className="tooltip-header">
                        <strong>{hoveredPC.id}</strong>
                        <span className={`tooltip-status ${hoveredPC.status}`}>
                            {hoveredPC.status === 'available' ? 'Tersedia' :
                                hoveredPC.status === 'occupied' ? 'Terpakai' :
                                    hoveredPC.status === 'maintenance' ? 'Maintenance' : hoveredPC.status}
                        </span>
                    </div>
                    <p className="tooltip-specs">{hoveredPC.specs}</p>
                    {hoveredPC.occupiedBy && (
                        <p className="tooltip-occupied">
                            Digunakan oleh: {hoveredPC.occupiedBy}<br />
                            Sampai: {hoveredPC.until}
                        </p>
                    )}
                </div>
            )}

            {selectedPC && (
                <div className="selected-pc-info">
                    <Monitor size={20} />
                    <span>Komputer dipilih: <strong>{selectedPC.id}</strong></span>
                </div>
            )}
        </div>
    );
}

export default PCSelectionGrid;
