import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MiniSparkline.css';

function MiniSparkline({
    data,
    color = '#10b981',
    title = 'Metric',
    valueKey = 'count',
    labelKey = 'date',
    unit = '',
    height = 80
}) {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const width = 200;
    const padding = { top: 8, right: 8, bottom: 8, left: 8 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate chart metrics
    const { points, pathD, areaD, minCount, maxCount, isBullish, changePercent, lastValue } = useMemo(() => {
        if (!data || data.length === 0) return { points: [], pathD: '', areaD: '' };

        const counts = data.map(d => d[valueKey]);
        const min = Math.min(...counts);
        const max = Math.max(...counts);
        const range = max - min || 1;

        // Check if bullish (last value > previous value)
        const last = counts[counts.length - 1];
        const prev = counts[counts.length - 2] || last;
        const bullish = last >= prev;
        const change = prev !== 0 ? ((last - prev) / prev * 100).toFixed(1) : 0;

        const pts = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * chartWidth,
            y: padding.top + chartHeight - ((d[valueKey] - min) / range) * chartHeight,
            data: d
        }));

        // Create smooth curve path
        const path = pts.reduce((acc, pt, i) => {
            if (i === 0) return `M ${pt.x} ${pt.y}`;
            const prev = pts[i - 1];
            const cpX = (prev.x + pt.x) / 2;
            return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
        }, '');

        // Create area path
        const area = `${path} L ${pts[pts.length - 1].x} ${padding.top + chartHeight} L ${pts[0].x} ${padding.top + chartHeight} Z`;

        return {
            points: pts,
            pathD: path,
            areaD: area,
            minCount: min,
            maxCount: max,
            isBullish: bullish,
            changePercent: change,
            lastValue: last
        };
    }, [data, chartWidth, chartHeight, valueKey]);

    const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

    return (
        <div className="mini-sparkline">
            <div className="sparkline-header">
                <span className="sparkline-title">{title}</span>
                <div className={`sparkline-indicator ${isBullish ? 'bullish' : 'bearish'}`}>
                    {isBullish ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{isBullish ? '+' : ''}{changePercent}%</span>
                </div>
            </div>

            <div className="sparkline-value">
                <span style={{ color }}>{lastValue}{unit}</span>
            </div>

            <div className="sparkline-chart">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <motion.path
                        d={areaD}
                        fill={`url(#${gradientId})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Line path */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* Hover areas */}
                    {points.map((pt, i) => (
                        <g key={i}>
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredPoint === i ? 4 : 2}
                                fill={color}
                                opacity={hoveredPoint === i ? 1 : 0}
                                style={{ transition: 'all 0.15s ease' }}
                            />
                            <rect
                                x={pt.x - 10}
                                y={padding.top}
                                width={20}
                                height={chartHeight}
                                fill="transparent"
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                style={{ cursor: 'crosshair' }}
                            />
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                {hoveredPoint !== null && data[hoveredPoint] && (
                    <motion.div
                        className="sparkline-tooltip"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            left: points[hoveredPoint].x,
                            top: points[hoveredPoint].y - 30,
                        }}
                    >
                        <span className="tooltip-label">{data[hoveredPoint][labelKey]}</span>
                        <span className="tooltip-value" style={{ color }}>
                            {data[hoveredPoint][valueKey]}{unit}
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default MiniSparkline;
