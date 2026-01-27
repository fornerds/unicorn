import { cn } from '@/utils/cn';

interface ArrowDownIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowDownIcon = ({
  className,
  width = 17,
  height = 10,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ArrowDownIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17 10"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0.75 0.75L8.25 9.08333L15.75 0.750001"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
