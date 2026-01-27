import { cn } from '@/utils/cn';

interface ArrowDownDoubleIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowDownDoubleIcon = ({
  className,
  width = 14,
  height = 18,
  stroke = '#6B7280',
  strokeWidth = 1.16667,
}: ArrowDownDoubleIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 18"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M12.5833 0.583984L6.58325 7.58398L0.583251 0.583986"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5833 6.583984L6.58325 13.584L0.583251 6.583986"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
