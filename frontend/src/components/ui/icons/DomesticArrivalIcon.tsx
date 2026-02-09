import { cn } from '@/utils/cn';

interface DomesticArrivalIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const DomesticArrivalIcon = ({
  className,
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: DomesticArrivalIconProps) => {
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
        d="M2 21.494C3.295 21.59 4.384 20.5 5.333 20.5C6.282 20.5 7.825 21.505 8.667 21.494C9.677 21.503 10.86 20.5 12 20.5C13.14 20.5 14.323 21.503 15.333 21.494C16.628 21.59 17.717 20.5 18.667 20.5C19.617 20.5 21.158 21.505 22 21.494M6 20.5C4.582 18.734 3.583 16.473 3.157 15.275C3.022 14.895 2.955 14.705 3.033 14.523C3.112 14.342 3.303 14.257 3.688 14.087L11.178 10.769C11.582 10.589 11.785 10.5 12 10.5C12.215 10.5 12.418 10.59 12.823 10.77L20.312 14.087C20.696 14.257 20.888 14.342 20.967 14.523C21.045 14.705 20.977 14.895 20.843 15.275C20.417 16.473 19.418 18.734 18 20.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13L6.216 10.193C6.351 8.441 6.418 7.565 6.993 7.033C7.568 6.5 8.447 6.5 10.204 6.5H13.796C15.553 6.5 16.432 6.5 17.006 7.033C17.582 7.565 17.649 8.441 17.784 10.193L18 13"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 6.5L8.672 5.128C8.828 3.877 8.906 3.251 9.332 2.875C9.757 2.5 10.387 2.5 11.648 2.5H12.352C13.612 2.5 14.243 2.5 14.668 2.875C15.094 3.251 15.172 3.877 15.328 5.128L15.5 6.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
