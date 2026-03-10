import type { SvgProps } from "@/shared/model/svg";

export default function Logout({ size = 24 }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.55347 16H27.5535M27.5535 16L23.9535 13M27.5535 16L23.9535 19"
        stroke="var(--color-sub-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4465 11.3684V7.28571C19.4465 6.02335 18.4232 5 17.1608 5H6.73225C5.46988 5 4.44653 6.02335 4.44653 7.28571V24.7143C4.44653 25.9767 5.46988 27 6.73225 27H17.1608C18.4232 27 19.4465 25.9767 19.4465 24.7143V21.2105"
        stroke="var(--color-sub-2)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
