import type { SvgProps } from "@/shared/model/svg";

export default function Sidebar({
  isActive = false,
  size = 24,
  className,
}: SvgProps) {
  const color = isActive ? "var(--color-p-1)" : "var(--color-sub-2)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M11 3.5V20.5" stroke={color} strokeWidth="1.6" />
      <path d="M6 8H9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M6 10.6H9"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 13.2H9"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 15.8H7.8"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
