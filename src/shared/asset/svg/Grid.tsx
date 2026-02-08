import type { SvgProps } from "@/shared/types/svg";

export default function Grid({ isActive = false }: SvgProps) {
  if (isActive) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3.34814"
          y="3.34821"
          width="7.875"
          height="7.875"
          rx="2.14286"
          fill="#CACACA"
        />
        <rect
          x="3.34814"
          y="12.7768"
          width="7.875"
          height="7.875"
          rx="2.14286"
          fill="#CACACA"
        />
        <rect
          x="12.7769"
          y="3.34824"
          width="7.875"
          height="7.875"
          rx="2.14286"
          fill="#CACACA"
        />
        <path
          d="M12.7769 14.9197C12.7769 13.7362 13.7362 12.7768 14.9197 12.7768H16.7144H18.509C19.6925 12.7768 20.6519 13.7362 20.6519 14.9197V18.509C20.6519 19.6924 19.6925 20.6518 18.509 20.6518H16.7144H14.9197C13.7362 20.6518 12.7769 19.6924 12.7769 18.509V16.7143V14.9197Z"
          fill="#CACACA"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4.09814"
        y="4.09821"
        width="6.375"
        height="6.375"
        rx="1.39286"
        stroke="#CACACA"
        strokeWidth="1.5"
      />
      <rect
        x="4.09814"
        y="13.5268"
        width="6.375"
        height="6.375"
        rx="1.39286"
        stroke="#CACACA"
        strokeWidth="1.5"
      />
      <rect
        x="13.5269"
        y="4.09824"
        width="6.375"
        height="6.375"
        rx="1.39286"
        stroke="#CACACA"
        strokeWidth="1.5"
      />
      <path
        d="M14.9194 13.5268H18.5093C19.2783 13.527 19.9017 14.1504 19.9019 14.9194V18.5092C19.9017 19.2783 19.2783 19.9017 18.5093 19.9018H14.9194C14.1504 19.9017 13.527 19.2783 13.5269 18.5092V14.9194C13.527 14.1504 14.1504 13.527 14.9194 13.5268Z"
        stroke="#CACACA"
        strokeWidth="1.5"
      />
    </svg>
  );
}
