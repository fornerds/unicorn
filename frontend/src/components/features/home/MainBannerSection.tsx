"use client";

import { forwardRef, useEffect, useState } from "react";
import { Video } from "@/components/ui/Video";
import { useHeader } from "@/contexts/HeaderContext";
import { cn } from "@/utils/cn";

export const MainBannerSection = forwardRef<HTMLElement>((props, ref) => {
  const { logoAnimationComplete, showInitialAnimation, isFirstSection } =
    useHeader();
  const [textAnimationStarted, setTextAnimationStarted] = useState(false);

  useEffect(() => {
    // 첫 진입이 아닌 경우 (다른 페이지에서 돌아온 경우) 즉시 텍스트 표시
    if (!showInitialAnimation && isFirstSection) {
      setTextAnimationStarted(true);
      return;
    }

    // 첫 진입인 경우: 로고 애니메이션이 완료된 후에만 텍스트 표시
    // logoAnimationComplete가 false -> true로 변경될 때만 실행
    if (showInitialAnimation && isFirstSection && logoAnimationComplete) {
      const timer = setTimeout(() => {
        setTextAnimationStarted(true);
      }, 300);
      return () => clearTimeout(timer);
    }

    // 첫 진입이지만 아직 로고 애니메이션이 완료되지 않은 경우 텍스트 숨김
    if (showInitialAnimation && isFirstSection && !logoAnimationComplete) {
      setTextAnimationStarted(false);
    }
  }, [logoAnimationComplete, showInitialAnimation, isFirstSection]);

  return (
    <section
      ref={ref}
      className="snap-start h-screen w-full relative flex items-center justify-center bg-black overflow-hidden"
    >
      <Video
        src="/videos/main.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      />
    </section>
  );
});

MainBannerSection.displayName = "MainBannerSection";
