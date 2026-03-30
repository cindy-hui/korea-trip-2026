import React from 'react';

function PieChart({ data }) {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1]); // Sort by value descending
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-slate-400 text-center">
          No expenses to display yet.
        </p>
      </div>
    );
  }

  // Category color mapping - fill uses -200, stroke uses -400, text uses darker -600
  const categoryColorMap = {
    'Food': { stroke: '#FACC15', fill: '#FEF9C3', text: '#CA8A04' },       // yellow-400/200, text: yellow-600
    'Transport': { stroke: '#F87171', fill: '#FEE2E2', text: '#DC2626' }, // red-400/200, text: red-600
    'Shopping': { stroke: '#F472B6', fill: '#FBCFE8', text: '#DB2777' },  // pink-400/200, text: pink-600
    'Activities': { stroke: '#FB923C', fill: '#FFDAB8', text: '#C2410c' }, // orange-400/200, text: orange-600
    'Accommodation': { stroke: '#60A5FA', fill: '#BFDBFE', text: '#2563EB' }, // blue-400/200, text: blue-600
    'Misc': { stroke: '#A8A29E', fill: '#E7E5E4', text: '#57534E' },       // stone-400/200, text: stone-600
  };

  // Calculate donut segments
  let cumulative = 0;
  const radius = 40;
  const innerRadius = 25;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 h-full">
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-52 h-52 transform -rotate-90">
          {entries.map(([key, value], idx) => {
            const percentage = (value / total) * 100;
            const startAngle = (cumulative / total) * 2 * Math.PI;
            const slice = (value / total) * 2 * Math.PI;
            const endAngle = startAngle + slice;
            cumulative += value;

            // Handle single slice (100%) by rendering it as nearly a full circle
            // to avoid SVG arc rendering issues with full circles
            const effectiveSlice = entries.length === 1 ? slice - 0.001 : slice;
            const effectiveEndAngle = startAngle + effectiveSlice;

            const x1 = 50 + radius * Math.cos(startAngle);
            const y1 = 50 + radius * Math.sin(startAngle);
            const x2 = 50 + radius * Math.cos(effectiveEndAngle);
            const y2 = 50 + radius * Math.sin(effectiveEndAngle);
            const x3 = 50 + innerRadius * Math.cos(startAngle);
            const y3 = 50 + innerRadius * Math.sin(startAngle);
            const x4 = 50 + innerRadius * Math.cos(effectiveEndAngle);
            const y4 = 50 + innerRadius * Math.sin(effectiveEndAngle);

            const largeArc = effectiveSlice > Math.PI ? 1 : 0;

            // Donut segment path
            const d = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              L ${x4} ${y4}
              A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3}
              Z
            `;

            const colors = categoryColorMap[key] || categoryColorMap['Misc'];
            return (
              <path
                key={key}
                d={d}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="0.5"
                className="transition-all hover:opacity-80"
              />
            );
          })}
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-slate-600 font-bold transform rotate-90 origin-center"
          >
            {Math.round(total).toLocaleString()}
            <tspan x="50" dy="12" className="text-[7px] fill-slate-400 font-normal">
              HKD
            </tspan>
          </text>
        </svg>
      </div>

      <div className="flex-1 space-y-2.5 min-w-0 pr-6">
        {entries.map(([key, value]) => {
          const percentage = (value / total) * 100;
          const colors = categoryColorMap[key] || categoryColorMap['Misc'];
          return (
            <div key={key} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0 border"
                style={{ backgroundColor: colors.fill, borderColor: colors.stroke }}
              />
              <span className="text-xs font-medium text-slate-700 truncate min-w-[100px]">
                {key}
              </span>
              <div className="flex items-center gap-2 text-xs tabular-nums">
                <span className="text-slate-500 font-mono">
                  ${Math.round(value).toLocaleString()}
                </span>
                <span
                  className="font-bold"
                  style={{ color: colors.text }}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PieChart;
