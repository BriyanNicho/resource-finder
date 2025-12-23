import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, List, Map as MapIcon } from 'lucide-react';
import FacilityCard from '../components/molecules/FacilityCard';
import { facilities, categories } from '../utils/mockData';
import './Explore.css';

function Explore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    const filteredFacilities = facilities.filter(facility => {
        const matchesSearch =
            facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            facility.software?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            facility.specs?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || facility.type === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="explore-page">
            {/* Search Bar */}
            <div className="search-section">
                <div className="search-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Cari fasilitas, software..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    className={`view-toggle ${viewMode === 'map' ? 'active' : ''}`}
                    onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                >
                    {viewMode === 'list' ? <MapIcon size={20} /> : <List size={20} />}
                </button>
            </div>

            {/* Category Filters */}
            <div className="categories-scroll">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        <span className="chip-icon">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* View Content */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        className="facilities-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {filteredFacilities.length > 0 ? (
                            filteredFacilities.map((facility, index) => (
                                <FacilityCard key={facility.id} facility={facility} index={index} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <span className="empty-icon">🔍</span>
                                <h3>Tidak ditemukan</h3>
                                <p>Coba kata kunci lain atau ubah filter</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="map"
                        className="map-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="map-placeholder">
                            <div className="map-content">
                                <div className="campus-map">
                                    {/* SVG Campus Map */}
                                    <svg viewBox="0 0 400 300" className="campus-svg">
                                        {/* Buildings */}
                                        <rect x="50" y="40" width="80" height="60" rx="8" className="building" />
                                        <text x="90" y="75" className="building-label">Gedung A</text>

                                        <rect x="160" y="30" width="100" height="80" rx="8" className="building" />
                                        <text x="210" y="75" className="building-label">Gedung D</text>

                                        <rect x="290" y="50" width="70" height="50" rx="8" className="building" />
                                        <text x="325" y="80" className="building-label">Lib</text>

                                        <rect x="80" y="140" width="90" height="70" rx="8" className="building" />
                                        <text x="125" y="180" className="building-label">Gedung C</text>

                                        <rect x="200" y="150" width="120" height="60" rx="8" className="building" />
                                        <text x="260" y="185" className="building-label">Perpustakaan</text>

                                        {/* Paths */}
                                        <path d="M130 100 L130 140" className="path" />
                                        <path d="M210 110 L210 150" className="path" />
                                        <path d="M130 175 L200 175" className="path" />

                                        {/* Facility Markers */}
                                        {filteredFacilities.map((f, i) => {
                                            const positions = [
                                                { x: 180, y: 60 },
                                                { x: 120, y: 160 },
                                                { x: 220, y: 55 },
                                                { x: 100, y: 170 },
                                                { x: 270, y: 170 },
                                                { x: 80, y: 60 },
                                            ];
                                            const pos = positions[i % positions.length];
                                            const color = f.status === 'available' ? '#22C55E' :
                                                f.status === 'limited' ? '#F59E0B' :
                                                    f.status === 'full' ? '#EF4444' : '#6B7280';
                                            return (
                                                <g key={f.id} className="marker-group">
                                                    <circle
                                                        cx={pos.x}
                                                        cy={pos.y}
                                                        r="12"
                                                        fill={color}
                                                        className="marker"
                                                    />
                                                    <circle
                                                        cx={pos.x}
                                                        cy={pos.y}
                                                        r="12"
                                                        fill={color}
                                                        opacity="0.3"
                                                        className="marker-pulse"
                                                    />
                                                    <text
                                                        x={pos.x}
                                                        y={pos.y + 4}
                                                        className="marker-label"
                                                    >
                                                        {f.available}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>

                                {/* Legend */}
                                <div className="map-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot available"></span>
                                        <span>Tersedia</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot warning"></span>
                                        <span>Hampir Penuh</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot full"></span>
                                        <span>Penuh</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Sheet with List */}
                            <div className="map-sheet">
                                <div className="sheet-handle" />
                                <h4 className="sheet-title">Fasilitas Terdekat</h4>
                                <div className="sheet-list">
                                    {filteredFacilities.slice(0, 3).map(f => (
                                        <div key={f.id} className="sheet-item">
                                            <div className={`status-dot ${f.status}`} />
                                            <div className="sheet-item-info">
                                                <span className="sheet-item-name">{f.name}</span>
                                                <span className="sheet-item-meta">{f.available}/{f.capacity} tersedia</span>
                                            </div>
                                            <span className="sheet-item-distance">{f.distance}m</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Explore;
