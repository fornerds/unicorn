import { cn } from '@/utils/cn';

interface DownloadIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

export const DownloadIcon = ({
  className,
  width = 12,
  height = 13,
  fill = 'currentColor',
}: DownloadIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 13"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0 11.3327H11.52V12.666H0V11.3327ZM6.4 7.45268L10.2912 3.39935L11.1872 4.34601L5.76 9.99935L0.3328 4.34601L1.2288 3.39935L5.12 7.45268V-0.00065136H6.4V7.45268Z"
        fill={fill}
      />
    </svg>
  );
};
