import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '../organisms/BottomNav';
import Header from '../organisms/Header';
import './MainLayout.css';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.2
};

function MainLayout() {
    const location = useLocation();

    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="page-wrapper"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <BottomNav />
        </div>
    );
}

export default MainLayout;
