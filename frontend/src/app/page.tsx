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
    // 초기 상태 설정: 페이지 로드 시 첫 섹션이 보이는 상태로 시작
    setIsFirstSection(true);

    const firstSection = firstSectionRef.current;
    if (!firstSection) return;

    // IntersectionObserver 설정
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

    // 즉시 한 번 확인하여 초기 상태 설정
    const rect = firstSection.getBoundingClientRect();
    const isVisible = rect.top >= -100 && rect.top <= window.innerHeight / 2;
    if (isVisible) {
      setIsFirstSection(true);
    }

    observer.observe(firstSection);

    return () => {
      observer.disconnect();
    };
  }, [setIsFirstSection]);

  // body 스크롤을 막고 스크롤 컨테이너만 스크롤되도록 설정
  useEffect(() => {
    // body 스크롤 비활성화
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // 컴포넌트 언마운트 시 복원
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="relative" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
      <div
        ref={scrollContainerRef}
        className="snap-y snap-mandatory overflow-y-scroll h-screen"
        style={{ 
          backgroundColor: 'transparent', 
          background: 'transparent',
          // 스크롤 컨테이너가 전체 뷰포트를 차지하도록
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100vh',
        }}
      >
        <MainBannerSection ref={firstSectionRef} />
        <AIChatSection />
        <CategoryBannerSection />
      </div>
    </div>
  );
}
