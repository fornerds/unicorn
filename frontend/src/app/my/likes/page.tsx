"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { ArrowDownIcon, LikeIcon, LikeIconFilled } from "@/components/ui/icons";
import { ROUTES } from "@/utils/constants";
import { apiFetch } from "@/lib/api";
import { getCategoryDisplayName } from "@/utils/categoryMapping";

interface LikedProduct {
  id: number;
  name: string;
  category: { id: number; name: string };
  parentCategory: { id: number; name: string };
  stock: number;
  price: number;
  colors: string[];
}

interface LikesResponse {
  data: {
    items: LikedProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const ITEMS_PER_PAGE = 9;

const categoryOptions = [
  { label: "전체", value: "all" },
  { label: "가정용", value: "HOME" },
  { label: "소방용", value: "FIREFIGHTING" },
  { label: "산업용", value: "INDUSTRIAL" },
  { label: "의료용", value: "MEDICAL" },
  { label: "물류용", value: "LOGISTICS" },
];

export default function MyLikesPage() {
  const [likes, setLikes] = useState<LikedProduct[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<LikesResponse>(
          `/users/me/likes?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        );
        setLikes(res.data.items);
        setTotalLikes(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } catch {
        setLikes([]);
        setTotalLikes(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setShowCategoryMenu(false);
      }
    };

    if (showCategoryMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryMenu]);

  const filteredProducts = likes.filter((product) => {
    if (selectedCategory === "all") return true;
    return (
      product.parentCategory?.name === selectedCategory ||
      product.category?.name === selectedCategory
    );
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLikeToggle = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingIds.has(productId)) return;

    const prevLikes = likes;
    setLikes((prev) => prev.filter((p) => p.id !== productId));
    setTotalLikes((prev) => prev - 1);
    setLoadingIds((prev) => new Set(prev).add(productId));

    try {
      const res = await apiFetch<{
        data: { likesCount: number; liked: boolean };
      }>(`/products/${productId}/like`, { method: "POST" });
      if (res.data.liked) {
        // 다시 liked 상태가 됐으면 목록 복원
        setLikes(prevLikes);
        setTotalLikes((prev) => prev + 1);
      }
    } catch {
      setLikes(prevLikes);
      setTotalLikes((prev) => prev + 1);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryMenu(false);
  };

  const selectedCategoryLabel =
    categoryOptions.find((opt) => opt.value === selectedCategory)?.label ||
    "전체";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[30px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[275px]">
            <div className="flex flex-col font-suit font-thin justify-center text-[60px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap">Mypage</p>
            </div>
            <div className="flex flex-col font-suit font-extralight justify-center text-[30px] w-full">
              <p className="leading-[1.35] whitespace-pre-wrap">마이페이지</p>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-end w-[885px]">
            <div className="flex h-[36px] items-center w-full">
              <div className="flex flex-col font-elice font-extralight justify-center text-[#111827] text-[26px] whitespace-nowrap">
                <p className="leading-[36px]">찜한 상품({totalLikes})</p>
              </div>
            </div>

            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] hover:opacity-80 transition-opacity"
                aria-label="카테고리 선택"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col font-suit font-normal justify-center text-[20px] text-[#374151] whitespace-nowrap">
                    <p className="leading-[1.35]">{selectedCategoryLabel}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px]">
                  <ArrowDownIcon width={16} height={16} fill="#4B5563" />
                </div>
              </button>
              {showCategoryMenu && (
                <div className="absolute top-full right-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-10 min-w-[150px]">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCategoryChange(option.value)}
                      className={`w-full px-[16px] py-[8px] text-left font-suit font-normal text-[16px] leading-[1.5] text-[#374151] hover:bg-[#f9fafb] first:rounded-t-[8px] last:rounded-b-[8px] ${
                        selectedCategory === option.value ? "bg-[#f3f4f6]" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start px-[4px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center w-full py-[60px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                    불러오는 중...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center w-full py-[60px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                    아직 찜한 상품이 없습니다.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-[12px] w-full">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="relative"
                        style={{ width: "284px" }}
                      >
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(product.id)}
                          className="bg-[#f9fafb] border border-[#eeeff1] flex flex-col h-[362px] overflow-hidden pb-[14px] rounded-[9.863px] w-full hover:opacity-95 transition-opacity"
                        >
                          <div className="flex items-center justify-between h-[48px] px-[18px] py-[6px] w-full shrink-0">
                            <p className="font-suit font-normal text-[16px] leading-[1.5] text-[#959ba9]">
                              {getCategoryDisplayName(
                                product.parentCategory?.name ||
                                  product.category?.name ||
                                  "",
                              )}
                            </p>
                            <div className="w-[28px] shrink-0" />
                          </div>
                          <div className="flex-1 flex items-center justify-center bg-[#f3f4f6] w-full">
                            <span className="font-cardo font-medium text-[14px] text-[#1f2937]">
                              UNICORN
                            </span>
                          </div>
                          <div className="flex flex-col gap-[6px] px-[20px] pt-[10px] w-full shrink-0 items-center">
                            <p className="font-suit font-normal text-[20px] leading-[1.5] text-black truncate">
                              {product.name}
                            </p>
                            <p className="font-suit font-normal text-[16px] leading-[1.5] text-[#6b7280]">
                              {formatPrice(product.price)}원
                            </p>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => handleLikeToggle(e, product.id)}
                          disabled={loadingIds.has(product.id)}
                          className="absolute top-[10px] right-[14px] z-10 flex items-center justify-center w-[32px] h-[32px] hover:opacity-70 transition-opacity disabled:opacity-40"
                          aria-label="찜 취소"
                        >
                          {loadingIds.has(product.id) ? (
                            <LikeIcon
                              width={20}
                              height={18}
                              stroke="#1F2937"
                              strokeWidth={0.6875}
                            />
                          ) : (
                            <LikeIconFilled
                              width={20}
                              height={18}
                              fill="#1F2937"
                              stroke="#1F2937"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center justify-center px-[10px] py-[100px] w-full">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
