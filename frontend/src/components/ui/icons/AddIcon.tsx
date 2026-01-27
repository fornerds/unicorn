import { cn } from '@/utils/cn';

interface AddIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const AddIcon = ({
  className,
  width = 12,
  height = 12,
  stroke = 'currentColor',
  strokeWidth = 1,
}: AddIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M5.83333 0.5V11.1667M0.5 5.83333H11.1667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
