'use client';

import { motion } from 'framer-motion';

interface AiIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
}

const svgPaths = {
  p255ab000:
    'M16.4027 12.5L20.0374 13.0342C20.9192 13.1642 20.9192 14.4389 20.0374 14.5689L16.4027 15.1031C14.3394 15.4055 12.7199 17.025 12.4175 19.0882L11.8833 22.7229C11.7533 23.6048 10.4786 23.6048 10.3486 22.7229L9.81444 19.0882C9.51202 17.025 7.89252 15.4055 5.82927 15.1031L2.19457 14.5689C1.31275 14.4389 1.31275 13.1642 2.19457 13.0342L5.82927 12.5C7.89252 12.1976 9.51202 10.5781 9.81444 8.51482L10.3486 4.88012C10.4786 3.99829 11.7533 3.99829 11.8833 4.88012L12.4175 8.51482C12.7199 10.5781 14.3394 12.1976 16.4027 12.5Z',
  p2ac7a480:
    'M21.8751 5.94453L23.4744 6.17957C23.8624 6.23677 23.8624 6.79764 23.4744 6.85484L21.8751 7.08988C20.9673 7.22295 20.2547 7.93553 20.1216 8.84336L19.8866 10.4426C19.8294 10.8306 19.2685 10.8306 19.2113 10.4426L18.9763 8.84336C18.8432 7.93553 18.1306 7.22295 17.2228 7.08988L15.6235 6.85484C15.2355 6.79764 15.2355 6.23677 15.6235 6.17957L17.2228 5.94453C18.1306 5.81146 18.8432 5.09888 18.9763 4.19105L19.2113 2.59178C19.2685 2.20378 19.8294 2.20378 19.8866 2.59178L20.1216 4.19105C20.2547 5.09888 20.9673 5.81146 21.8751 5.94453Z',
};

export const AiIcon = ({
  className,
  width = 26,
  height = 26,
  fill = '#9CA3AF',
}: AiIconProps) => {
  return (
    <div className={className} style={{ width, height }} data-name="AiIcon">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 26 26"
      >
        <g id="AiIcon">
          <motion.path
            d={svgPaths.p255ab000}
            fill={fill}
            id="Vector"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              originX: 0.46,
              originY: 0.48,
            }}
          />
          <motion.path
            d={svgPaths.p2ac7a480}
            fill={fill}
            id="Vector_2"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.75,
            }}
            style={{
              originX: 0.75,
              originY: 0.25,
            }}
          />
        </g>
      </svg>
    </div>
  );
};
