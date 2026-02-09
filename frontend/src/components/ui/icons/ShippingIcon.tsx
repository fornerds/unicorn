import { cn } from '@/utils/cn';

interface ShippingIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ShippingIcon = ({
  className,
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ShippingIconProps) => {
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
        d="M16.5 10.6422L7.5 5.49939M13.2754 3.65696L19.704 7.33024C20.0978 7.55516 20.425 7.88021 20.6526 8.27242C20.8802 8.66464 21.0001 9.11006 21 9.56353V15.5781C21.0001 16.0316 20.8802 16.477 20.6526 16.8692C20.425 17.2614 20.0978 17.5865 19.704 17.8114L13.2754 21.4847C12.887 21.7066 12.4474 21.8233 12 21.8233C11.5526 21.8233 11.113 21.7066 10.7246 21.4847L4.296 17.8114C3.90224 17.5865 3.57497 17.2614 3.34736 16.8692C3.11976 16.477 2.99992 16.0316 3 15.5781V9.56353C2.99992 9.11006 3.11976 8.66464 3.34736 8.27242C3.57497 7.88021 3.90224 7.55516 4.296 7.33024L10.7246 3.65696C11.113 3.43507 11.5526 3.31836 12 3.31836C12.4474 3.31836 12.887 3.43507 13.2754 3.65696Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.64062 8.71484L10.7789 12.5591C11.1535 12.7608 11.5723 12.8664 11.9978 12.8664C12.4232 12.8664 12.842 12.7608 13.2166 12.5591L20.3549 8.71484M11.9978 13.2148V21.572"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
