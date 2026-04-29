import { SvgProps } from "@/shared/model/svg";

export default function HomeBase({ isActive = false }: SvgProps) {
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
            d="M4 19V9.86852C4 9.53416 4.1671 9.22193 4.4453 9.03647L11.4453 4.3698C11.7812 4.14587 12.2188 4.14587 12.5547 4.3698L19.5547 9.03647C19.8329 9.22193 20 9.53416 20 9.86852V19C20 19.5523 19.5523 20 19 20H12H5C4.44772 20 4 19.5523 4 19Z"
            fill="var(--color-p-1)"
          />
          <path
            d="M12 20H5C4.44772 20 4 19.5523 4 19V9.86852C4 9.53416 4.1671 9.22193 4.4453 9.03647L11.4453 4.3698C11.7812 4.14587 12.2188 4.14587 12.5547 4.3698L19.5547 9.03647C19.8329 9.22193 20 9.53416 20 9.86852V19C20 19.5523 19.5523 20 19 20H12ZM12 20V16.1212"
            stroke="var(--color-p-1)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 16V18.5"
            stroke="var(--background)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M12 20H5C4.44772 20 4 19.5523 4 19V9.86852C4 9.53416 4.1671 9.22193 4.4453 9.03647L11.4453 4.3698C11.7812 4.14587 12.2188 4.14587 12.5547 4.3698L19.5547 9.03647C19.8329 9.22193 20 9.53416 20 9.86852V19C20 19.5523 19.5523 20 19 20H12ZM12 20V16.1212"
            stroke="var(--color-sub-2)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
