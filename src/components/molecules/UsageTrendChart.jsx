import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

function UsageTrendChart({ data, width = 600, height = 200 }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate chart metrics
    const { points, pathD, areaD, minCount, maxCount, isPositiveTrend } = useMemo(() => {
        if (!data || data.length === 0) return { points: [], pathD: '', areaD: '' };

        const counts = data.map(d => d.count);
        const min = Math.min(...counts);
        const max = Math.max(...counts);
        const range = max - min || 1;

        // Check if trend is positive (last week avg > first week avg)
        const firstWeek = counts.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
        const lastWeek = counts.slice(-7).reduce((a, b) => a + b, 0) / 7;
        const positive = lastWeek >= firstWeek;

        const pts = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * chartWidth,
            y: padding.top + chartHeight - ((d.count - min) / range) * chartHeight,
            data: d
        }));

        // Create smooth curve path
        const path = pts.reduce((acc, pt, i) => {
            if (i === 0) return `M ${pt.x} ${pt.y}`;
            const prev = pts[i - 1];
            const cpX = (prev.x + pt.x) / 2;
            return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
        }, '');

        // Create area path (filled below line)
        const area = `${path} L ${pts[pts.length - 1].x} ${padding.top + chartHeight} L ${pts[0].x} ${padding.top + chartHeight} Z`;

        return {
            points: pts,
            pathD: path,
            areaD: area,
            minCount: min,
            maxCount: max,
            isPositiveTrend: positive
        };
    }, [data, chartWidth, chartHeight]);

    const trendColor = isPositiveTrend ? '#10b981' : '#ef4444';
    const gradientId = isPositiveTrend ? 'greenGradient' : 'redGradient';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="usage-trend-chart">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Gradients */}
                <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                <g className="grid-lines">
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={padding.top + chartHeight * ratio}
                            x2={padding.left + chartWidth}
                            y2={padding.top + chartHeight * ratio}
                            stroke="rgba(255,255,255,0.05)"
                            strokeDasharray="4 4"
                        />
                    ))}
                </g>

                {/* Y-axis labels */}
                <g className="y-axis">
                    <text x={padding.left - 8} y={padding.top + 4} fill="var(--text-tertiary)" fontSize="10" textAnchor="end">
                        {maxCount}
                    </text>
                    <text x={padding.left - 8} y={padding.top + chartHeight} fill="var(--text-tertiary)" fontSize="10" textAnchor="end">
                        {minCount}
                    </text>
                </g>

                {/* Area fill */}
                <motion.path
                    d={areaD}
                    fill={`url(#${gradientId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                />

                {/* Line path */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={trendColor}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Hover points */}
                {points.map((pt, i) => (
                    <g key={i}>
                        <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === i ? 6 : 4}
                            fill={trendColor}
                            stroke="var(--bg-card)"
                            strokeWidth={2}
                            opacity={hoveredPoint === i ? 1 : 0}
                            style={{ transition: 'all 0.15s ease' }}
                        />
                        <rect
                            x={pt.x - 15}
                            y={padding.top}
                            width={30}
                            height={chartHeight}
                            fill="transparent"
                            onMouseEnter={(e) => {
                                setHoveredPoint(i);
                                setTooltipPos({ x: pt.x, y: pt.y });
                            }}
                            onMouseLeave={() => setHoveredPoint(null)}
                            style={{ cursor: 'crosshair' }}
                        />
                    </g>
                ))}

                {/* X-axis date labels */}
                <g className="x-axis">
                    {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
                        <text
                            key={i}
                            x={points[i]?.x || 0}
                            y={height - 8}
                            fill="var(--text-tertiary)"
                            fontSize="10"
                            textAnchor="middle"
                        >
                            {data[i] ? formatDate(data[i].date) : ''}
                        </text>
                    ))}
                </g>
            </svg>

            {/* Tooltip */}
            {hoveredPoint !== null && data[hoveredPoint] && (
                <motion.div
                    className="chart-tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y - 50,
                    }}
                >
                    <span className="tooltip-date">{formatDate(data[hoveredPoint].date)}</span>
                    <span className="tooltip-value" style={{ color: trendColor }}>
                        {data[hoveredPoint].count} bookings
                    </span>
                </motion.div>
            )}
        </div>
    );
}

export default UsageTrendChart;
