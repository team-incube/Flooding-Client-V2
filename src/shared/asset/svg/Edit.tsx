interface EditProps {
  color?: string;
}

export default function Edit({ color = "var(--color-sub-2)" }: EditProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.17647 7.23541H5.11764C4.55601 7.23541 4.01738 7.45852 3.62024 7.85565C3.22311 8.25278 3 8.79141 3 9.35304V18.8824C3 19.444 3.22311 19.9826 3.62024 20.3798C4.01738 20.7769 4.55601 21 5.11764 21H14.647C15.2087 21 15.7473 20.7769 16.1444 20.3798C16.5416 19.9826 16.7647 19.444 16.7647 18.8824V17.8236"
        stroke={color}
        strokeWidth="1.60714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.7059 5.11776L18.8824 8.29421M20.3489 6.79598C20.7659 6.37897 21.0002 5.81338 21.0002 5.22364C21.0002 4.6339 20.7659 4.06831 20.3489 3.6513C19.9319 3.23429 19.3663 3.00002 18.7765 3.00002C18.1868 3.00002 17.6212 3.23429 17.2042 3.6513L8.29419 12.5295V15.7059H11.4707L20.3489 6.79598Z"
        stroke={color}
        strokeWidth="1.60714"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
