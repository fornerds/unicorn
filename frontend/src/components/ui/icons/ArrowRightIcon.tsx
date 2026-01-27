import { cn } from '@/utils/cn';

interface ArrowRightIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowRightIcon = ({
  className,
  width = 14,
  height = 14,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ArrowRightIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0.750001 6.58333L12.4167 6.58333M12.4167 6.58333L6.58333 0.749999M12.4167 6.58333L6.58333 12.4167"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
