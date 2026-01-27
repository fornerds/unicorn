'use client';

import { useEffect, useRef } from 'react';
import { MainBannerSection } from '@/components/features/home/MainBannerSection';
import { AIChatSection } from '@/components/features/home/AIChatSection';
import { CategoryBannerSection } from '@/components/features/home/CategoryBannerSection';
import { useHeader } from '@/contexts/HeaderContext';

const HAS_SEEN_INTRO_KEY = 'unicorn-has-seen-intro';

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement>(null);
  const { setIsFirstSection, setShowInitialAnimation } = useHeader();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(HAS_SEEN_INTRO_KEY);
    if (!hasSeenIntro) {
      setShowInitialAnimation(true);
      localStorage.setItem(HAS_SEEN_INTRO_KEY, 'true');
    }
  }, [setShowInitialAnimation]);

  useEffect(() => {
    const firstSection = firstSectionRef.current;
    if (!firstSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setIsFirstSection(true);
          } else {
            setIsFirstSection(false);
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '-100px 0px',
      }
    );

    observer.observe(firstSection);

    return () => {
      observer.disconnect();
    };
  }, [setIsFirstSection]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="snap-y snap-mandatory overflow-y-scroll h-screen"
      >
        <MainBannerSection ref={firstSectionRef} />
        <AIChatSection />
        <CategoryBannerSection />
      </div>
    </div>
  );
}
