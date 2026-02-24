import { SvgProps } from "@/shared/model/svg";

export default function Gender({ isActive = false }: SvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isActive ? (
        <>
          <path
            d="M12 4.48108C15.0376 4.48108 17.5 6.94352 17.5 9.98108C17.5 13.0186 15.0376 15.4811 12 15.4811C8.96243 15.4811 6.5 13.0186 6.5 9.98108C6.5 6.94352 8.96244 4.48108 12 4.48108Z"
            stroke="#BBBBCC"
            strokeWidth="2"
          />
          <path
            d="M12 19.75V16M10.5 18.25H13.5"
            stroke="#BBBBCC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle
            cx="11.5"
            cy="12.5"
            r="5.5"
            stroke="#BBBBCC"
            strokeWidth="2"
          />
          <path
            d="M15.7058 8.29412L18.9999 5M18.9999 5V7.47059M18.9999 5H16.5293"
            stroke="#BBBBCC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
