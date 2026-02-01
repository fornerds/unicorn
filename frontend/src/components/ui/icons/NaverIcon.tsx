import { cn } from '@/utils/cn';

interface NaverIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const NaverIcon = ({
  className,
  width = 16,
  height = 16,
}: NaverIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
    >
      <g clipPath="url(#clip0_958_2769)">
        <path
          d="M10.8491 8.56267L4.91687 0H0V16H5.15088V7.436L11.0831 16H16V0H10.8491V8.56267Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_958_2769">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
