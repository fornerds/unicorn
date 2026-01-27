import { cn } from '@/utils/cn';

interface TimeIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const TimeIcon = ({
  className,
  width = 56,
  height = 56,
  stroke = 'currentColor',
  strokeWidth = 2,
}: TimeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 56 56"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M28.0013 51.3327C40.8883 51.3327 51.3346 40.8863 51.3346 27.9993C51.3346 15.1123 40.8883 4.66602 28.0013 4.66602C15.1143 4.66602 4.66797 15.1123 4.66797 27.9993C4.66797 40.8863 15.1143 51.3327 28.0013 51.3327Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M28.0117 14V28.0117L37.9039 37.905"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
