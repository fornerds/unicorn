'use client';

import { useState, useMemo, useEffect } from 'react';
import { NewsCard } from '@/components/features/news/NewsCard';
import { NewsCardSkeleton } from '@/components/features/news/NewsCardSkeleton';
import { NewsSearchBar } from '@/components/features/news/NewsSearchBar';
import { NewsTagFilter } from '@/components/features/news/NewsTagFilter';
import { NewsSortDropdown } from '@/components/features/news/NewsSortDropdown';
import { NewsPagination } from '@/components/features/news/NewsPagination';
import { mockNewsData } from '@/data/mockNews';

type SortOption = 'latest' | 'popular' | 'recommended';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('전체');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 12;

  const filteredNews = useMemo(() => {
    let filtered = [...mockNewsData];

    if (searchQuery) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          news.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag !== '전체') {
      filtered = filtered.filter((news) => news.tags.includes(selectedTag));
    }

    switch (sortOption) {
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recommended':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  }, [searchQuery, selectedTag, sortOption]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage, itemsPerPage]);

  const popularNews = useMemo(() => {
    return [...mockNewsData]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>(['전체']);
    mockNewsData.forEach((news) => {
      news.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, sortOption, currentPage]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[120px] items-center pb-[75px] pt-[100px] w-full max-w-[1167px] mx-auto">
        {/* 상단 타이틀 + 검색 + 태그 */}
        <div className="flex flex-col gap-[60px] items-center w-full max-w-[1167px]">
          <div className="flex flex-col gap-[30px] items-center w-full max-w-[569px]">
            <div className="flex flex-col items-center">
              <div className="flex gap-[2px] items-center">
                <h1 className="font-cardo font-medium text-[32px] leading-[normal] text-[#1f2937] whitespace-nowrap">
                  UNICORN
                </h1>
                <span className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937]">
                  의
                </span>
              </div>
              <h2 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937] text-center whitespace-nowrap">
                최신 뉴스와 소식을 확인해 보세요!
              </h2>
            </div>
            <div className="w-full max-w-[344px]">
              <NewsSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex flex-wrap gap-[12px_8px] items-center justify-center w-full max-w-[569px] max-h-[94px] overflow-hidden">
              <NewsTagFilter
                tags={allTags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>
          </div>

          {!searchQuery && (
            <div className="flex flex-col gap-[15px] items-start w-full">
              <h3 className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151]">
                최신 인기글
              </h3>
              <div className="flex flex-wrap gap-[30px_10.5px] items-center w-full">
                {isLoading ? (
                  <>
                    <div className="w-[283px]">
                      <NewsCardSkeleton />
                    </div>
                    <div className="w-[283px]">
                      <NewsCardSkeleton />
                    </div>
                    <div className="w-[283px]">
                      <NewsCardSkeleton />
                    </div>
                  </>
                ) : (
                  popularNews.map((news) => (
                    <div key={news.id} className="w-[283px]">
                      <NewsCard news={news} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 전체 리스트 + 정렬 + 페이지네이션 */}
        <div className="flex flex-col items-start w-full max-w-[1167px]">
          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="flex items-center justify-between px-[3px] py-[4.5px] w-full">
              <p className="font-suit font-medium text-[15px] leading-[1.5] text-[#6b7280]">
                총 {filteredNews.length}개의 글
              </p>
              <NewsSortDropdown value={sortOption} onChange={setSortOption} />
            </div>
            {filteredNews.length === 0 && !isLoading ? (
              <div className="flex items-center justify-center w-full py-[100px]">
                <p className="font-suit font-normal text-[24px] leading-[150%] text-[#6b7280] text-center">
                  &apos;{searchQuery}&apos;와 관련된 내용을 찾을 수 없습니다.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-[30px_11px] items-start w-full">
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="w-[283px]">
                      <NewsCardSkeleton />
                    </div>
                  ))
                ) : (
                  paginatedNews.map((news) => (
                    <div key={news.id} className="w-[283px]">
                      <NewsCard news={news} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center w-full max-w-[1167px]">
            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
