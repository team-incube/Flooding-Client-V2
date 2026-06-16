interface VinylRecordProps {
  size?: number;
  className?: string;
}

export default function VinylRecord({
  size = 80,
  className,
}: VinylRecordProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="vinyl-sheen" cx="32%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="40" cy="40" r="38" fill="var(--color-sub-1)" />

      <circle
        cx="40"
        cy="40"
        r="31"
        stroke="var(--color-sub-2)"
        strokeWidth="0.75"
        opacity="0.45"
      />
      <circle
        cx="40"
        cy="40"
        r="25"
        stroke="var(--color-sub-2)"
        strokeWidth="0.75"
        opacity="0.45"
      />
      <circle
        cx="40"
        cy="40"
        r="19"
        stroke="var(--color-sub-2)"
        strokeWidth="0.75"
        opacity="0.45"
      />

      {/* 함께 회전하는 광택(스페큘러) — 광원 + 회전감 */}
      <circle cx="40" cy="40" r="38" fill="url(#vinyl-sheen)" />
      <path
        d="M40 6 A34 34 0 0 1 74 40"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* 중앙 라벨 (챗봇이 위에 겹쳐짐) */}
      <circle cx="40" cy="40" r="14" fill="var(--color-p-1)" />
    </svg>
  );
}
