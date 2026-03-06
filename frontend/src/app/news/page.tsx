"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsCard } from "@/components/features/news/NewsCard";
import { NewsCardSkeleton } from "@/components/features/news/NewsCardSkeleton";
import { NewsSearchBar } from "@/components/features/news/NewsSearchBar";
import { NewsSortDropdown } from "@/components/features/news/NewsSortDropdown";
import { NewsPagination } from "@/components/features/news/NewsPagination";
import { NewsItem } from "@/data/mockNews";
import { apiFetch } from "@/lib/api";

type SortOption = "latest" | "popular" | "recommended";

interface ApiNewsItem {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NewsListResponse {
  data: {
    items: ApiNewsItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface NewsSimpleResponse {
  data: ApiNewsItem[];
}

function toNewsItem(item: ApiNewsItem): NewsItem {
  const d = new Date(item.createdAt);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return {
    id: String(item.id),
    title: item.title,
    description: item.content,
    date,
    imageUrl: item.imageUrl || "/images/NEWS01.png",
    tags: [],
    views: 0,
    likes: 0,
  };
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);

  const itemsPerPage = 12;

  // 관리자 지정 인기글 조회 (GET /news/featured)
  useEffect(() => {
    const fetchFeatured = async () => {
      setIsFeaturedLoading(true);
      try {
        const res = await apiFetch<NewsSimpleResponse>(
          "/news/featured?limit=3",
        );
        setFeaturedNews(res.data.map(toNewsItem));
      } catch {
        setFeaturedNews([]);
      } finally {
        setIsFeaturedLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // 뉴스 목록 조회
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      if (sortOption === "popular") {
        // 조회수 순 인기글 (GET /news/popular)
        const res = await apiFetch<NewsSimpleResponse>(
          `/news/popular?limit=50`,
        );
        let items = res.data.map(toNewsItem);
        // 클라이언트 검색 (popular 엔드포인트는 keyword 미지원)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.description.toLowerCase().includes(q),
          );
        }
        setNewsList(items);
        setTotalCount(items.length);
        setTotalPages(1);
      } else if (sortOption === "recommended") {
        // 관리자 지정 인기글 (GET /news/featured)
        const res = await apiFetch<NewsSimpleResponse>(
          `/news/featured?limit=50`,
        );
        let items = res.data.map(toNewsItem);
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.description.toLowerCase().includes(q),
          );
        }
        setNewsList(items);
        setTotalCount(items.length);
        setTotalPages(1);
      } else {
        // 최신순 (GET /news) - 서버 페이지네이션 + 검색
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(itemsPerPage));
        if (searchQuery) {
          params.set("keyword", searchQuery);
        }
        const res = await apiFetch<NewsListResponse>(
          `/news?${params.toString()}`,
        );
        setNewsList(res.data.items.map(toNewsItem));
        setTotalCount(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch {
      setNewsList([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [sortOption, currentPage, searchQuery, itemsPerPage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // 정렬 또는 검색 변경 시 페이지 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, searchQuery]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[120px] items-center pb-[75px] pt-[100px] w-full max-w-[1167px] mx-auto">
        {/* 상단 타이틀 + 검색 */}
        <div className="flex flex-col gap-[60px] items-center w-full max-w-[1167px]">
          <div className="flex flex-col gap-[30px] items-center w-full">
            <div className="flex flex-col items-center">
              <div className="flex gap-[2px] items-center">
                <h1 className="font-cardo font-medium text-[26px] leading-[normal] text-[#1f2937] whitespace-nowrap">
                  UNICORN
                </h1>
                <span className="font-suit font-normal text-[26px] leading-[1.5] text-[#1f2937]">
                  의
                </span>
              </div>
              <h2 className="font-suit font-normal text-[26px] leading-[1.5] text-[#1f2937] text-center whitespace-nowrap">
                최신 뉴스와 소식을 확인해 보세요!
              </h2>
            </div>
            <div className="w-full max-w-[344px]">
              <NewsSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          {!searchQuery && sortOption === "latest" && (
            <div className="flex flex-col gap-[15px] items-start w-full">
              <h3 className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151]">
                최신 인기글
              </h3>
              <div className="flex flex-wrap gap-[30px_10.5px] items-center w-full">
                {isFeaturedLoading ? (
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
                ) : featuredNews.length > 0 ? (
                  featuredNews.map((news) => (
                    <div key={news.id} className="w-[283px]">
                      <NewsCard news={news} />
                    </div>
                  ))
                ) : (
                  <p className="font-suit text-[14px] text-[#959ba9] leading-[1.5]">
                    등록된 인기글이 없습니다.
                  </p>
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
                총 {totalCount}개의 글
              </p>
              <NewsSortDropdown value={sortOption} onChange={setSortOption} />
            </div>
            {newsList.length === 0 && !isLoading ? (
              <div className="flex items-center justify-center w-full py-[100px]">
                <p className="font-suit font-normal text-[24px] leading-[150%] text-[#6b7280] text-center">
                  {searchQuery
                    ? `'${searchQuery}'와 관련된 내용을 찾을 수 없습니다.`
                    : "등록된 뉴스가 없습니다."}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-[30px_11px] items-start w-full">
                {isLoading
                  ? Array.from({ length: 12 }).map((_, index) => (
                      <div key={`skeleton-${index}`} className="w-[283px]">
                        <NewsCardSkeleton />
                      </div>
                    ))
                  : newsList.map((news) => (
                      <div key={news.id} className="w-[283px]">
                        <NewsCard news={news} />
                      </div>
                    ))}
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && sortOption === "latest" && (
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
