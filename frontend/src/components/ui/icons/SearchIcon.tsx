import { cn } from '@/utils/cn';

interface SearchIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const SearchIcon = ({
  className,
  width = 18,
  height = 18,
  stroke = 'currentColor',
  strokeWidth = 1.75,
}: SearchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M16.875 16.875L13.0083 13.0083M15.0972 7.98611C15.0972 11.9135 11.9135 15.0972 7.98611 15.0972C4.05875 15.0972 0.875 11.9135 0.875 7.98611C0.875 4.05875 4.05875 0.875 7.98611 0.875C11.9135 0.875 15.0972 4.05875 15.0972 7.98611Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
