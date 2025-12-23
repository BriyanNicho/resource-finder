import { motion } from 'framer-motion';
import './ScheduleTimeline.css';

function ScheduleTimeline({ schedule }) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    const isCurrentClass = (startTime, endTime) => {
        return currentTime >= startTime && currentTime <= endTime;
    };

    const isPastClass = (endTime) => {
        return currentTime > endTime;
    };

    // Calculate free time gaps
    const getTimelineItems = () => {
        const items = [];

        for (let i = 0; i < schedule.length; i++) {
            const current = schedule[i];
            items.push({ ...current, type: 'class' });

            if (i < schedule.length - 1) {
                const next = schedule[i + 1];
                const gapStart = current.endTime;
                const gapEnd = next.startTime;

                // Calculate duration
                const [startH, startM] = gapStart.split(':').map(Number);
                const [endH, endM] = gapEnd.split(':').map(Number);
                const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

                if (durationMinutes >= 30) {
                    items.push({
                        type: 'gap',
                        startTime: gapStart,
                        endTime: gapEnd,
                        duration: durationMinutes >= 60
                            ? `${Math.floor(durationMinutes / 60)} Jam ${durationMinutes % 60 > 0 ? `${durationMinutes % 60} Menit` : ''}`
                            : `${durationMinutes} Menit`
                    });
                }
            }
        }

        return items;
    };

    const timelineItems = getTimelineItems();

    return (
        <div className="schedule-timeline">
            <h3 className="section-title">📅 Jadwal Hari Ini</h3>

            <div className="timeline">
                {timelineItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`timeline-item ${item.type}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {item.type === 'class' ? (
                            <>
                                <div className={`timeline-marker ${isCurrentClass(item.startTime, item.endTime) ? 'current' :
                                        isPastClass(item.endTime) ? 'past' : 'upcoming'
                                    }`}>
                                    <span className="time">{item.startTime}</span>
                                    <div className="dot" />
                                    <div className="line" />
                                </div>

                                <div className={`timeline-content ${isCurrentClass(item.startTime, item.endTime) ? 'current' : ''
                                    }`}>
                                    <h4 className="class-name">{item.subject}</h4>
                                    <p className="class-info">{item.room} • {item.building}</p>
                                    <p className="class-time">{item.startTime} - {item.endTime}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="timeline-marker gap">
                                    <span className="time">{item.startTime}</span>
                                    <div className="dot gap-dot" />
                                    <div className="line dashed" />
                                </div>

                                <div className="timeline-content gap-content">
                                    <span className="gap-badge">⚡ Waktu Kosong</span>
                                    <p className="gap-duration">{item.duration}</p>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default ScheduleTimeline;
