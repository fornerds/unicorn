import { cn } from "@/utils/cn";

interface ArrowDownIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

export const ArrowDownIcon = ({
  className,
  width = 11,
  height = 6,
  fill = "#4B5563",
}: ArrowDownIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path
        d="M0.4375 0.4375L4.9375 5.4375L9.4375 0.4375"
        stroke="#6B7280"
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
