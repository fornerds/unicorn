import { cn } from '@/utils/cn';

interface ArrowRightWhiteIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const ArrowRightWhiteIcon = ({
  className,
  width = 28,
  height = 28,
}: ArrowRightWhiteIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      className={cn(className)}
    >
      <line x1="1" y1="13.75" x2="26" y2="13.75" stroke="white" strokeWidth="0.5" />
      <line x1="20.1768" y1="7.82322" x2="26.1768" y2="13.8232" stroke="white" strokeWidth="0.5" />
      <line
        y1="-0.25"
        x2="8.48528"
        y2="-0.25"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 26 14)"
        stroke="white"
        strokeWidth="0.5"
      />
    </svg>
  );
};
