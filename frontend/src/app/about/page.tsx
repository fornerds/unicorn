'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video } from '@/components/ui/Video';
import { DownloadIcon, EmailIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import { withBasePath } from '@/utils/assets';
import { useHeader } from '@/contexts/HeaderContext';

export default function AboutPage() {
  const { setIsFirstSection } = useHeader();
  const innovationCards = [
    {
      id: 1,
      title: 'AI엔진',
      description: '자체 개발한 딥러닝 AI 엔진으로 로봇의 학습 능력과 판단력을 극대화했습니다. 실시간 환경 인식과 자율 의사결정이 가능합니다.',
      image: withBasePath('/images/Innovation01.png'),
    },
    {
      id: 2,
      title: '고객맞춤 기능 설정',
      description: '마이크로미터 단위의 정밀한 동작 제어가 가능한 모터 시스템으로 의료용 수술부터 섬세한 조립 작업까지 완벽하게 수행합니다.',
      image: withBasePath('/images/Innovation02.png'),
    },
    {
      id: 3,
      title: 'AI엔진',
      description: '자체 개발한 딥러닝 AI 엔진으로 로봇의 학습 능력과 판단력을 극대화했습니다. 실시간 환경 인식과 자율 의사결정이 가능합니다.',
      image: withBasePath('/images/Innovation03.png'),
    },
    {
      id: 4,
      title: '고객맞춤 기능 설정',
      description: '마이크로미터 단위의 정밀한 동작 제어가 가능한 모터 시스템으로 의료용 수술부터 섬세한 조립 작업까지 완벽하게 수행합니다.',
      image: withBasePath('/images/Innovation04.png'),
    },
  ];
  const videoRef = useRef<HTMLDivElement>(null);
  const valueSectionRef = useRef<HTMLDivElement>(null);
  const innovationSectionRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    const updateVideoHeight = () => {
      if (videoRef.current) {
        setVideoHeight(window.innerHeight);
      }
    };

    updateVideoHeight();
    window.addEventListener('resize', updateVideoHeight);
    return () => window.removeEventListener('resize', updateVideoHeight);
  }, []);

  // 첫 번째 섹션(비디오)이 보이는지 확인하여 헤더 투명도 제어
  useEffect(() => {
    // 초기 상태 설정: 페이지 로드 시 첫 섹션이 보이는 상태로 시작
    setIsFirstSection(true);

    const videoSection = videoRef.current;
    if (!videoSection) return;

    // IntersectionObserver 설정 (메인 페이지와 동일한 방식)
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
    const rect = videoSection.getBoundingClientRect();
    const isVisible = rect.top >= -100 && rect.top <= window.innerHeight / 2;
    if (isVisible) {
      setIsFirstSection(true);
    }

    observer.observe(videoSection);

    return () => {
      observer.disconnect();
    };
  }, [setIsFirstSection]);

  // 패럴랙스 스크롤 효과를 위한 useScroll 및 useTransform
  // 비디오 섹션의 스크롤 진행률을 추적하여 패럴랙스 효과 적용
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ['start start', 'end start'],
  });

  // 비디오는 약간의 패럴랙스 효과 (위로 이동)
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  
  // 텍스트는 비디오보다 더 느리게 이동 (덜 이동)
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className="relative" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
      {/* 패럴랙스 비디오 섹션 */}
      <div
        ref={videoRef}
        data-video-section
        className="sticky w-full overflow-hidden z-0"
        style={{
          top: 0,
          height: videoHeight ? `${videoHeight}px` : '100vh',
        }}
      >
        {/* 비디오 레이어 - 약간의 패럴랙스 효과 */}
        <motion.div
          style={{ 
            y: videoY,
          }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <Video
            src="/videos/company.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>
        
        {/* 텍스트 레이어 - 약간의 패럴랙스 효과 */}
        <motion.div 
          style={{ y: textY }}
          className="absolute inset-0 flex flex-col gap-[10px] items-start justify-center px-[20px] md:px-[40px] lg:px-[141px] z-10"
        >
          <h1 className="font-suit font-extralight text-[60px] md:text-[90px] leading-[normal] text-black whitespace-nowrap">
            Company
          </h1>
          <p className="font-suit font-light text-[20px] md:text-[28px] leading-[normal] text-black max-w-[865px]">
            더 나은 내일을 제안하는 AI 로봇 큐레이션 서비스
          </p>
        </motion.div>
      </div>

      {/* 컨텐츠 섹션 - 위로 올라오면서 비디오를 가리는 효과 */}
      <div className="bg-white relative" style={{ minHeight: '200vh', zIndex: 20, position: 'relative' }}>
        <div className="flex flex-col gap-[254px] items-start pb-[200px] pt-[120px] px-[20px] md:px-[40px] lg:px-[142px] w-full max-w-[1920px] mx-auto">
          <motion.div
            ref={valueSectionRef}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-[50px] items-start w-full"
          >
            <h2 className="font-suit font-light text-[40px] md:text-[60px] leading-[normal] text-black">
              Value
            </h2>
            <div className="flex flex-col lg:flex-row gap-[30px] items-start w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#f8f8f8] border border-[#eee] flex flex-col gap-[10px] items-start px-[30px] md:px-[50px] py-[30px] rounded-[26px] w-full lg:flex-1 lg:min-w-[682px] h-[463px] relative overflow-hidden"
              >
                <div className="flex flex-col gap-[16px] items-start w-full z-10">
                  <h3 className="font-suit font-semibold text-[28px] md:text-[36px] leading-[normal] text-black">
                    Mission
                  </h3>
                  <div className="flex flex-col font-suit font-extralight text-[16px] md:text-[20px] leading-[normal] tracking-[-0.6px] text-black">
                    <p className="mb-0">
                      AI 기술과 로봇 공학의 융합으로 인류의 삶을 더욱 편리하고 안전하게 만드는 것이 우리의 사명입니다.
                    </p>
                    <p>
                      의료, 물류, 위험현장부터 일상생활까지 모든 영역에서 혁신적인 로봇 솔루션을 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="absolute right-[49px] top-[52px] w-[661px] h-[412px] hidden lg:block">
                  <Image
                    src={withBasePath('/images/mission.png')}
                    alt="Mission"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </motion.div>

              <div className="flex flex-col gap-[40px] items-center w-full lg:w-[670px]">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-[#f8f8f8] border border-[#eee] flex h-[254px] items-center justify-between rounded-[26px] w-full overflow-hidden relative"
                >
                  <div className="absolute left-[0px] bottom-[-16px] w-[200px] h-[200px]">
                    <Image
                      src={withBasePath('/images/vision01.png')}
                      alt="Vision background"
                      fill
                      unoptimized
                      className="object-cover opacity-60"
                    />
                  </div>
                  <div className="absolute right-[60px] bottom-[-1px] w-[430px] h-[220px]">
                    <Image
                      src={withBasePath('/images/vision02.png')}
                      alt="Vision"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col gap-[16px] items-start px-[20px] w-full"
                >
                  <h3 className="font-suit font-semibold text-[28px] md:text-[36px] leading-[normal] text-black">
                    Vision
                  </h3>
                  <div className="flex flex-col font-suit font-extralight text-[16px] md:text-[20px] leading-[normal] tracking-[-0.6px] text-black">
                    <p className="mb-0">
                      2030년까지 글로벌 로봇 시장의 선도 기업이 되어,
                    </p>
                    <p>전 세계 사람들이 로봇과 함께하는 더 나은 미래를 만들어가겠습니다.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={innovationSectionRef}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-[50px] items-center px-[20px] w-full"
          >
            <h2 className="font-suit font-light text-[40px] md:text-[60px] leading-[normal] text-black w-full text-left">
              Innovation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] md:gap-[40px] items-start w-full">
              {innovationCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col gap-[40px] items-start rounded-[30px] w-full"
                >
                  <div className="flex items-center justify-center w-full h-[430px] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 w-full h-full"
                      initial={{ x: '-40%' }}
                      whileHover={{ x: '-10%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <Image
                        key={card.id}
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain object-bottom"
                        unoptimized
                        priority={index < 2}
                      />
                    </motion.div>
                  </div>
                  <div className="flex flex-col gap-[12px] items-start text-black w-full">
                    <h3 className="font-suit font-medium text-[24px] md:text-[28px] leading-[normal]">
                      {card.title}
                    </h3>
                    <p className="font-suit font-extralight text-[14px] md:text-[16px] leading-[normal]">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="bg-[#E3E8EE] h-[353px] overflow-hidden relative w-full">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0.17) 100%), url('${withBasePath('/images/detailbackground.png')}') lightgray 50% / cover no-repeat`,
              filter: 'blur(2px)',
            }}
          />
          <div className="relative z-10 flex flex-col gap-[21px] items-start px-[20px] md:px-[40px] lg:px-[143px] pt-[70px]">
            <div className="flex flex-col gap-[21px] items-start w-full max-w-[850px]">
              <h2 className="font-suit font-semibold text-[32px] md:text-[45px] leading-[normal] text-[#1f2937]">
                Detail
              </h2>
              <div className="flex flex-col font-suit font-extralight text-[18px] md:text-[22px] leading-[normal] tracking-[-0.66px] text-[#1f2937]">
                <p className="mb-0">
                  Unicorn과 함께 로봇 기술의 새로운 가능성을 탐험해보세요.
                </p>
                <p>궁금한 점이 있으시면 언제든 연락주세요.</p>
              </div>
            </div>
            <div className="flex gap-[11px] items-center">
              <button className="bg-[#1f2937] flex h-[49px] items-center justify-center gap-[8px] px-[32px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity">
                <EmailIcon width={16} height={16} fill="white" />
                <p className="font-suit font-medium text-[16px] leading-[24px] text-white text-center whitespace-nowrap">
                  문의하기
                </p>
              </button>
              <button className="bg-white border-[0.5px] border-[#1f2937] flex h-[49px] items-center justify-center gap-[8px] px-[32px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity">
                <DownloadIcon width={16} height={16} fill="#1f2937" />
                <p className="font-suit font-medium text-[16px] leading-[24px] text-[#1f2937] text-center whitespace-nowrap">
                  회사소개서 다운로드
                </p>
              </button>
            </div>
          </div>
          <div className="absolute bg-gradient-to-r from-[rgba(120,132,160,0)] to-[rgba(69,78,98,0.7)] h-[353px] right-0 top-0 w-[334px] pointer-events-none" />
          <div className="absolute right-[80px] top-[-12px] w-[530px] h-[377px] hidden lg:block pointer-events-none">
            <Image
              src={withBasePath('/images/detail.png')}
              alt="Detail"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
