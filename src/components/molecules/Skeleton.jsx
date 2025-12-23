import { motion } from 'framer-motion';
import './Skeleton.css';

// Shimmer animation variant
const shimmer = {
    initial: { opacity: 0.5 },
    animate: {
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Individual skeleton shapes
export function SkeletonBox({ width, height, radius = 'md', className = '' }) {
    return (
        <motion.div
            className={`skeleton-box radius-${radius} ${className}`}
            style={{ width, height }}
            variants={shimmer}
            initial="initial"
            animate="animate"
        />
    );
}

export function SkeletonText({ lines = 1, width = '100%' }) {
    return (
        <div className="skeleton-text-group">
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    className="skeleton-text"
                    style={{
                        width: i === lines - 1 && lines > 1 ? '60%' : width
                    }}
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                />
            ))}
        </div>
    );
}

// FacilityCard Skeleton
export function SkeletonFacilityCard({ index = 0 }) {
    return (
        <motion.div
            className="skeleton-facility-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <motion.div
                className="skeleton-image"
                variants={shimmer}
                initial="initial"
                animate="animate"
            />
            <div className="skeleton-content">
                <SkeletonBox width="60%" height="20px" radius="sm" />
                <div className="skeleton-meta">
                    <SkeletonBox width="80px" height="14px" radius="sm" />
                    <SkeletonBox width="50px" height="14px" radius="sm" />
                </div>
                <div className="skeleton-specs">
                    <SkeletonBox width="60px" height="22px" radius="sm" />
                    <SkeletonBox width="45px" height="22px" radius="sm" />
                </div>
                <div className="skeleton-footer">
                    <SkeletonBox width="70px" height="14px" radius="sm" />
                    <SkeletonBox width="18px" height="18px" radius="sm" />
                </div>
            </div>
        </motion.div>
    );
}

// FacilityDetail Header Skeleton
export function SkeletonFacilityHeader() {
    return (
        <div className="skeleton-detail-header">
            <motion.div
                className="skeleton-header-image"
                variants={shimmer}
                initial="initial"
                animate="animate"
            />
            <div className="skeleton-header-content">
                <SkeletonBox width="80px" height="24px" radius="full" />
                <SkeletonBox width="200px" height="28px" radius="sm" />
                <SkeletonBox width="150px" height="16px" radius="sm" />
            </div>
        </div>
    );
}

// Stats Row Skeleton
export function SkeletonStats() {
    return (
        <div className="skeleton-stats-row">
            {[1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="skeleton-stat-item"
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                >
                    <SkeletonBox width="36px" height="36px" radius="md" />
                    <div className="skeleton-stat-info">
                        <SkeletonBox width="40px" height="20px" radius="sm" />
                        <SkeletonBox width="60px" height="12px" radius="sm" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// Section Skeleton
export function SkeletonSection({ title = true, tags = 4 }) {
    return (
        <div className="skeleton-section">
            {title && <SkeletonBox width="120px" height="18px" radius="sm" className="skeleton-section-title" />}
            <div className="skeleton-tags">
                {Array.from({ length: tags }).map((_, i) => (
                    <SkeletonBox key={i} width={`${60 + Math.random() * 40}px`} height="28px" radius="sm" />
                ))}
            </div>
        </div>
    );
}

// Complete FacilityDetail Page Skeleton
export function SkeletonFacilityDetail() {
    return (
        <div className="skeleton-facility-detail">
            <SkeletonFacilityHeader />
            <div className="skeleton-detail-content">
                <SkeletonStats />
                <SkeletonSection title tags={5} />
                <SkeletonSection title tags={3} />
                <div className="skeleton-time-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="skeleton-time-slot"
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Booking Ticket Skeleton
export function SkeletonBookingTicket() {
    return (
        <motion.div
            className="skeleton-booking-ticket"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <SkeletonBox width="100%" height="200px" radius="lg" />
        </motion.div>
    );
}

export default {
    SkeletonFacilityCard,
    SkeletonFacilityDetail,
    SkeletonFacilityHeader,
    SkeletonStats,
    SkeletonSection,
    SkeletonBookingTicket,
    SkeletonBox,
    SkeletonText
};
