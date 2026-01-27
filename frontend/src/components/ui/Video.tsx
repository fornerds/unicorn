import { getVideoPath, withBasePath } from '@/utils/assets';
import { cn } from '@/utils/cn';

interface VideoProps {
  src: string;
  className?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  poster?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export const Video = ({
  src,
  className,
  width,
  height,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = true,
  preload = 'metadata',
  poster,
  onPlay,
  onPause,
  onEnded,
}: VideoProps) => {
  const videoSrc = src.startsWith('/') ? withBasePath(src) : getVideoPath(src);

  return (
    <video
      src={videoSrc}
      className={cn('w-full h-auto', className)}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      poster={poster}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
    >
      <source src={videoSrc} type="video/mp4" />
      브라우저가 video 태그를 지원하지 않습니다.
    </video>
  );
};
