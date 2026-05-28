interface MenuProps {
  size?: number;
}

export default function Menu({ size = 24 }: MenuProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6.5h18M3 12h18M3 17.5h18"
        stroke="var(--color-sub-2)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
