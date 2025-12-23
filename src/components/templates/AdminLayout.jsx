import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, Box, AlertCircle,
    Users, LogOut, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.jsx';
import './AdminLayout.css';

const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/schedule', icon: Calendar, label: 'Jadwal' },
    { path: '/admin/assets', icon: Box, label: 'Aset' },
    { path: '/admin/issues', icon: AlertCircle, label: 'Laporan' },
    { path: '/admin/users', icon: Users, label: 'Pengguna' },
];

function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">RF</div>
                    <span className="logo-text">Resource Finder</span>
                    <span className="badge badge-warning text-xs">ADMIN</span>
                </div>

                <nav className="sidebar-nav">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {item.isActive && (
                                    <motion.div
                                        layoutId="activeBar"
                                        className="active-bar"
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-item" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <header className="admin-header">
                    <h2 className="page-title">Dashboard Overview</h2>
                    <div className="header-actions">
                        <button className="btn btn-icon btn-ghost">
                            <Settings size={20} />
                        </button>
                        <div className="admin-profile">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                                alt="Admin"
                            />
                            <span className="admin-name">Lab Admin</span>
                        </div>
                    </div>
                </header>

                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
