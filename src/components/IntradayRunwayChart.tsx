import React, { useState } from 'react';
import { TimelinePoint } from '../types/liquidity';

interface IntradayRunwayChartProps {
  timeline: TimelinePoint[];
  timeToBreach: string | null;
}

function formatUSDMillions(val: number): string {
  const m = val / 1_000_000;
  return `${m >= 0 ? '+' : ''}$${m.toFixed(0)}M`;
}

export const IntradayRunwayChart: React.FC<IntradayRunwayChartProps> = ({
  timeline,
  timeToBreach,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) return null;

  // Calculate min and max bounds for Y axis
  const allBalances = timeline.flatMap((p) => [
    p.baselineBalance,
    p.stressedBalance,
    p.overdraftThreshold,
  ]);
  const minVal = Math.min(...allBalances, -300_000_000);
  const maxVal = Math.max(...allBalances, 800_000_000);

  // Pad margins
  const yMin = Math.floor(minVal / 100_000_000) * 100_000_000 - 50_000_000;
  const yMax = Math.ceil(maxVal / 100_000_000) * 100_000_000 + 50_000_000;
  const yRange = yMax - yMin;

  // Chart coordinate mapping
  const width = 800;
  const height = 360;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const getX = (index: number) => padLeft + (index / (timeline.length - 1)) * chartWidth;
  const getY = (val: number) => padTop + chartHeight - ((val - yMin) / yRange) * chartHeight;

  // Build SVG path strings
  const baselinePoints = timeline.map((p, i) => `${getX(i)},${getY(p.baselineBalance)}`);
  const baselinePath = `M ${baselinePoints.join(' L ')}`;

  const stressedPoints = timeline.map((p, i) => `${getX(i)},${getY(p.stressedBalance)}`);
  const stressedPath = `M ${stressedPoints.join(' L ')}`;

  // Area under stressed curve to zero/threshold
  const zeroY = getY(0);
  const stressedAreaPath = `M ${getX(0)},${getY(timeline[0].stressedBalance)} L ${stressedPoints.join(' L ')} L ${getX(timeline.length - 1)},${zeroY} L ${getX(0)},${zeroY} Z`;

  const overdraftY = getY(-250_000_000);

  // Y-axis grid ticks (e.g., +$800M, +$400M, $0, -$250M)
  const yTicks = [
    800_000_000,
    600_000_000,
    400_000_000,
    200_000_000,
    0,
    -250_000_000,
  ].filter((v) => v >= yMin && v <= yMax);

  // X-axis ticks (hourly: 08:00, 09:00, ..., 17:00)
  const hourlyIndices = timeline
    .map((p, i) => ({ point: p, index: i }))
    .filter(({ point }) => point.time.endsWith(':00'));

  const activePoint = hoverIndex !== null ? timeline[hoverIndex] : timeline[timeline.length - 1];

  return (
    <div className="editorial-card p-5 md:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-serif font-semibold text-charcoal-900">
            Intraday Liquidity Trajectory Curve
          </h3>
          <p className="text-xs text-charcoal-500">
            Simulated 15-minute net cumulative settlement positions vs. Fedwire Daylight Overdraft cap
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-charcoal-400 inline-block border-t border-dashed border-charcoal-400"></span>
            <span className="text-charcoal-600 font-medium">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sage-600 inline-block"></span>
            <span className="text-charcoal-800 font-medium">Stressed Position</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-terracotta-500 inline-block border-t-2 border-dashed border-terracotta-500"></span>
            <span className="text-terracotta-700 font-medium">Daylight Cap (-$250M)</span>
          </div>
        </div>
      </div>

      {/* SVG Trajectory Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Soft organic area gradient */}
            <linearGradient id="stressedAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5F7A61" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#C86D51" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#C86D51" stopOpacity="0.25" />
            </linearGradient>

            {/* Stressed line stroke gradient */}
            <linearGradient id="stressedLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5F7A61" />
              <stop offset="40%" stopColor="#5F7A61" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor={timeToBreach ? '#C86D51' : '#5F7A61'} />
            </linearGradient>
          </defs>

          {/* Grid lines and Y ticks */}
          {yTicks.map((tickVal) => {
            const y = getY(tickVal);
            const isZero = tickVal === 0;
            const isOverdraft = tickVal === -250_000_000;

            return (
              <g key={tickVal}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={isZero ? '#A8A29E' : isOverdraft ? '#C86D51' : '#E7E5E4'}
                  strokeWidth={isZero ? 1.5 : isOverdraft ? 1.5 : 1}
                  strokeDasharray={isOverdraft ? '5,4' : isZero ? 'none' : '3,3'}
                  opacity={isOverdraft ? 0.9 : 0.7}
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="'Plus Jakarta Sans', monospace"
                  fontWeight={isZero || isOverdraft ? '600' : '400'}
                  fill={isOverdraft ? '#B25439' : isZero ? '#44403C' : '#78716C'}
                >
                  {formatUSDMillions(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Daylight Cap Label */}
          <text
            x={width - padRight - 5}
            y={overdraftY - 6}
            textAnchor="end"
            fontSize="9.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="600"
            fill="#B25439"
          >
            Fedwire Daylight Overdraft Cap (-$250M)
          </text>

          {/* X Axis ticks (Hourly) */}
          {hourlyIndices.map(({ point, index }) => {
            const x = getX(index);
            return (
              <g key={point.time}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={height - padBottom}
                  stroke="#E7E5E4"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.6"
                />
                <text
                  x={x}
                  y={height - padBottom + 18}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontFamily="'Plus Jakarta Sans', monospace"
                  fontWeight="500"
                  fill="#57534E"
                >
                  {point.time}
                </text>
              </g>
            );
          })}

          {/* Area fill for stressed trajectory */}
          <path d={stressedAreaPath} fill="url(#stressedAreaGrad)" />

          {/* Baseline Curve */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#78716C"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.65"
          />

          {/* Stressed Curve */}
          <path
            d={stressedPath}
            fill="none"
            stroke="url(#stressedLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Columns & Cursor */}
          {timeline.map((point, index) => {
            const x = getX(index);
            const y = getY(point.stressedBalance);
            const isHovered = hoverIndex === index;

            return (
              <g key={point.time}>
                {/* Transparent hover capture rect */}
                <rect
                  x={x - chartWidth / (timeline.length * 2)}
                  y={padTop}
                  width={chartWidth / timeline.length}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(index)}
                />

                {/* Point dot on active */}
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={height - padBottom}
                      stroke="#44403C"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={point.isBreached ? '#C86D51' : '#5F7A61'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="shadow-md"
                    />
                    <circle
                      cx={x}
                      cy={getY(point.baselineBalance)}
                      r="3.5"
                      fill="#78716C"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Float Card */}
        {activePoint && (
          <div className="mt-3 p-3.5 rounded-2xl bg-surface border border-charcoal-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-soft-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-charcoal-900 px-2 py-0.5 rounded-md bg-canvas border border-charcoal-200">
                {activePoint.time} EST
              </span>
              <span className={`font-semibold ${activePoint.isBreached ? 'text-terracotta-700' : 'text-sage-800'}`}>
                {activePoint.isBreached ? 'OVERDRAFT BREACH' : 'Posture Secure'}
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs">
              <div>
                <span className="text-charcoal-500 font-sans">Stressed Position: </span>
                <strong className={`font-semibold ${activePoint.stressedBalance >= 0 ? 'text-charcoal-900' : 'text-terracotta-700'}`}>
                  {formatUSDMillions(activePoint.stressedBalance)}
                </strong>
              </div>

              <div>
                <span className="text-charcoal-500 font-sans">Baseline: </span>
                <span className="text-charcoal-700">{formatUSDMillions(activePoint.baselineBalance)}</span>
              </div>

              <div>
                <span className="text-charcoal-500 font-sans">Variance: </span>
                <span className={activePoint.stressedBalance - activePoint.baselineBalance < 0 ? 'text-terracotta-600' : 'text-sage-700'}>
                  {formatUSDMillions(activePoint.stressedBalance - activePoint.baselineBalance)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
