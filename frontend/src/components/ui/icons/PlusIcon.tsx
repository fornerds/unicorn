import { cn } from '@/utils/cn';

interface PlusIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const PlusIcon = ({
  className,
  width = 15,
  height = 15,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: PlusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M7.41667 0.75V14.0833M0.75 7.41667H14.0833"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
