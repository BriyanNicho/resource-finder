import { useState } from 'react';
import { Monitor, AlertCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
                {computers.map((pc, index) => (
                    <motion.div
                        key={pc.id}
                        className={`pc-cell ${getStatusColor(pc.status)} ${selectedPC?.id === pc.id ? 'pc-selected' : ''}`}
                        onClick={() => handleClick(pc)}
                        onMouseEnter={() => setHoveredPC(pc)}
                        onMouseLeave={() => setHoveredPC(null)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.2,
                            delay: index * 0.02,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        whileHover={pc.status === 'available' ? {
                            scale: 1.1,
                            transition: { duration: 0.15 }
                        } : {}}
                        whileTap={pc.status === 'available' ? {
                            scale: 0.95,
                            transition: { duration: 0.1 }
                        } : {}}
                    >
                        {selectedPC?.id === pc.id && (
                            <motion.div
                                className="pc-glow"
                                layoutId="pcGlow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        {getStatusIcon(pc.status)}
                        <span className="pc-number">{pc.id}</span>
                    </motion.div>
                ))}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredPC && (
                    <motion.div
                        className="pc-tooltip"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedPC && (
                    <motion.div
                        className="selected-pc-info"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <Monitor size={20} />
                        <span>Komputer dipilih: <strong>{selectedPC.id}</strong></span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PCSelectionGrid;
