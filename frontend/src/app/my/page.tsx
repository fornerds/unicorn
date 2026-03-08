"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  LikeIcon,
  LikeIconFilled,
  ArrowRightWhiteIcon,
} from "@/components/ui/icons";
import { getCategoryDisplayName } from "@/utils/categoryMapping";
import { ROUTES } from "@/utils/constants";
import { useAuthStore } from "@/stores/authStore";
import { apiFetch } from "@/lib/api";

interface OrderItem {
  productId: number;
  product: { id: number; name: string; price: number; imageUrl: string };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface LikedProduct {
  id: number;
  name: string;
  category: { id: number; name: string };
  parentCategory: { id: number; name: string };
  stock: number;
  price: number;
  colors: string[];
}

interface OrdersResponse {
  data: {
    items: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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

export default function MyPage() {
  const user = useAuthStore((state) => state.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [likes, setLikes] = useState<LikedProduct[]>([]);
  const [likesTotal, setLikesTotal] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const [likesLoadingIds, setLikesLoadingIds] = useState<Set<number>>(
    new Set(),
  );

  const [basePath, setBasePath] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/unicorn")) {
        return "/unicorn";
      }
    }
    return process.env.NEXT_PUBLIC_BASE_PATH || "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/unicorn")) {
        setBasePath("/unicorn");
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiFetch<OrdersResponse>(
          "/users/me/orders?page=1&limit=3",
        );
        setOrders(res.data.items);
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    const fetchLikes = async () => {
      try {
        const res = await apiFetch<LikesResponse>(
          "/users/me/likes?page=1&limit=6",
        );
        setLikes(res.data.items);
        setLikesTotal(res.data.pagination.total);
      } catch {
        setLikes([]);
      } finally {
        setIsLoadingLikes(false);
      }
    };

    fetchOrders();
    fetchLikes();
  }, []);

  const handleLikeToggle = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (likesLoadingIds.has(productId)) return;

    const prevLikes = likes;
    const prevTotal = likesTotal;
    setLikes((prev) => prev.filter((p) => p.id !== productId));
    setLikesTotal((prev) => prev - 1);
    setLikesLoadingIds((prev) => new Set(prev).add(productId));

    try {
      const res = await apiFetch<{
        data: { likesCount: number; liked: boolean };
      }>(`/products/${productId}/like`, { method: "POST" });
      if (res.data.liked) {
        setLikes(prevLikes);
        setLikesTotal(prevTotal);
      }
    } catch {
      setLikes(prevLikes);
      setLikesTotal(prevTotal);
    } finally {
      setLikesLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const getImagePath = (path: string) => {
    if (basePath && path.startsWith("/")) {
      return `${basePath}${path}`;
    }
    return path;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const getOrderDisplayName = (order: Order) => {
    if (order.items.length === 0) return "-";
    const firstName = order.items[0].product.name;
    if (order.items.length === 1) return firstName;
    return `${firstName} 외 ${order.items.length - 1}건`;
  };

  const getOrderTotalQuantity = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
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

          <div className="flex flex-col gap-[100px] items-start w-[885px]">
            <div className="bg-[#f9fafb] flex items-center justify-between px-[30px] py-[34px] rounded-[20px] w-full">
              <div className="flex flex-1 flex-col gap-[2px] items-start">
                <div className="flex flex-col font-suit font-medium justify-center text-[#2a313f] text-[30px] w-full">
                  <p className="leading-[1.35] whitespace-pre-wrap">
                    {user?.name || "-"}
                  </p>
                </div>
                <div className="flex flex-col font-suit font-normal justify-center text-[#6b7280] text-[18px] w-full">
                  <p className="leading-[20px] whitespace-pre-wrap">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>
              <Link
                href={ROUTES.MY_PROFILE}
                className="h-[45px] w-[40px] flex items-center justify-center"
              >
                <ArrowRightIcon width={20} height={20} stroke="#1f2937" />
              </Link>
            </div>

            <div className="flex flex-col gap-[30px] items-start px-[4px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-elice font-extralight justify-center text-[24px] text-[#1f2937] whitespace-nowrap">
                  <p className="leading-[1.35]">주문 내역</p>
                </div>
                <Link
                  href={ROUTES.MY_ORDERS}
                  className="flex gap-[10px] items-center justify-center py-[10px]"
                >
                  <div className="flex flex-col font-suit font-normal justify-center text-[18px] text-[#6b7280] text-center whitespace-nowrap">
                    <p className="leading-[20px]">더보기</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <ArrowRightIcon width={14} height={14} stroke="#6b7280" />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-[20px] items-start w-full">
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center w-full py-[40px]">
                    <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                      불러오는 중...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-[40px]">
                    <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                      아직 구매한 제품이 없습니다.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Link
                      key={order.id}
                      href={ROUTES.MY_ORDER_DETAIL(order.id)}
                      className="flex flex-col gap-[4px] items-start w-full hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-[10px] items-center text-[14px]">
                          <div className="flex gap-[4px] items-center justify-center leading-[20px] text-[#8e8e93]">
                            <p className="font-suit font-medium">주문번호</p>
                            <p className="font-suit font-normal">{order.id}</p>
                          </div>
                          <div className="flex flex-col font-suit font-medium justify-center text-[#959ba9] whitespace-nowrap">
                            <p className="leading-[1.5]">|</p>
                          </div>
                          <div className="flex flex-col font-suit font-medium justify-center text-[#959ba9] whitespace-nowrap">
                            <p className="leading-[1.5]">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[16px] items-start w-full">
                        <div className="flex gap-[10px] items-center w-full">
                          <div className="bg-[#f9fafb] flex items-center relative rounded-[12px] shrink-0">
                            <div className="relative shrink-0 w-[104px] h-[104px]">
                              {order.items[0]?.product.imageUrl ? (
                                <Image
                                  src={order.items[0].product.imageUrl}
                                  alt={getOrderDisplayName(order)}
                                  fill
                                  className="object-cover rounded-[12px]"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-[#f3f4f6] rounded-[12px]" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col h-[104px] items-start justify-between">
                            <div className="flex flex-col items-start w-full">
                              <div className="flex items-center w-full">
                                <div className="flex flex-1 flex-col font-suit font-normal justify-center overflow-hidden text-[20px] text-[#1f2937] text-ellipsis whitespace-nowrap">
                                  <p className="leading-[1.5] overflow-hidden">
                                    {getOrderDisplayName(order)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-[8px] items-center">
                                <div className="flex flex-col font-suit font-normal justify-center text-[14px] text-[#959ba9] whitespace-nowrap">
                                  <p className="leading-[1.5]">
                                    수량 {getOrderTotalQuantity(order)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-end justify-end w-full">
                              <div className="flex gap-[8px] items-end">
                                <div className="flex flex-col items-center justify-center py-[4px]">
                                  <div className="capitalize flex flex-col font-suit font-normal justify-center text-[14px] text-[#1f2937] whitespace-nowrap">
                                    <p className="leading-[1.5]">Total</p>
                                  </div>
                                </div>
                                <div className="flex gap-[3px] items-end justify-center">
                                  <div className="flex flex-col font-suit font-semibold justify-center text-[22px] text-[#1f2937] whitespace-nowrap">
                                    <p className="leading-[1.5]">
                                      {formatPrice(order.totalAmount)}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center py-[3px] w-[14px]">
                                    <div className="flex flex-col font-suit font-medium justify-center text-[18px] text-[#1f2937] w-full">
                                      <p className="leading-[1.5] whitespace-pre-wrap">
                                        원
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-0 w-full border-t border-[#E5E7EB]" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[30px] items-center px-[4px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-elice font-extralight justify-center text-[24px] text-[#1f2937] whitespace-nowrap">
                  <p className="leading-[1.35]">찜한제품({likesTotal})</p>
                </div>
                <Link
                  href={ROUTES.MY_LIKES}
                  className="flex gap-[10px] items-center justify-center py-[10px]"
                >
                  <div className="flex flex-col font-suit font-normal justify-center text-[18px] text-[#6b7280] text-center whitespace-nowrap">
                    <p className="leading-[20px]">더보기</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <ArrowRightIcon width={14} height={14} stroke="#6b7280" />
                  </div>
                </Link>
              </div>
              {isLoadingLikes ? (
                <div className="flex items-center justify-center w-full py-[40px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                    불러오는 중...
                  </p>
                </div>
              ) : likes.length === 0 ? (
                <div className="flex items-center justify-center w-full py-[40px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                    아직 찜한 상품이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-[12px] w-full">
                  {likes.map((product) => (
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
                        disabled={likesLoadingIds.has(product.id)}
                        className="absolute top-[10px] right-[14px] z-10 flex items-center justify-center w-[32px] h-[32px] hover:opacity-70 transition-opacity disabled:opacity-40"
                        aria-label="찜 취소"
                      >
                        {likesLoadingIds.has(product.id) ? (
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
              )}
            </div>

            <div className="bg-[#f6faff] h-[177px] overflow-clip relative rounded-[20px] w-full">
              <div className="absolute h-[177px] left-0 top-0 w-full">
                <Image
                  src={getImagePath("/images/mypageBanner.png")}
                  alt="Life Changing Robots"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute flex items-end justify-between left-[43px] top-[50px] w-[800px]">
                <div className="flex flex-col gap-[10px] items-start text-white w-[395px]">
                  <div className="flex flex-col font-suit font-extralight justify-center text-[36px] w-full">
                    <p className="leading-[normal] whitespace-pre-wrap">
                      Life Changing Robots
                    </p>
                  </div>
                  <div className="flex flex-col font-suit font-thin justify-center text-[18px] tracking-[-0.54px] w-full">
                    <p className="leading-[normal] whitespace-pre-wrap">
                      사람과 로봇이 조화로운 일상, 그 새로운 시작을 함께합니다
                    </p>
                  </div>
                </div>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="flex items-center justify-between py-[18px] w-[112px]"
                >
                  <div className="flex flex-col font-suit font-extralight justify-center text-[14px] text-center text-white whitespace-nowrap">
                    <p className="leading-[24px]">제품 둘러보기</p>
                  </div>
                  <div className="relative shrink-0 w-[28px] h-[28px]">
                    <ArrowRightWhiteIcon width={28} height={28} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
