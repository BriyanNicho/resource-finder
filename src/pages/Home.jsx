import { motion } from 'framer-motion';
import FreeTimeCard from '../components/molecules/FreeTimeCard';
import FacilityCard from '../components/molecules/FacilityCard';
import ScheduleTimeline from '../components/molecules/ScheduleTimeline';
import { facilities, freeTimeSlots, todaySchedule } from '../utils/mockData';
import './Home.css';

function Home() {
    const nearbyFacilities = facilities
        .filter(f => f.status !== 'maintenance' && f.status !== 'full')
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    return (
        <div className="home-page">
            <div className="container">
                {/* Free Time Card */}
                <motion.section
                    className="section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <FreeTimeCard freeTime={freeTimeSlots[0]} />
                </motion.section>

                {/* Quick Recommendations */}
                <motion.section
                    className="section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="section-header">
                        <h3 className="section-title">📍 Rekomendasi Terdekat</h3>
                        <a href="/explore" className="see-all">Lihat Semua</a>
                    </div>

                    <div className="facilities-scroll">
                        {nearbyFacilities.map((facility, index) => (
                            <div key={facility.id} className="facility-scroll-item">
                                <FacilityCard facility={facility} index={index} />
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Today's Schedule */}
                <motion.section
                    className="section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <ScheduleTimeline schedule={todaySchedule} />
                </motion.section>
            </div>
        </div>
    );
}

export default Home;
