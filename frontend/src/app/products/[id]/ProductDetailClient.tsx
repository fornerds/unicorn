"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LikeIcon, LikeIconFilled } from "@/components/ui/icons";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import {
  WeightIcon,
  HeightIcon,
  TimeIcon,
  BatteryIcon,
  SpeedIcon,
} from "@/components/ui/icons";
import { withBasePath } from "@/utils/assets";
import { apiFetch } from "@/lib/api";
import { getCategoryDisplayName } from "@/utils/categoryMapping";
import { ROUTES } from "@/utils/constants";
import { useAuthStore } from "@/stores/authStore";
import { LoginModal } from "@/components/ui/LoginModal";

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductDetailSpec {
  weight?: string;
  totalHeight?: string;
  operatingTime?: string;
  battery?: string;
  speed?: string;
}

interface ColorStock {
  color: string;
  colorCode?: string;
  stock: number;
}

interface ApiProduct {
  id: number;
  name: string;
  imageUrl?: string;
  images?: string[];
  parentCategory: ApiCategory;
  category: ApiCategory;
  isLiked: boolean;
  colors?: string[];
  colorStocks?: ColorStock[];
  price: number;
  detail?: ProductDetailSpec;
  shortDescription?: string;
  content?: string;
}

interface ProductDetailResponse {
  data: ApiProduct;
}

