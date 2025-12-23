import { Outlet } from 'react-router-dom';
import BottomNav from '../organisms/BottomNav';
import Header from '../organisms/Header';
import './MainLayout.css';

function MainLayout() {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}

export default MainLayout;
