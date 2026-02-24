import { SvgProps } from "@/shared/model/svg";

export default function School({ isActive = false }: SvgProps) {
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
          {/* Active */}
          <path
            d="M22 9L12.7428 5.29711C12.266 5.10638 11.734 5.10638 11.2572 5.29711L2.69636 8.72146C2.44491 8.82203 2.44491 9.17797 2.69636 9.27854L11.2572 12.7029C11.734 12.8936 12.266 12.8936 12.7428 12.7029L22 9ZM22 9V15V9Z"
            fill="#6F7AEC"
          />

          <path
            d="M22 9L12.7428 5.29711C12.266 5.10638 11.734 5.10638 11.2572 5.29711L2.69636 8.72146C2.44491 8.82203 2.44491 9.17797 2.69636 9.27854L11.2572 12.7029C11.734 12.8936 12.266 12.8936 12.7428 12.7029L22 9ZM22 9V15"
            stroke="#6F7AEC"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M6 10.6V16C6 16.7956 6.63214 17.5587 7.75736 18.1213C8.88258 18.6839 10.4087 19 12 19C13.5913 19 15.1174 18.6839 16.2426 18.1213C17.3679 17.5587 18 16.7956 18 16V10.6"
            fill="#6F7AEC"
          />

          <path
            d="M6 10.6V16C6 16.7956 6.63214 17.5587 7.75736 18.1213C8.88258 18.6839 10.4087 19 12 19C13.5913 19 15.1174 18.6839 16.2426 18.1213C17.3679 17.5587 18 16.7956 18 16V10.6"
            stroke="#6F7AEC"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M6.78369 10.9135L11.2573 12.7029C11.7342 12.8936 12.2661 12.8936 12.7429 12.7029L17.2165 10.9135"
            stroke="#F7F7F9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          {/* Inactive */}
          <path
            d="M22 9L12.7428 5.29711C12.266 5.10638 11.734 5.10638 11.2572 5.29711L2.69636 8.72146C2.44491 8.82203 2.44491 9.17797 2.69636 9.27854L11.2572 12.7029C11.734 12.8936 12.266 12.8936 12.7428 12.7029L22 9ZM22 9V15"
            stroke="#BBBBCC"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M6 10.6V16C6 16.7956 6.63214 17.5587 7.75736 18.1213C8.88258 18.6839 10.4087 19 12 19C13.5913 19 15.1174 18.6839 16.2426 18.1213C17.3679 17.5587 18 16.7956 18 16V10.6"
            stroke="#BBBBCC"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
