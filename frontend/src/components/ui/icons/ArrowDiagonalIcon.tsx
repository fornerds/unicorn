import { cn } from '@/utils/cn';

interface ArrowDiagonalIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowDiagonalIcon = ({
  className,
  width = 11,
  height = 11,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ArrowDiagonalIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 11 11"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0.750008 0.750145L9.89483 9.89497M9.89483 9.89497V0.750145M9.89483 9.89497H0.750008"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
