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
                            <div className="nav-icon-wrapper">
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
                            </div>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomNav;
