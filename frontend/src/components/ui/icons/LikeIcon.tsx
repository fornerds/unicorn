import { cn } from '@/utils/cn';

interface LikeIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  isLiked?: boolean;
}

export const LikeIcon = ({
  className,
  width = 20,
  height = 18,
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 0.6875,
  isLiked = false,
}: LikeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 18"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M18.1094 1.80247C17.639 1.34001 17.0806 0.97316 16.4659 0.722868C15.8512 0.472576 15.1924 0.34375 14.527 0.34375C13.8617 0.34375 13.2029 0.472576 12.5882 0.722868C11.9735 0.97316 11.415 1.34001 10.9447 1.80247L9.9685 2.76178L8.99233 1.80247C8.04223 0.868777 6.75362 0.344234 5.40997 0.344234C4.06633 0.344234 2.77771 0.868777 1.82761 1.80247C0.877511 2.73616 0.34375 4.00252 0.34375 5.32296C0.34375 6.6434 0.877511 7.90976 1.82761 8.84345L9.9685 16.8438L18.1094 8.84345C18.58 8.38122 18.9533 7.83239 19.208 7.22833C19.4627 6.62427 19.5938 5.97682 19.5938 5.32296C19.5938 4.6691 19.4627 4.02165 19.208 3.41759C18.9533 2.81353 18.58 2.26471 18.1094 1.80247Z"
        fill={isLiked ? fill : 'none'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
