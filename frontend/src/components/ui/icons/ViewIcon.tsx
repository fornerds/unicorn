import { cn } from '@/utils/cn';

interface ViewIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ViewIcon = ({
  className,
  width = 20,
  height = 20,
  stroke = '#BAC2D0',
  strokeWidth = 1.5,
}: ViewIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M1.6665 9.99935C1.6665 9.99935 4.69681 4.16602 9.99984 4.16602C15.3029 4.16602 18.3332 9.99935 18.3332 9.99935C18.3332 9.99935 15.3029 15.8327 9.99984 15.8327C4.69681 15.8327 1.6665 9.99935 1.6665 9.99935Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M9.99984 12.1868C11.255 12.1868 12.2726 11.2075 12.2726 9.99935C12.2726 8.79123 11.255 7.81185 9.99984 7.81185C8.74464 7.81185 7.72711 8.79123 7.72711 9.99935C7.72711 11.2075 8.74464 12.1868 9.99984 12.1868Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
};
