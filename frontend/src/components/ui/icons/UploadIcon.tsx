import { cn } from '@/utils/cn';

interface UploadIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const UploadIcon = ({
  className,
  width = 28,
  height = 28,
  stroke = 'currentColor',
  strokeWidth = 2,
}: UploadIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M13.9997 22.166L13.9997 5.83268M13.9997 5.83268L5.83307 13.9993M13.9997 5.83268L22.1664 13.9993"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
