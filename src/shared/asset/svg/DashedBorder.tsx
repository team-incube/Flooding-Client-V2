export function DashedBorder() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx="6.85"
        ry="6.85"
        fill="none"
        stroke="var(--color-p-1)"
        strokeWidth="1"
        strokeDasharray="8 8"
      />
    </svg>
  );
}
