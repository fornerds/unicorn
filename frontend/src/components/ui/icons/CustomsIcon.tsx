import { cn } from '@/utils/cn';

interface CustomsIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  fill?: string;
}

export const CustomsIcon = ({
  className,
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  fill = 'white',
}: CustomsIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className)}
    >
      <g clipPath="url(#clip0_1107_8092)">
        <path
          d="M12.7263 2.82843C13.1013 2.45335 13.61 2.24264 14.1405 2.24264L19.7973 2.24264C20.9019 2.24264 21.7973 3.13807 21.7973 4.24264L21.7973 9.89949C21.7973 10.4299 21.5866 10.9386 21.2115 11.3137L11.8978 20.6274C11.1168 21.4085 9.85045 21.4085 9.06941 20.6274L3.41255 14.9706C2.6315 14.1895 2.6315 12.9232 3.41255 12.1421L12.7263 2.82843Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="16.5"
          cy="16.5"
          r="3.75"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <path
          d="M19.5 19.5L22.5 22.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle cx="17" cy="7" r="1.5" fill={stroke} />
      </g>
      <defs>
        <clipPath id="clip0_1107_8092">
          <rect width="24" height="24" fill="none" />
        </clipPath>
      </defs>
    </svg>
  );
};
