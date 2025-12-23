import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Clock, AlertTriangle, MoreHorizontal, User
} from 'lucide-react';
import './Issues.css';

const mockIssues = [
    { id: 1, title: 'Mouse Rusak PC-05', location: 'Lab Komputer A', status: 'new', reporter: 'Ahmad Rizky', date: '10 min ago' },
    { id: 2, title: 'AC D-301 Panas', location: 'D-301', status: 'in_progress', reporter: 'Siti Aminah', date: '2h ago' },
    { id: 3, title: 'Kabel HDMI Putus', location: 'Meeting Room 1', status: 'resolved', reporter: 'Budi Santoso', date: '1d ago' },
];

function Issues() {
    const [issues, setIssues] = useState(mockIssues);

    const updateStatus = (id, newStatus) => {
        setIssues(prev => prev.map(issue =>
            issue.id === id ? { ...issue, status: newStatus } : issue
        ));
    };

    const columns = [
        { id: 'new', title: 'Baru Masuk', icon: AlertTriangle, color: 'text-danger' },
        { id: 'in_progress', title: 'Sedang Dicek', icon: Clock, color: 'text-warning' },
        { id: 'resolved', title: 'Selesai', icon: CheckCircle, color: 'text-success' },
    ];

    return (
        <div className="issues-page">
            <div className="kanban-board">
                {columns.map(col => (
                    <div key={col.id} className="kanban-column">
                        <div className="column-header">
                            <div className={`column-icon ${col.color}`}>
                                <col.icon size={18} />
                            </div>
                            <h3>{col.title}</h3>
                            <span className="column-count">
                                {issues.filter(i => i.status === col.id).length}
                            </span>
                        </div>

                        <div className="column-content">
                            <AnimatePresence>
                                {issues
                                    .filter(issue => issue.status === col.id)
                                    .map(issue => (
                                        <motion.div
                                            key={issue.id}
                                            layoutId={`issue-${issue.id}`}
                                            className="issue-card"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <div className="issue-header">
                                                <span className="issue-location">{issue.location}</span>
                                                <button className="icon-btn">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>

                                            <h4 className="issue-title">{issue.title}</h4>

                                            <div className="issue-footer">
                                                <div className="reporter-info">
                                                    <User size={14} />
                                                    <span>{issue.reporter}</span>
                                                </div>
                                                <span className="issue-date">{issue.date}</span>
                                            </div>

                                            <div className="issue-actions">
                                                {col.id === 'new' && (
                                                    <button
                                                        className="status-btn btn-process"
                                                        onClick={() => updateStatus(issue.id, 'in_progress')}
                                                    >
                                                        Proses
                                                    </button>
                                                )}
                                                {col.id === 'in_progress' && (
                                                    <button
                                                        className="status-btn btn-resolve"
                                                        onClick={() => updateStatus(issue.id, 'resolved')}
                                                    >
                                                        Selesai
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Issues;
