import { cn } from '@/utils/cn';

interface BoxIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const BoxIcon = ({
  className,
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: BoxIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M5 5.75H19C20.2426 5.75 21.25 6.75736 21.25 8V16C21.25 17.2426 20.2426 18.25 19 18.25H5C3.75736 18.25 2.75 17.2426 2.75 16V8C2.75 6.75736 3.75736 5.75 5 5.75Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M18 15L15 15"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
