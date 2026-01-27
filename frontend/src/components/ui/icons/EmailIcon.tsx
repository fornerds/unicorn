import { cn } from '@/utils/cn';

interface EmailIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

export const EmailIcon = ({
  className,
  width = 16,
  height = 16,
  fill = 'currentColor',
}: EmailIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M2.23961 2H13.7596C13.9388 2 14.0903 2.06444 14.214 2.19333C14.3377 2.32222 14.3996 2.48 14.3996 2.66667V13.3333C14.3996 13.52 14.3377 13.6778 14.214 13.8067C14.0903 13.9356 13.9388 14 13.7596 14H2.23961C2.06041 14 1.90894 13.9356 1.78521 13.8067C1.66148 13.6778 1.59961 13.52 1.59961 13.3333V2.66667C1.59961 2.48 1.66148 2.32222 1.78521 2.19333C1.90894 2.06444 2.06041 2 2.23961 2ZM13.1196 4.82667L8.05081 9.56L2.87961 4.81333V12.6667H13.1196V4.82667ZM3.21241 3.33333L8.03801 7.77333L12.7996 3.33333H3.21241Z"
        fill={fill}
      />
    </svg>
  );
};
