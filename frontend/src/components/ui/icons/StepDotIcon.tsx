import { cn } from '@/utils/cn';

interface StepDotIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  fill?: string;
}

export const StepDotIcon = ({
  className,
  width = 9,
  height = 9,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  fill = 'white',
}: StepDotIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9 9"
      fill="none"
      className={cn(className)}
    >
      <circle cx="4.5" cy="4.5" r="3.75" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
};
