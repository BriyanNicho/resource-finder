import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Ticket, User } from 'lucide-react';
import { motion } from 'framer-motion';
import './BottomNav.css';

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Map, label: 'Explore' },
    { path: '/my-booking', icon: Ticket, label: 'Booking' },
    { path: '/profile', icon: User, label: 'Profile' },
];

function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <motion.div
                                className="nav-icon-wrapper"
                                whileTap={{ scale: 0.9 }}
                            >
                                {isActive && (
                                    <motion.div
                                        className="nav-indicator"
                                        layoutId="navIndicator"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 35
                                        }}
                                    />
                                )}
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className="nav-icon"
                                />
                            </motion.div>
                            <span className="nav-label">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    className="nav-active-dot"
                                    layoutId="navDot"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomNav;
