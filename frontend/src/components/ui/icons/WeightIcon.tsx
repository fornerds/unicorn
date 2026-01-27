import { cn } from '@/utils/cn';

interface WeightIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
  fill?: string;
}

export const WeightIcon = ({
  className,
  width = 56,
  height = 56,
  stroke = 'currentColor',
  strokeWidth = 2,
  fill = 'currentColor',
}: WeightIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 56 56"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M47.8346 4.66602H8.16797C7.23971 4.66602 6.34947 5.03476 5.6931 5.69114C5.03672 6.34752 4.66797 7.23776 4.66797 8.16602V47.8327C4.66797 48.7609 5.03672 49.6512 5.6931 50.3076C6.34947 50.9639 7.23971 51.3327 8.16797 51.3327H47.8346C48.7629 51.3327 49.6531 50.9639 50.3095 50.3076C50.9659 49.6512 51.3346 48.7609 51.3346 47.8327V8.16602C51.3346 7.23776 50.9659 6.34752 50.3095 5.69114C49.6531 5.03476 48.7629 4.66602 47.8346 4.66602Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M14 22.2285C17.8788 17.5619 22.5454 15.2285 28 15.2285C33.4538 15.2285 38.1204 17.5619 42 22.2285"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M28 36.166C28.9283 36.166 29.8185 35.7973 30.4749 35.1409C31.1313 34.4845 31.5 33.5943 31.5 32.666C31.5 31.7378 31.1313 30.8475 30.4749 30.1911C29.8185 29.5348 28.9283 29.166 28 29.166C27.0717 29.166 26.1815 29.5348 25.5251 30.1911C24.8687 30.8475 24.5 31.7378 24.5 32.666C24.5 33.5943 24.8687 34.4845 25.5251 35.1409C26.1815 35.7973 27.0717 36.166 28 36.166Z"
        fill={fill}
      />
      <path
        d="M22.168 24.5L28.0106 32.6667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
