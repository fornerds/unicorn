import { cn } from '@/utils/cn';

interface LikeIconFilledProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const LikeIconFilled = ({
  className,
  width = 29,
  height = 25,
  fill = '#1F2937',
  stroke = '#1F2937',
  strokeWidth = 1,
}: LikeIconFilledProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 29 25"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M26.3409 2.62177C25.6568 1.94911 24.8445 1.4155 23.9504 1.05144C23.0563 0.687383 22.098 0.5 21.1302 0.5C20.1625 0.5 19.2042 0.687383 18.3101 1.05144C17.416 1.4155 16.6037 1.94911 15.9195 2.62177L14.4996 4.01714L13.0798 2.62177C11.6978 1.26368 9.82345 0.500704 7.86905 0.500704C5.91466 0.500704 4.04031 1.26368 2.65835 2.62177C1.27638 3.97987 0.5 5.82185 0.5 7.74249C0.5 9.66313 1.27638 11.5051 2.65835 12.8632L14.4996 24.5L26.3409 12.8632C27.0254 12.1909 27.5684 11.3926 27.9389 10.5139C28.3093 9.63531 28.5 8.69356 28.5 7.74249C28.5 6.79142 28.3093 5.84967 27.9389 4.97104C27.5684 4.09241 27.0254 3.29412 26.3409 2.62177Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
