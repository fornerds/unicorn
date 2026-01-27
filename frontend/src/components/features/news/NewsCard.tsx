'use client';

import Image from 'next/image';
import Link from 'next/link';
import { NewsItem } from '@/data/mockNews';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <Link href={ROUTES.NEWS_DETAIL(news.id)}>
      <div className="bg-gradient-to-t from-white from-[60.096%] to-[#fbfcfe] border border-[#eeeff1] flex flex-col h-[500px] items-center justify-between overflow-hidden pt-[20px] rounded-[12px] w-[378px] hover:opacity-90 transition-opacity">
        <div className="flex items-center px-[20px] w-full">
          <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
            {news.date}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] items-start w-full">
          <div className="flex flex-col h-[140px] items-center justify-between px-[20px] w-full">
            <div className="flex flex-1 flex-col items-center justify-between w-full">
              <div className="font-suit font-semibold leading-[1.5] overflow-hidden text-[24px] text-[#374151] w-full whitespace-pre-wrap">
                {news.title.split('\n').map((line, index) => (
                  <p key={index} className={index === 0 ? 'mb-0' : ''}>
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex flex-col font-suit font-medium h-[58px] justify-center leading-[1.5] overflow-hidden text-[15px] text-[#959ba9] w-full">
                <p className="line-clamp-2 leading-[1.5]">{news.description}</p>
              </div>
            </div>
          </div>
          <div className="flex h-[270px] items-center justify-center overflow-hidden w-full">
            <div className="flex-1 h-full relative w-full">
              <Image
                src={withBasePath(news.imageUrl)}
                alt={news.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
