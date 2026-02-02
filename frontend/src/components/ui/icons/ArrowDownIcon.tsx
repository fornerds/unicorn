import { cn } from '@/utils/cn';

interface ArrowDownIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

export const ArrowDownIcon = ({
  className,
  width = 11,
  height = 6,
  fill = '#4B5563',
}: ArrowDownIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 11 6"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M10.6667 0.000650872L5.33333 5.33398L2.33127e-07 0.000650406L10.6667 0.000650872Z"
        fill={fill}
      />
    </svg>
  );
};
