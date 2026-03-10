"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NewsCard } from "@/components/features/news/NewsCard";
import { NewsCardSkeleton } from "@/components/features/news/NewsCardSkeleton";
import { NewsItem } from "@/data/mockNews";
import { ROUTES } from "@/utils/constants";
import { withBasePath } from "@/utils/assets";
import { apiFetch } from "@/lib/api";

interface ApiTag {
  id: number;
  name: string;
}

interface ApiRelatedArticle {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NewsDetailResponse {
  data: {
    id: number;
    imageUrl: string;
    title: string;
    content: string;
    viewCount: number;
    publishedAt: string;
    createdAt: string;
    tags: ApiTag[];
    relatedArticles: ApiRelatedArticle[];
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toNewsItem(item: ApiRelatedArticle): NewsItem {
  return {
    id: String(item.id),
    title: item.title,
    description: item.content,
    date: formatDate(item.createdAt),
    imageUrl: item.imageUrl || "/images/NEWS01.png",
    tags: [],
    views: 0,
    likes: 0,
  };
}

export default function NewsDetailClient() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsDetailResponse["data"] | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNewsDetail = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<NewsDetailResponse>(`/news/${newsId}`, {
          signal: controller.signal,
        });
        setNews(res.data);
        setRelatedNews(
          (res.data.relatedArticles || []).slice(0, 4).map(toNewsItem),
        );
      } catch (err) {
        if (controller.signal.aborted) return;
        router.replace(ROUTES.NEWS);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchNewsDetail();
    return () => controller.abort();
  }, [newsId, router]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex flex-col gap-[188px] items-center pb-[75px] pt-[8px] w-full max-w-[1167px] mx-auto">
          <div className="flex flex-col gap-[45px] items-start w-full max-w-[1167px]">
            <div className="flex flex-col gap-[15px] items-start w-full">
              <div className="h-[29px] w-[140px] bg-[#f3f4f6] rounded animate-pulse" />
              <div className="h-[599.25px] w-full bg-[#f3f4f6] rounded-[9px] animate-pulse" />
            </div>
            <div className="flex items-start justify-between px-[3px] w-full">
              <div className="flex flex-col gap-[15px] items-start shrink-0">
                <div className="h-[36px] w-[300px] bg-[#f3f4f6] rounded animate-pulse" />
                <div className="h-[22px] w-[200px] bg-[#f3f4f6] rounded animate-pulse" />
              </div>
              <div className="flex flex-col gap-[16px] w-[772.5px]">
                <div className="h-[20px] w-full bg-[#f3f4f6] rounded animate-pulse" />
                <div className="h-[20px] w-full bg-[#f3f4f6] rounded animate-pulse" />
                <div className="h-[20px] w-[60%] bg-[#f3f4f6] rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[15px] items-start w-full">
            <div className="h-[27px] w-[100px] bg-[#f3f4f6] rounded animate-pulse" />
            <div className="flex flex-wrap gap-[11px] items-start w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[283px]">
                  <NewsCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[188px] items-center pb-[75px] pt-[8px] w-full max-w-[1167px] mx-auto">
        <div className="flex flex-col gap-[45px] items-start w-full max-w-[1167px]">
          <div className="flex flex-col gap-[15px] items-start w-full">
            <div className="flex items-center w-full">
              <Link
                href={ROUTES.NEWS}
                className="flex gap-[1.5px] items-center hover:opacity-80 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                >
                  <path
                    d="M22.9585 14.4997L6.04183 14.4997M6.04183 14.4997L12.2345 20.8438M6.04183 14.4997L12.2345 8.15625"
                    stroke="#374151"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-suit font-medium ml-[6px] text-[20px] leading-[1.45] text-[#1f2937] whitespace-nowrap">
                  뉴스 목록으로
                </p>
              </Link>
            </div>
            <div className="h-[599.25px] relative rounded-[9px] w-full overflow-hidden">
              <Image
                src={
                  news.imageUrl?.startsWith("http")
                    ? news.imageUrl
                    : withBasePath(news.imageUrl || "/images/NEWS01.png")
                }
                alt={news.title}
                fill
                className="object-cover rounded-[9px]"
                unoptimized
              />
            </div>
          </div>

          <div className="flex items-start justify-between px-[3px] w-full">
            <div className="flex flex-col gap-[15px] items-start shrink-0">
              <div className="flex flex-col font-suit font-semibold leading-[1.5] text-[24px] text-[#1f2937]">
                {news.title.split("\n").map((line, index) => (
                  <p key={index} className="mb-0">
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex font-suit font-medium gap-[19.5px] items-center leading-[1.5] text-[15px] text-[#6b7280] w-full">
                <p className="leading-[1.5] whitespace-nowrap">
                  {formatDate(news.publishedAt || news.createdAt)}
                </p>
                <p className="leading-[1.5] whitespace-nowrap">
                  조회수 {news.viewCount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[58.5px] items-start text-[18px] w-[772.5px]">
              <div className="font-suit font-normal leading-[1.7] min-w-full text-[#374151] whitespace-pre-wrap">
                {news.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph || "\u00A0"}</p>
                ))}
              </div>
              {news.tags && news.tags.length > 0 && (
                <div className="flex flex-col font-suit font-medium leading-[1.5] text-[18px] text-[#b5b8c0]">
                  <p className="leading-[1.5] break-words">
                    {news.tags.map((tag) => `#${tag.name}`).join("  ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedNews.length > 0 && (
          <div className="flex flex-col gap-[15px] items-start w-full">
            <div className="flex items-end justify-between px-[1.5px] w-full">
              <div className="flex items-center justify-center px-[3px]">
                <h3 className="font-suit font-semibold leading-[1.5] text-[18px] text-[#374151] whitespace-nowrap">
                  관련 아티클
                </h3>
              </div>
              <Link
                href={ROUTES.NEWS}
                className="flex flex-col font-suit font-medium leading-[1.5] text-[12px] text-[#959ba9] whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                <p className="leading-[1.5]">더보기</p>
              </Link>
            </div>
            <div className="flex flex-wrap gap-[11px] items-start w-full max-w-[1167px]">
              {relatedNews.map((item) => (
                <div key={item.id} className="w-[283px]">
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
