"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckIcon,
  DeleteIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/utils/constants";
import { withBasePath } from "@/utils/assets";
import { apiFetch } from "@/lib/api";

interface ApiCartItem {
  id: number;
  productId: number;
  color: string;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface CartApiResponse {
  data: {
    items: ApiCartItem[];
    totalAmount: number;
  };
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  imageUrl: string;
  color: string;
  quantity: number;
  isChecked: boolean;
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ checked, onChange, className }: CheckboxProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative size-[22px] rounded-[4px] border transition-colors",
        checked
          ? "bg-[#1f2937] border-[#1f2937]"
          : "bg-[#f9fafb] border-[#e5e7eb]",
        className,
      )}
    >
      {checked && (
        <div className="absolute inset-[6.67%] flex items-center justify-center">
          <CheckIcon width={20} height={20} stroke="white" strokeWidth={1.5} />
        </div>
      )}
    </button>
  );
};

function toCartItem(api: ApiCartItem): CartItem {
  return {
    id: String(api.id),
    productId: String(api.productId),
    name: api.product.name,
    unitPrice: api.product.price,
    imageUrl: api.product.imageUrl,
    color: api.color,
    quantity: api.quantity,
    isChecked: true,
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const quantityTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch<CartApiResponse>("/cart");
      setCartItems(res.data.items.map(toCartItem));
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const allChecked = useMemo(
    () => cartItems.length > 0 && cartItems.every((item) => item.isChecked),
    [cartItems],
  );
  const checkedItems = useMemo(
    () => cartItems.filter((item) => item.isChecked),
    [cartItems],
  );

  const handleSelectAll = (checked: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, isChecked: checked })));
  };

  const handleItemCheck = (id: string, checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: checked } : item)),
    );
  };

  const updateQuantityApi = useCallback(async (id: string, quantity: number) => {
    setUpdatingIds((prev) => new Set(prev).add(id));
    try {
      await apiFetch(`/cart/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
    } catch {
      // 실패 시 서버 데이터로 복원
      await fetchCart();
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [fetchCart]);

  const handleQuantityChange = (id: string, delta: number) => {
    let nextQty = 1;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      }),
    );
    clearTimeout(quantityTimers.current[id]);
    quantityTimers.current[id] = setTimeout(() => {
      updateQuantityApi(id, nextQty);
    }, 400);
  };

  const handleQuantityInput = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (numericValue === "") return { ...item, quantity: 0 };
        const num = parseInt(numericValue, 10);
        return !isNaN(num) && num >= 1 ? { ...item, quantity: num } : item;
      }),
    );
  };

  const handleQuantityBlur = (id: string) => {
    let finalQty = 1;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          finalQty = item.quantity < 1 || item.quantity === 0 ? 1 : item.quantity;
          return { ...item, quantity: finalQty };
        }
        return item;
      }),
    );
    clearTimeout(quantityTimers.current[id]);
    updateQuantityApi(id, finalQty);
  };

  const handleQuantityFocus = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: 0 } : item)),
    );
  };

  const handleDeleteItem = async (id: string) => {
    const prev = cartItems;
    setCartItems((items) => items.filter((item) => item.id !== id));
    try {
      await apiFetch(`/cart/items/${id}`, { method: "DELETE" });
    } catch {
      setCartItems(prev);
    }
  };

  const handleDeleteAll = async () => {
    const targets = cartItems.filter((item) => item.isChecked);
    if (targets.length === 0) return;
    const prev = cartItems;
    setCartItems((items) => items.filter((item) => !item.isChecked));
    try {
      await Promise.all(
        targets.map((item) =>
          apiFetch(`/cart/items/${item.id}`, { method: "DELETE" }),
        ),
      );
    } catch {
      setCartItems(prev);
    }
  };

  const totalProductPrice = useMemo(
    () => checkedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [checkedItems],
  );

  const shippingFee = checkedItems.length > 0 ? 100000 : 0;
  const discount = 0;
  const totalPrice = totalProductPrice + shippingFee - discount;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex flex-col gap-[52px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
          <div className="flex flex-col gap-[10px]">
            <div className="h-[48px] w-[300px] bg-[#f3f4f6] rounded animate-pulse" />
            <div className="h-[24px] w-[200px] bg-[#f3f4f6] rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-[20px] w-full lg:w-[886px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-[20px] items-center w-full animate-pulse">
                <div className="size-[22px] bg-[#f3f4f6] rounded" />
                <div className="w-[140px] h-[140px] bg-[#f3f4f6] rounded-[12px] shrink-0" />
                <div className="flex flex-col gap-[12px] flex-1">
                  <div className="h-[20px] bg-[#f3f4f6] rounded w-[80%]" />
                  <div className="h-[20px] bg-[#f3f4f6] rounded w-[60%]" />
                  <div className="h-[36px] bg-[#f3f4f6] rounded w-[120px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[52px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[151px] items-start w-full">
          <div className="flex flex-col gap-[52px] items-start w-full lg:w-[886px]">
            <div className="flex flex-col gap-[10px] items-start w-full">
              <h1 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937]">
                Shopping Cart ({cartItems.length})
              </h1>
              <p className="font-suit font-light text-[16px] leading-[1.5] text-[#959ba9]">
                선택하신 로봇들을 확인하고 주문하세요.
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-[80px] gap-[16px]">
                <p className="font-suit font-normal text-[20px] text-[#959ba9]">
                  장바구니가 비어있습니다.
                </p>
                <button
                  onClick={() => router.push(ROUTES.PRODUCTS)}
                  className="font-suit font-medium text-[16px] text-[#1f2937] underline hover:opacity-80 transition-opacity"
                >
                  쇼핑 계속하기
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-[38px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[20px] items-center py-[4px]">
                    <div className="flex items-center p-[10px] shrink-0">
                      <Checkbox checked={allChecked} onChange={handleSelectAll} />
                    </div>
                    <p className="font-suit font-normal text-[14px] leading-[1.35] text-[#374151]">
                      전체 선택
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAll}
                    className="font-suit font-normal text-[18px] leading-[1.35] text-[#959ba9] underline hover:opacity-80 transition-opacity"
                  >
                    모두 삭제
                  </button>
                </div>

                <div className="flex flex-col gap-[20px] items-start w-full">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="w-full">
                      <div className="flex items-center justify-between w-full gap-[20px]">
                        <div className="flex items-center p-[10px] shrink-0">
                          <Checkbox
                            checked={item.isChecked}
                            onChange={(checked) => handleItemCheck(item.id, checked)}
                          />
                        </div>
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(item.productId)}
                          className="bg-[#f9fafb] flex items-center rounded-[12px] shrink-0 w-[140px] h-[140px] hover:opacity-80 transition-opacity"
                        >
                          <div className="relative w-full h-full">
                            {item.imageUrl ? (
                              <Image
                                src={
                                  item.imageUrl.startsWith("http")
                                    ? item.imageUrl
                                    : withBasePath(item.imageUrl)
                                }
                                alt={item.name}
                                fill
                                unoptimized
                                className="object-cover rounded-[12px]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center rounded-[12px]">
                                <span className="font-cardo font-medium text-[14px] text-[#1f2937]">
                                  UNICORN
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col gap-[37px] items-start w-full max-w-[660px]">
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-[8px] items-center">
                                <div
                                  className="rounded-full w-[14px] h-[14px] border border-[#d1d5db] shrink-0"
                                  style={{ backgroundColor: item.color }}
                                />
                                <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                  {item.color}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="flex items-center justify-center p-[2.333px] rounded-[9.333px] w-[28px] h-[28px] hover:opacity-80 transition-opacity shrink-0"
                              >
                                <DeleteIcon
                                  width={18.667}
                                  height={21}
                                  stroke="#374151"
                                  strokeWidth={1}
                                />
                              </button>
                            </div>
                            <div className="flex items-center w-full">
                              <Link
                                href={ROUTES.PRODUCT_DETAIL(item.productId)}
                                className="flex-1 min-w-0 hover:opacity-70 transition-opacity"
                              >
                                <h3 className="font-suit font-normal text-[20px] leading-[1.5] text-[#1f2937] truncate">
                                  {item.name}
                                </h3>
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-end justify-between w-full">
                            <div className="flex flex-1 gap-[10px] items-center min-w-0">
                              <div className="border border-[#e5e7eb] flex h-[36px] items-center justify-between rounded-[8px] overflow-hidden w-[100px] shrink-0">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={updatingIds.has(item.id)}
                                  className="flex items-center justify-center w-[28px] h-full bg-[#f9fafb] shrink-0 hover:opacity-80 transition-opacity disabled:opacity-40"
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
                                    value={item.quantity === 0 ? "" : item.quantity}
                                    onChange={(e) =>
                                      handleQuantityInput(item.id, e.target.value)
                                    }
                                    onFocus={() => handleQuantityFocus(item.id)}
                                    onBlur={() => handleQuantityBlur(item.id)}
                                    disabled={updatingIds.has(item.id)}
                                    className="font-suit font-medium text-[16px] leading-[1.35] text-[#6b7280] text-center bg-transparent border-none outline-none w-full disabled:opacity-40"
                                  />
                                </div>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  disabled={updatingIds.has(item.id)}
                                  className="flex items-center justify-center w-[28px] h-full bg-[#f9fafb] shrink-0 hover:opacity-80 transition-opacity disabled:opacity-40"
                                >
                                  <PlusIcon
                                    width={15}
                                    height={15}
                                    stroke="#6b7280"
                                    strokeWidth={1.3}
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center shrink-0">
                              <p className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                                {new Intl.NumberFormat("ko-KR").format(
                                  item.unitPrice * item.quantity,
                                )}
                                원
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && (
                        <div className="h-[1px] w-full bg-[#e5e7eb] mt-[20px]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[26px] items-start rounded-[16px] shrink-0 w-full lg:w-[457px]">
            <h2 className="font-suit font-medium text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
              Order Summery
            </h2>
            <div className="h-[1px] w-full bg-[#e5e7eb]" />
            <div className="flex flex-col gap-[16px] items-end w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                  총 상품 가격
                </p>
                <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat("ko-KR").format(totalProductPrice)}원
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                  배송비
                </p>
                <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat("ko-KR").format(shippingFee)}원
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                  총 할인율
                </p>
                <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat("ko-KR").format(discount)}원
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#e5e7eb]" />
            <div className="flex items-center justify-between w-full">
              <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                총 결제 예상 금액
              </p>
              <p className="font-suit font-semibold text-[32px] leading-[1.5] text-[#1f2937]">
                {new Intl.NumberFormat("ko-KR").format(totalPrice)}원
              </p>
            </div>
            <button
              onClick={() => {
                if (checkedItems.length === 0) {
                  alert("주문할 상품을 선택해주세요.");
                  return;
                }
                const orderData = {
                  cartItemIds: checkedItems.map((item) => parseInt(item.id)),
                  items: checkedItems.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    color: item.color,
                    imageUrl: item.imageUrl,
                  })),
                  totalProductPrice,
                  shippingFee,
                  discount,
                  totalPrice,
                };
                localStorage.setItem("checkoutData", JSON.stringify(orderData));
                router.push(ROUTES.CHECKOUT);
              }}
              className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity"
            >
              <p className="font-suit font-semibold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                주문하기
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
