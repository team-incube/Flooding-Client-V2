import { SvgProps } from "@/shared/model/svg";

export default function Delete({ className }: SvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 19.4998V8.49976H18V19.4998C18 20.6043 17.1046 21.4998 16 21.4998H8C6.89543 21.4998 6 20.6043 6 19.4998Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.9998V17.9998"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11.9998V17.9998"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 5.5H10M20 5.5H14M10 5.5V4.5C10 3.39543 10.8954 2.5 12 2.5C13.1046 2.5 14 3.39543 14 4.5V5.5M10 5.5H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