export const ProductDetailClient = ({ id }: { id: string }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [cartMessage, setCartMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<ProductDetailResponse>(`/products/${id}`);
        setProduct(res.data);
        setIsLiked(res.data.isLiked);
        if (res.data.colorStocks && res.data.colorStocks.length > 0) {
          setSelectedColor(res.data.colorStocks[0].color);
        } else if (res.data.colors && res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0]);
        }
      } catch {
        // error handled by null product state
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowColorDropdown(false);
      }
    };

    if (showColorDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorDropdown]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (isLikeLoading) return;
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setIsLikeLoading(true);
    try {
      const res = await apiFetch<{ data: { likesCount: number; liked: boolean } }>(
        `/products/${id}/like`,
        { method: "POST" },
      );
      setIsLiked(res.data.liked);
    } catch {
      setIsLiked(prevLiked);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleQuantityInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      setQuantity(0);
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue) && numValue >= 1) {
        setQuantity(numValue);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (isCartLoading || !product) return;
    setIsCartLoading(true);
    setCartMessage(null);
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          color: selectedColor || "",
          quantity,
        }),
      });
      setCartMessage({ type: "success", text: "장바구니에 추가되었습니다." });
    } catch {
      setCartMessage({ type: "error", text: "장바구니 추가에 실패했습니다." });
    } finally {
      setIsCartLoading(false);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (isBuyLoading || !product) return;
    setIsBuyLoading(true);
    try {
      const res = await apiFetch<{
        data: {
          id: number;
          productId: number;
          color: string;
          product: { id: number; name: string; price: number; imageUrl: string };
          quantity: number;
          price: number;
        };
      }>("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          color: selectedColor || "",
          quantity,
        }),
      });

      const cartItem = res.data;
      const unitPrice = product.price;
      const shippingFee = 100000;
      const checkoutData = {
        cartItemIds: [cartItem.id],
        items: [
          {
            id: String(cartItem.id),
            productId: String(product.id),
            name: product.name,
            price: unitPrice,
            quantity,
            color: selectedColor || "",
            imageUrl: product.imageUrl || "",
          },
        ],
        totalProductPrice: unitPrice * quantity,
        shippingFee,
        discount: 0,
        totalPrice: unitPrice * quantity + shippingFee,
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      router.push(ROUTES.CHECKOUT);
    } catch {
      setCartMessage({ type: "error", text: "구매 처리 중 오류가 발생했습니다." });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setIsBuyLoading(false);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || quantity === 0) {
      setQuantity(1);
    }
  };

  const handleQuantityFocus = () => {
    setQuantity(0);
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex flex-col gap-[84px] items-start pb-[150px] pt-[8px] px-[20px] md:px-[32px] lg:px-[45px] w-full max-w-[1440px] mx-auto animate-pulse">
          <div className="flex flex-col lg:flex-row flex-wrap gap-[22.5px] items-start w-full max-w-[1350px]">
            <div className="aspect-[3665/2062] bg-[#f3f4f6] rounded-[9px] w-full lg:w-[892.5px]" />
            <div className="flex flex-col gap-[30px] items-start w-full lg:w-[435px]">
              <div className="h-[20px] bg-[#f3f4f6] rounded w-[200px]" />
              <div className="h-[36px] bg-[#f3f4f6] rounded w-full" />
              <div className="h-[52px] bg-[#f3f4f6] rounded w-full" />
              <div className="h-[30px] bg-[#f3f4f6] rounded w-[150px] self-end mt-[160px]" />
              <div className="flex gap-[12px] w-full">
                <div className="h-[48px] bg-[#f3f4f6] rounded w-[120px] shrink-0" />
                <div className="h-[48px] bg-[#f3f4f6] rounded flex-1" />
                <div className="h-[48px] bg-[#f3f4f6] rounded flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="font-suit font-normal text-[18px] text-[#959ba9]">
          제품을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const colorOptions: ColorStock[] =
    product.colorStocks && product.colorStocks.length > 0
      ? product.colorStocks
      : product.colors?.map((c): ColorStock => ({ color: c, stock: 0 })) ?? [];

  const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);

  const getImageSrc = (url: string) =>
    url.startsWith("http") ? url : withBasePath(url);

  const currentImage = images[selectedImageIndex];

  return (
    <>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      message={'회원만 이용 가능한 서비스입니다.\n로그인하시겠습니까?'}
    />
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[84px] items-start pb-[150px] pt-[8px] px-[20px] md:px-[32px] lg:px-[45px] w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row flex-wrap gap-[22.5px] items-start w-full max-w-[1350px]">
          <div className="flex flex-col gap-[6px] items-start w-full lg:w-[892.5px]">
            <div className="aspect-[3665/2062] relative rounded-[9px] w-full overflow-hidden">
              {currentImage ? (
                <Image
                  src={getImageSrc(currentImage)}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover rounded-[9px]"
                />
              ) : (
                <div className="w-full h-full bg-[#f3f4f6] rounded-[9px] flex items-center justify-center">
                  <h1 className="font-cardo font-medium text-[40px] leading-[normal] text-[#1f2937] whitespace-nowrap">
                    UNICORN
                  </h1>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-8 gap-[6px] w-full">
                {images.slice(0, 8).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative rounded-[6px] overflow-hidden aspect-[4/3] w-full ${
                      index === selectedImageIndex
                        ? "border-[1.5px] border-[#1f2937]"
                        : "border border-[#eaeaea]"
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[46.5px] lg:gap-[245.25px] items-start w-full lg:w-[435px]">
            <div className="flex flex-col gap-[30px] lg:gap-[46.5px] items-start w-full">
              <div className="flex flex-col gap-[15px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-1 gap-[2px] items-center min-w-0">
                    <p className="font-suit font-extralight text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {getCategoryDisplayName(product.parentCategory?.name || "")}
                    </p>
                    <div className="w-[12px] h-[12px] relative shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 3L8 6L4 9"
                          stroke="#959ba9"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-suit font-extralight text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {product.category?.name || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <h1 className="flex flex-1 flex-col font-suit font-light justify-center max-h-[108px] min-w-0 overflow-hidden text-[24px] text-[#1f2937] text-ellipsis">
                    <span className="leading-[1.5] whitespace-pre-wrap">
                      {product.name}
                    </span>
                  </h1>
                  <button
                    onClick={handleLikeClick}
                    disabled={isLikeLoading}
                    className="flex items-center justify-center rounded-[10.667px] w-[24px] h-[24px] hover:opacity-80 transition-opacity disabled:opacity-50"
                    aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                  >
                    {isLiked ? (
                      <LikeIconFilled
                        width={21}
                        height={18}
                        fill="#1F2937"
                        stroke="#1F2937"
                      />
                    ) : (
                      <LikeIcon
                        width={21}
                        height={18}
                        stroke="#1F2937"
                        strokeWidth={0.6875}
                      />
                    )}
                  </button>
                </div>
              </div>
              {colorOptions.length > 0 && (
                <div className="flex flex-col gap-[10px] items-start w-full">
                  <div className="flex items-center py-[6px] w-full">
                    <p className="font-suit font-light text-[15px] leading-[1.5] text-[#6b7280] whitespace-nowrap">
                      COLOR({colorOptions.length})
                    </p>
                  </div>
                  <div className="relative w-full" ref={colorDropdownRef}>
                    <button
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                      className="bg-[#f9fafb] border border-[#e5e7eb] flex items-center px-[15px] py-[10.5px] rounded-[10px] w-full hover:opacity-80 transition-opacity"
                    >
                      <div className="flex gap-[12px] items-center min-w-0 flex-1">
                        <div
                          className="rounded-full shrink-0 w-[24.75px] h-[24.75px] border border-[#d1d5db]"
                          style={{ backgroundColor: colorOptions.find((c) => c.color === selectedColor)?.colorCode || selectedColor }}
                        />
                        <p className="flex-1 font-suit font-light text-[15px] leading-[1.35] text-[#374151] text-left text-ellipsis overflow-hidden whitespace-pre-wrap max-h-[40.5px]">
                          {selectedColor}
                        </p>
                      </div>
                      <div
                        className={`ml-[12px] flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px] shrink-0 transition-transform ${
                          showColorDropdown ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M0.4375 0.4375L4.9375 5.4375L9.4375 0.4375"
                            stroke="#4B5563"
                            strokeWidth="0.875"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    {showColorDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[10px] shadow-lg z-10">
                        {colorOptions.map((colorOpt) => (
                          <button
                            key={colorOpt.color}
                            onClick={() => {
                              setSelectedColor(colorOpt.color);
                              setShowColorDropdown(false);
                            }}
                            className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] last:border-b-0 flex items-center justify-between px-[15px] py-[10.5px] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                          >
                            <div className="flex gap-[12px] items-center min-w-0 flex-1">
                              <div
                                className="rounded-full shrink-0 w-[24.75px] h-[24.75px] border border-[#d1d5db]"
                                style={{ backgroundColor: colorOpt.colorCode || colorOpt.color }}
                              />
                              <p className="flex-1 font-suit font-light text-[15px] leading-[1.35] text-[#374151] text-ellipsis overflow-hidden whitespace-pre-wrap">
                                {colorOpt.color}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[40px] items-end w-full">
              <div className="flex gap-[4.5px] h-[30px] items-center justify-end w-full text-[#111827]">
                <p className="flex flex-1 flex-col font-suit font-semibold justify-center min-w-0 text-[28.5px] text-right">
                  <span className="leading-[30px] whitespace-pre-wrap">
                    {formattedPrice}
                  </span>
                </p>
                <p className="flex flex-col font-suit font-light justify-center shrink-0 text-[24px] whitespace-nowrap">
                  <span className="leading-[30px]">₩</span>
                </p>
              </div>
              <div className="flex flex-col gap-[21px] items-end w-full">
                <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center w-full">
                  <div className="border border-[#e5e7eb] flex h-[48px] items-center justify-between rounded-[8px] overflow-hidden w-[120px] shrink-0 self-center sm:self-auto">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex items-center justify-center w-[34px] h-full bg-[#f9fafb] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <MinusIcon
                        width={12}
                        height={1}
                        stroke="#6b7280"
                        strokeWidth={1.3}
                      />
                    </button>
                    <div className="flex-1 h-full bg-white border-x border-[#e5e7eb] flex items-center justify-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={quantity === 0 ? "" : quantity}
                        onChange={(e) => handleQuantityInput(e.target.value)}
                        onFocus={handleQuantityFocus}
                        onBlur={handleQuantityBlur}
                        className="font-suit font-medium text-[18px] leading-[1.35] text-[#6b7280] text-center bg-transparent border-none outline-none w-full"
                      />
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex items-center justify-center w-[34px] h-full bg-[#f9fafb] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <PlusIcon
                        width={15}
                        height={15}
                        stroke="#6b7280"
                        strokeWidth={1.3}
                      />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isCartLoading}
                    className="flex flex-1 h-[48.75px] items-center justify-center px-[24px] sm:px-[24px] py-[9px] bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[7.5px] hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    <p className="font-suit font-light text-[15px] leading-[1.3] text-[#6c6c6c] text-center whitespace-nowrap">
                      {isCartLoading ? "추가 중..." : "장바구니"}
                    </p>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isBuyLoading}
                    className="flex flex-1 h-[48.75px] items-center justify-center px-[24px] sm:px-[24px] py-[9px] bg-black rounded-[7.5px] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <p className="font-suit font-medium text-[15px] leading-[1.3] text-white text-center whitespace-nowrap">
                      {isBuyLoading ? "처리 중..." : "구매하기"}
                    </p>
                  </button>
                </div>
                {cartMessage && (
                  <p className={`font-suit font-light text-[13px] text-right w-full ${cartMessage.type === "success" ? "text-[#059669]" : "text-[#dc2626]"}`}>
                    {cartMessage.text}
                  </p>
                )}
                <div className="flex flex-col md:flex-row font-suit font-extralight items-start md:items-end justify-between px-[3px] w-full text-[13.5px] text-[#959ba9] gap-[10px] md:gap-0">
                  <div className="flex flex-col gap-[3.75px] items-start w-full md:w-[223.5px]">
                    <p className="leading-[normal] whitespace-pre-wrap">
                      부가세가 포함된 가격입니다.
                    </p>
                    <p className="leading-[normal] whitespace-pre-wrap">
                      추후 배송 관련 안내사항 들어갈 부분
                    </p>
                  </div>
                  <button className="font-suit font-extralight text-[15px] text-[#374151] underline hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.detail && (
          <div className="flex flex-col lg:flex-row items-start justify-between px-[2px] w-full gap-[20px] lg:gap-0">
            <h2 className="flex flex-col font-suit font-light justify-center text-[24px] text-[#1f2937] w-full lg:w-[73.5px] shrink-0">
              <span className="leading-[normal] whitespace-pre-wrap">
                Details
              </span>
            </h2>
            <div className="flex flex-wrap gap-[20px] md:gap-[40px] lg:gap-[40.5px] items-center px-[9px] py-[7.5px] w-full lg:w-[1041px]">
              <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
                <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                  <WeightIcon
                    width={42}
                    height={42}
                    stroke="#959BA9"
                    strokeWidth={2}
                    fill="#959BA9"
                  />
                </div>
                <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                  <p className="font-suit font-normal text-[15px] leading-[1.2] text-[#959ba9] w-full">
                    무게
                  </p>
                  <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] w-full">
                    {product.detail.weight || "-"}
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
                </div>
              </div>
              <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
                <div className="overflow-clip shrink-0 w-[42px] h-[42px] flex items-center justify-center">
                  <HeightIcon
                    width={18}
                    height={36}
                    stroke="#959BA9"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                  <p className="font-suit font-normal text-[15px] leading-[1.2] text-[#959ba9] w-full">
                    높이
                  </p>
                  <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] w-full">
                    {product.detail.totalHeight || "-"}
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
                </div>
              </div>
              <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
                <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                  <TimeIcon
                    width={42}
                    height={42}
                    stroke="#959BA9"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                  <p className="font-suit font-normal text-[15px] leading-[1.2] text-[#959ba9] w-full">
                    작동 시간
                  </p>
                  <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] w-full">
                    {product.detail.operatingTime || "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
                <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                  <BatteryIcon
                    width={42}
                    height={42}
                    stroke="#959BA9"
                    strokeWidth={2}
                    fill="#959BA9"
                  />
                </div>
                <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                  <p className="font-suit font-normal text-[15px] leading-[1.2] text-[#959ba9] w-full">
                    배터리
                  </p>
                  <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] w-full">
                    {product.detail.battery || "-"}
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
                </div>
              </div>
              <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
                <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                  <SpeedIcon
                    width={42}
                    height={42}
                    stroke="#959BA9"
                    strokeWidth={2}
                    fill="#959BA9"
                  />
                </div>
                <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                  <p className="font-suit font-normal text-[15px] leading-[1.2] text-[#959ba9] w-full">
                    속도
                  </p>
                  <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] w-full">
                    {product.detail.speed || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(product.content || product.shortDescription) && (
          <div className="flex flex-col lg:flex-row items-start justify-between px-[6px] w-full text-[#1f2937] gap-[20px] lg:gap-0">
            <h2 className="flex flex-col font-suit font-light justify-center text-[24px] whitespace-nowrap shrink-0">
              <span className="leading-[normal]">About</span>
            </h2>
            {product.content ? (
              <div
                className="rich-content font-suit font-thin text-[#374151] w-full lg:w-[1036.5px]"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />
            ) : (
              <p className="font-suit font-thin leading-[1.5] text-[16.5px] tracking-[-0.495px] w-full lg:w-[1036.5px] whitespace-pre-wrap">
                {product.shortDescription}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
