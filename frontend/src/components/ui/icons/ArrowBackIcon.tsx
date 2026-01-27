import { cn } from '@/utils/cn';

interface ArrowBackIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowBackIcon = ({
  className,
  width = 20,
  height = 16,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ArrowBackIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 16"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M19.4165 7.52312L0.749837 7.52312M0.749837 7.52312L7.58313 14.5234M0.749837 7.52312L7.58313 0.523438"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};
