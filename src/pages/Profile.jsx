import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, RefreshCw, Bell, Settings, ChevronRight,
    LogOut, Calendar, Heart, Shield, HelpCircle
} from 'lucide-react';
import { userData } from '../utils/mockData';
import { useAuth } from '../hooks/useAuth.jsx';
import './Profile.css';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        {
            section: 'Akun',
            items: [
                { icon: Calendar, label: 'Sinkronisasi Jadwal', action: 'sync', badge: 'Aktif' },
                { icon: Heart, label: 'Preferensi Alat', action: 'preferences' },
                { icon: Bell, label: 'Notifikasi', action: 'notifications', toggle: true },
            ]
        },
        {
            section: 'Aplikasi',
            items: [
                { icon: Shield, label: 'Kebijakan Privasi', action: 'privacy' },
                { icon: HelpCircle, label: 'Bantuan & FAQ', action: 'help' },
                { icon: Settings, label: 'Pengaturan', action: 'settings' },
            ]
        }
    ];

    return (
        <div className="profile-page">
            <div className="container">
                {/* Profile Card */}
                <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="profile-avatar">
                        <img src={userData.avatar} alt={userData.name} />
                        <div className="avatar-badge">✓</div>
                    </div>

                    <div className="profile-info">
                        <h2 className="profile-name">{userData.name}</h2>
                        <p className="profile-nim">{userData.nim}</p>
                        <p className="profile-major">{userData.major}</p>
                    </div>

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">24</span>
                            <span className="stat-label">Booking</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-value">48</span>
                            <span className="stat-label">Jam</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-value">98%</span>
                            <span className="stat-label">Hadir</span>
                        </div>
                    </div>
                </motion.div>

                {/* Interests Tags */}
                <motion.div
                    className="interests-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="section-label">Minat & Preferensi</h3>
                    <div className="interests-tags">
                        {userData.interests.map((interest, i) => (
                            <span key={i} className="interest-tag">{interest}</span>
                        ))}
                        <button className="add-interest-btn">+ Tambah</button>
                    </div>
                </motion.div>

                {/* Menu Sections */}
                {menuItems.map((section, sectionIndex) => (
                    <motion.div
                        key={section.section}
                        className="menu-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (sectionIndex + 2) }}
                    >
                        <h3 className="section-label">{section.section}</h3>
                        <div className="menu-list">
                            {section.items.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <button key={i} className="menu-item">
                                        <div className="menu-icon">
                                            <Icon size={20} />
                                        </div>
                                        <span className="menu-label">{item.label}</span>

                                        {item.badge && (
                                            <span className="menu-badge">{item.badge}</span>
                                        )}

                                        {item.toggle ? (
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationsEnabled}
                                                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                                />
                                                <span className="toggle-slider" />
                                            </label>
                                        ) : (
                                            <ChevronRight size={18} className="menu-chevron" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Logout Button */}
                <motion.button
                    className="logout-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Keluar
                </motion.button>

                {/* App Version */}
                <p className="app-version">Resource Finder v1.0.0</p>
            </div>
        </div>
    );
}

export default Profile;
