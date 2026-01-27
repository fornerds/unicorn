'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import Image from 'next/image';
import { withBasePath } from '@/utils/assets';

const categories = [
  {
    id: 1,
    title: 'HOME',
    subtitle: '가정용 로봇/가사 도우미',
    width: 539,
    textTop: 48,
    textLeft: 40,
    image: withBasePath('/images/HOME.png'),
    imageConfig: {
      type: 'positioned',
      left: 100,
      top: 54,
      width: 410,
      height: 360,
    },
    href: `${ROUTES.PRODUCTS}?category=HOME`,
  },
  {
    id: 2,
    title: 'FIREFIGHTING',
    subtitle: '화재진압/인명구조용 로봇',
    width: 651,
    textTop: 48,
    textLeft: 40,
    image: withBasePath('/images/FIREFIGHTING.png'),
    imageConfig: {
      type: 'positioned',
      left: 140,
      top: -72,
      width: 493,
      height: 612,
    },
    href: `${ROUTES.PRODUCTS}?category=FIREFIGHTING`,
  },
  {
    id: 3,
    title: 'INDUSTRIAL',
    subtitle: '위험 현장',
    width: 544,
    textTop: 47,
    textLeft: 33,
    image: withBasePath('/images/INDUSTRIAL.png'),
    imageConfig: {
      type: 'positioned',
      left: 248,
      top: -83,
      width: 296,
      height: 611,
    },
    href: `${ROUTES.PRODUCTS}?category=INDUSTRIAL`,
  },
  {
    id: 4,
    title: 'MEDICAL',
    subtitle: '단순 업무/환자케어 로봇',
    width: 719,
    textTop: 42,
    textLeft: 39,
    image: withBasePath('/images/MEDICAL.png'),
    imageConfig: {
      type: 'positioned',
      left: 240,
      top: -6,
      width: 480,
      height: 469,
    },
    href: `${ROUTES.PRODUCTS}?category=MEDICAL`,
  },
  {
    id: 5,
    title: 'LOGISTICS',
    subtitle: '분류/포장 로봇',
    width: 1067,
    textTop: 42,
    textLeft: 39,
    image: withBasePath('/images/LOGISTICS.png'),
    imageConfig: {
      type: 'positioned',
      left: -4,
      top: -58,
      width: 802,
      height: 530,
      transform: '-scale-y-100 rotate-180',
    },
    href: `${ROUTES.PRODUCTS}?category=LOGISTICS`,
  },
];

export const CategoryBannerSection = () => {

  return (
    <section className="snap-start h-screen w-screen flex items-center justify-center bg-white overflow-hidden relative">
      <div className="flex flex-col gap-[30px] items-end justify-center w-full h-full px-[10px] md:px-[20px] lg:px-[60px] py-[120px] box-border max-w-[1921px]">
        <div className="flex items-end justify-between w-full px-[2px] shrink-0">
          <div className="flex gap-[4px] items-start">
            <div className="flex items-center justify-center">
              <p className="font-suit font-medium text-[24px] md:text-[30px] lg:text-[36px] leading-[1.3] text-[#1e2023] tracking-[-1.44px] whitespace-nowrap">
                CATEGORY
              </p>
            </div>
            <div className="flex flex-col h-[47px] items-center py-[6px]">
              <p className="font-suit font-light text-[14px] md:text-[15px] lg:text-[16px] leading-[1.3] text-[#1e2023] tracking-[-0.64px] whitespace-pre-wrap">
                (5)
              </p>
            </div>
          </div>
          <div className="flex items-center px-[10px]">
            <Link
              href={ROUTES.PRODUCTS}
              className="font-suit font-semibold text-[14px] md:text-[15px] lg:text-[16px] leading-[1.45] text-[#959ba9] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              VIEW ALL
            </Link>
          </div>
        </div>

        <div className="flex flex-col w-full flex-1 min-h-0" style={{ gap: '10px' }}>
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: '580fr 651fr 544fr',
              gap: '10px',
              height: '31vh',
            }}
          >
            {categories.slice(0, 3).map((category, index) => (
              <Link
                key={category.id}
                href={category.href}
                className="group bg-[#f8f8f8] border border-[#eee] overflow-hidden relative rounded-[24px] shrink-0"
                style={{
                  gridColumn: `${index + 1} / ${index + 2}`,
                  height: '100%',
                  maxHeight: '414px',
                  padding: '34px 41px',
                }}
              >
                <div className="flex flex-col justify-center leading-[0] whitespace-nowrap z-10 relative">
                  <p className="font-suit font-bold text-[24px] leading-[normal] text-[#1f2937] mb-[8px]">
                    {category.title}
                  </p>
                  <p className="font-suit font-normal text-[16px] leading-[normal] text-[#6b7280]">
                    {category.subtitle}
                  </p>
                </div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
                  {category.imageConfig.type === 'fill' ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      unoptimized
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <div
                      className="absolute grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
                      style={{
                        left: `${category.imageConfig.left}px`,
                        top: `${category.imageConfig.top}px`,
                        width: `${category.imageConfig.width}px`,
                        height: `${category.imageConfig.height}px`,
                        transform: category.imageConfig.transform || undefined,
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={category.imageConfig.width}
                        height={category.imageConfig.height}
                        unoptimized
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: '719fr 1067fr',
              gap: '10px',
              height: 'calc((100% - 10px) / 2)',
            }}
          >
            {categories.slice(3).map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group bg-[#f8f8f8] border border-[#eee] overflow-hidden relative rounded-[24px] shrink-0"
                style={{
                  height: '100%',
                  maxHeight: '414px',
                  padding: '34px 41px',
                }}
              >
                <div className="flex flex-col justify-center leading-[0] whitespace-nowrap z-10 relative">
                  <p className="font-suit font-bold text-[24px] leading-[normal] text-[#1f2937] mb-[8px]">
                    {category.title}
                  </p>
                  <p className="font-suit font-normal text-[16px] leading-[normal] text-[#6b7280]">
                    {category.subtitle}
                  </p>
                </div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
                  {category.imageConfig.type === 'fill' ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      unoptimized
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <div
                      className="absolute grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
                      style={{
                        left: `${category.imageConfig.left}px`,
                        top: `${category.imageConfig.top}px`,
                        width: `${category.imageConfig.width}px`,
                        height: `${category.imageConfig.height}px`,
                        transform: category.imageConfig.transform || undefined,
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={category.imageConfig.width}
                        height={category.imageConfig.height}
                        unoptimized
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
