import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import './Header.css';

function Header() {
    const currentHour = new Date().getHours();
    let greeting = 'Selamat Pagi';
    if (currentHour >= 12 && currentHour < 15) greeting = 'Selamat Siang';
    else if (currentHour >= 15 && currentHour < 18) greeting = 'Selamat Sore';
    else if (currentHour >= 18) greeting = 'Selamat Malam';

    return (
        <header className="header">
            <div className="header-container">
                <motion.div
                    className="header-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="avatar">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
                            alt="Avatar"
                        />
                    </div>
                    <div className="greeting">
                        <span className="greeting-text">{greeting} 👋</span>
                        <h2 className="user-name">Mahasiswa</h2>
                    </div>
                </motion.div>

                <div className="header-actions">
                    <button className="btn btn-icon btn-ghost notification-btn">
                        <Bell size={22} />
                        <span className="notification-badge">3</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
