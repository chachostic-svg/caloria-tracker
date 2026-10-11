"use client";

import { useTheme } from "./ThemeProvider";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

export default function CaloriePieChart({ data }) {
  const { chartColors } = useTheme();

  if (!data?.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--muted-fg)]">
        Добавьте еду, чтобы увидеть диаграмму
      </div>
    );
  }

  const cx = 120;
  const cy = 120;
  const r = 100;
  let cursor = 0;

  const slices = data.map((item, index) => {
    const sweep = (item.percent / 100) * 360;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    return {
      ...item,
      path: arcPath(cx, cy, r, start, end),
      color: chartColors[index % chartColors.length],
    };
  });

  return (
    <div>
      <div className="mx-auto w-full max-w-[240px]">
        <svg viewBox="0 0 240 240" className="h-auto w-full drop-shadow-sm">
          {slices.map((slice) => (
            <path
              key={slice.id || slice.name}
              d={slice.path}
              fill={slice.color}
              stroke="var(--surface)"
              strokeWidth={2}
            />
          ))}
          <circle cx={cx} cy={cy} r={52} fill="var(--surface)" />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-[var(--foreground)] text-[11px] font-semibold"
          >
            {data.reduce((s, d) => s + d.calories, 0)}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            className="fill-[var(--muted-fg)] text-[9px]"
          >
            ккал
          </text>
        </svg>
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((item, index) => (
          <li
            key={item.id || item.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: chartColors[index % chartColors.length],
                }}
              />
              {item.name}
            </span>
            <span className="text-[var(--muted-fg)]">
              {item.percent}% · {item.calories} ккал
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
