import { SvgProps } from "@/shared/model/svg";

export default function Music({ isActive = false }: SvgProps) {
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
          <rect
            x="3.75"
            y="2.25"
            width="16.5"
            height="19.5"
            rx="4.5"
            fill={isActive ? "var(--color-p-1)" : "var(--color-sub-2)"}
          />
          <path
            d="M12 10.5C13.6569 10.5 15 11.8431 15 13.5C15 15.1569 13.6569 16.5 12 16.5C10.3431 16.5 9 15.1569 9 13.5C9 11.8431 10.3431 10.5 12 10.5Z"
            stroke={isActive ? "var(--background)" : "var(--color-sub-2)"}
            strokeWidth="1.5"
          />
          <path
            d="M13.125 7.125C13.125 8.002 12.8713 8.25 12 8.25C11.1287 8.25 10.875 8.002 10.875 7.125C10.875 6.248 11.1287 6 12 6C12.8713 6 13.125 6.248 13.125 7.125Z"
            fill={isActive ? "var(--background)" : "var(--color-sub-2)"}
          />
        </>
      ) : (
        <>
          <path
            d="M12 6.85742C12.1143 6.85742 12.1958 6.86412 12.2529 6.87109C12.26 6.92825 12.2676 7.00994 12.2676 7.125C12.2676 7.23942 12.26 7.32081 12.2529 7.37793C12.1958 7.38491 12.1144 7.39258 12 7.39258C11.885 7.39258 11.8033 7.38497 11.7461 7.37793C11.7391 7.32082 11.7324 7.23934 11.7324 7.125C11.7324 7.01002 11.739 6.92825 11.7461 6.87109C11.8033 6.86406 11.885 6.85742 12 6.85742Z"
            fill={isActive ? "var(--color-p-1)" : "var(--color-sub-2)"}
            stroke={isActive ? "var(--color-p-1)" : "var(--color-sub-2)"}
            strokeWidth="1.71429"
          />
          <path
            d="M12 10.5C13.6569 10.5 15 11.8431 15 13.5C15 15.1569 13.6569 16.5 12 16.5C10.3431 16.5 9 15.1569 9 13.5C9 11.8431 10.3431 10.5 12 10.5Z"
            stroke={isActive ? "var(--color-p-1)" : "var(--color-sub-2)"}
            strokeWidth="1.5"
          />
          <rect
            x="4.5"
            y="3"
            width="15"
            height="18"
            rx="3.75"
            stroke={isActive ? "var(--color-p-1)" : "var(--color-sub-2)"}
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}
