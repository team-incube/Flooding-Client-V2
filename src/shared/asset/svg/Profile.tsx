import { SvgProps } from "@/shared/model/svg";

export default function Profile({ isActive = false }: SvgProps) {
  const pathProps = isActive
    ? { fill: "var(--color-p-1)" }
    : { stroke: "var(--color-sub-2)", strokeWidth: "1.5" };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.125 7.125C16.125 9.40317 14.2782 11.25 12 11.25C9.72183 11.25 7.875 9.40317 7.875 7.125C7.875 4.84683 9.72183 3 12 3C14.2782 3 16.125 4.84683 16.125 7.125Z"
        {...pathProps}
      />
      <path
        d="M19.125 18C19.125 20.0711 15.935 21 12 21C8.06497 21 4.875 20.0711 4.875 18C4.875 15.9289 8.06497 14.25 12 14.25C15.935 14.25 19.125 15.9289 19.125 18Z"
        {...pathProps}
      />
    </svg>
  );
}
