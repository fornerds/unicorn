'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MainBannerSection } from '@/components/features/home/MainBannerSection';
import { AIChatSection } from '@/components/features/home/AIChatSection';
import { CategoryBannerSection } from '@/components/features/home/CategoryBannerSection';
import { ArrowDownDoubleIcon } from '@/components/ui/icons';
import { useHeader } from '@/contexts/HeaderContext';

const HAS_SEEN_INTRO_KEY = 'unicorn-has-seen-intro';

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement>(null);
  const categorySectionRef = useRef<HTMLDivElement>(null);
  const { isFirstSection, setIsFirstSection, setShowInitialAnimation } = useHeader();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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

  // 카테고리 섹션이 보이면 스크롤 인디케이터 숨기기
  useEffect(() => {
    const section = categorySectionRef.current;
    const root = scrollContainerRef.current;
    if (!section || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowScrollIndicator(entry.intersectionRatio < 0.3);
        });
      },
      {
        root,
        threshold: [0, 0.3, 0.5, 1],
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
        <div ref={categorySectionRef}>
          <CategoryBannerSection />
        </div>
      </div>

      {/* 스크롤 인디케이터 — 섹션 1, 2에서 하단 고정, 섹션 3에서 페이드아웃 */}
      <motion.div
        className="fixed bottom-[20px] left-1/2 -translate-x-1/2 flex gap-[10px] items-end justify-center pointer-events-none max-w-[calc(100vw-40px)] px-[20px]"
        style={{ zIndex: 60 }}
        animate={{ opacity: showScrollIndicator ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className={`font-suit font-normal text-[20px] leading-[1.3] text-center tracking-[-0.8px] transition-colors duration-300 ${isFirstSection ? 'text-white' : 'text-[#6b7280]'}`}>
          계속 스크롤해서 카테고리 한 눈에 확인하기
        </p>
        <motion.div
          className="w-[14px] h-[24px] relative shrink-0 flex items-center justify-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDownDoubleIcon width={14} height={24} stroke={isFirstSection ? '#ffffff' : '#6B7280'} strokeWidth={1.16667} />
        </motion.div>
      </motion.div>
    </div>
  );
}
