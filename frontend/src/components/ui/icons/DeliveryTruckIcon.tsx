import { cn } from '@/utils/cn';

interface DeliveryTruckIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const DeliveryTruckIcon = ({
  className,
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: DeliveryTruckIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className)}
    >
      <g clipPath="url(#clip0_1107_8089)">
        <path
          d="M17.5067 21.7524C18.0903 21.7524 18.65 21.5206 19.0626 21.1079C19.4753 20.6953 19.7071 20.1356 19.7071 19.552C19.7071 18.9684 19.4753 18.4087 19.0626 17.9961C18.65 17.5834 18.0903 17.3516 17.5067 17.3516C16.9231 17.3516 16.3634 17.5834 15.9508 17.9961C15.5381 18.4087 15.3063 18.9684 15.3063 19.552C15.3063 20.1356 15.5381 20.6953 15.9508 21.1079C16.3634 21.5206 16.9231 21.7524 17.5067 21.7524ZM6.50901 21.7524C7.0926 21.7524 7.65229 21.5206 8.06495 21.1079C8.4776 20.6953 8.70943 20.1356 8.70943 19.552C8.70943 18.9684 8.4776 18.4087 8.06495 17.9961C7.65229 17.5834 7.0926 17.3516 6.50901 17.3516C5.92543 17.3516 5.36574 17.5834 4.95308 17.9961C4.54042 18.4087 4.30859 18.9684 4.30859 19.552C4.30859 20.1356 4.54042 20.6953 4.95308 21.1079C5.36574 21.5206 5.92543 21.7524 6.50901 21.7524Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <path
          d="M19.6993 19.5508C22.6511 19.5508 22.9999 18.5298 22.9999 15.7132C22.9999 14.3655 22.9999 13.6922 22.7359 13.1234C22.4608 12.5292 21.9635 12.1585 20.9183 11.4015C19.8808 10.649 19.1426 9.80402 18.4395 8.63999C17.4361 6.97868 16.9355 6.14802 16.1841 5.69803C15.4305 5.24805 14.5437 5.24805 12.7701 5.24805H12V12.9495"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.30828 19.5463C4.30828 19.5463 3.03204 19.5573 2.63596 19.5067C2.3059 19.3747 1.90542 19.0645 1.64577 18.8928C0.853621 18.3658 1.01315 18.5826 1.01315 18.1073L1.00875 14.0563V13.0001C1.00875 12.9341 0.940538 12.9484 1.44884 12.9561H22.432M8.70692 19.553H15.306"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1107_8089">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
