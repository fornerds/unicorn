'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckIcon, DeleteIcon, MinusIcon, PlusIcon, ArrowDownIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory: string;
  companyName: string;
  quantity: number;
  selectedColor: {
    id: string;
    name: string;
    value: string;
    borderColor: string;
  };
  isChecked: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    productId: '1',
    name: 'AURA_AI 가사 휴머노이드',
    price: 85000000,
    imageUrl: '/images/product01.png',
    category: 'HOME',
    subCategory: 'Human',
    companyName: 'Unitree',
    quantity: 100,
    selectedColor: {
      id: '1',
      name: '라이트블루/Light Blue',
      value: '#e6edfc',
      borderColor: '#c2c9d9',
    },
    isChecked: true,
  },
  {
    id: 'cart-2',
    productId: '2',
    name: 'H1',
    price: 1200000,
    imageUrl: '/images/product02.png',
    category: 'HOME',
    subCategory: 'Human',
    companyName: 'Boston Dynamics',
    quantity: 50,
    selectedColor: {
      id: '2',
      name: '다크그레이/Dark Gray',
      value: '#4b5563',
      borderColor: '#374151',
    },
    isChecked: true,
  },
  {
    id: 'cart-3',
    productId: '3',
    name: 'Spot',
    price: 74500,
    imageUrl: '/images/product03.png',
    category: 'HOME',
    subCategory: 'Quadruped',
    companyName: 'Boston Dynamics',
    quantity: 200,
    selectedColor: {
      id: '3',
      name: '화이트/White',
      value: '#ffffff',
      borderColor: '#e5e7eb',
    },
    isChecked: false,
  },
];

const availableColors = [
  { id: '1', name: '라이트블루/Light Blue', value: '#e6edfc', borderColor: '#c2c9d9' },
  { id: '2', name: '다크그레이/Dark Gray', value: '#4b5563', borderColor: '#374151' },
  { id: '3', name: '화이트/White', value: '#ffffff', borderColor: '#e5e7eb' },
  { id: '4', name: '아이보리/Ivory', value: '#fefefe', borderColor: '#dedede' },
];

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
        'relative size-[22px] rounded-[4px] border transition-colors',
        checked
          ? 'bg-[#1f2937] border-[#1f2937]'
          : 'bg-[#f9fafb] border-[#e5e7eb]',
        className
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

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [showColorDropdowns, setShowColorDropdowns] = useState<Record<string, boolean>>({});
  const colorDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allChecked = useMemo(() => cartItems.every((item) => item.isChecked), [cartItems]);
  const checkedItems = useMemo(() => cartItems.filter((item) => item.isChecked), [cartItems]);

  const handleSelectAll = (checked: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, isChecked: checked })));
  };

  const handleItemCheck = (id: string, checked: boolean) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, isChecked: checked } : item)));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleQuantityInput = (id: string, value: string) => {
    // 숫자만 허용
    const numericValue = value.replace(/[^0-9]/g, '');
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (numericValue === '') {
            return { ...item, quantity: 0 };
          } else {
            const numValue = parseInt(numericValue, 10);
            if (!isNaN(numValue) && numValue >= 1) {
              return { ...item, quantity: numValue };
            }
          }
        }
        return item;
      })
    );
  };

  const handleQuantityBlur = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && (item.quantity < 1 || item.quantity === 0)) {
          return { ...item, quantity: 1 };
        }
        return item;
      })
    );
  };

  const handleQuantityFocus = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: 0 } : item))
    );
  };

  const handleColorChange = (id: string, color: typeof availableColors[0]) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedColor: color } : item
      )
    );
    setShowColorDropdowns((prev) => ({ ...prev, [id]: false }));
  };

  const handleDeleteItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteAll = () => {
    setCartItems((prev) => prev.filter((item) => !item.isChecked));
  };

  const toggleColorDropdown = (id: string) => {
    setShowColorDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(colorDropdownRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node) && showColorDropdowns[id]) {
          setShowColorDropdowns((prev) => ({ ...prev, [id]: false }));
        }
      });
    };

    if (Object.values(showColorDropdowns).some((open) => open)) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorDropdowns]);

  const totalProductPrice = useMemo(() => {
    return checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [checkedItems]);

  const shippingFee = checkedItems.length > 0 ? 100000 : 0;
  const discount = 0;
  const totalPrice = totalProductPrice + shippingFee - discount;

  const categoryDisplayMap: Record<string, string> = {
    HOME: '가정용',
    FIREFIGHTING: '화재진압',
    INDUSTRIAL: '산업용',
    MEDICAL: '의료용',
    LOGISTICS: '물류용',
  };

  const subCategoryDisplayMap: Record<string, string> = {
    Human: '가사 및 보조 휴머노이드',
    Quadruped: '4족보행',
    Manipulator: '매니퓰레이터',
    Wheeled: '바퀴형',
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[52px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[151px] items-start w-full">
          <div className="flex flex-col gap-[52px] items-start w-full lg:w-[886px]">
            <div className="flex flex-col gap-[10px] items-start w-full">
              <h1 className="font-suit font-medium text-[32px] leading-[1.5] text-[#1f2937]">
                Shopping Cart ({cartItems.length})
              </h1>
              <p className="font-suit font-normal text-[16px] leading-[1.5] text-[#959ba9]">
                선택하신 로봇들을 확인하고 주문하세요.
              </p>
            </div>

            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center justify-between pl-[10px] w-full">
                <div className="flex gap-[10px] items-center py-[4px]">
                  <Checkbox checked={allChecked} onChange={handleSelectAll} />
                  <p className="font-suit font-medium text-[14px] leading-[1.35] text-[#374151]">
                    전체 선택
                  </p>
                </div>
                <button
                  onClick={handleDeleteAll}
                  className="font-suit font-medium text-[18px] leading-[1.35] text-[#959ba9] underline hover:opacity-80 transition-opacity"
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
                      <div className="bg-[#f9fafb] flex items-center rounded-[12px] shrink-0 w-[140px] h-[140px]">
                        <div className="relative w-full h-full">
                          <Image
                            src={withBasePath(item.imageUrl)}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover rounded-[12px]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[37px] items-start w-full max-w-[660px]">
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[11px] items-center">
                              <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                {categoryDisplayMap[item.category] || item.category}
                              </p>
                              <div className="w-[13px] h-[13px] flex items-center justify-center">
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 13 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5 4L10 8L5 12"
                                    stroke="#959ba9"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                {subCategoryDisplayMap[item.subCategory] || item.subCategory}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex items-center justify-center p-[2.333px] rounded-[9.333px] w-[28px] h-[28px] hover:opacity-80 transition-opacity shrink-0"
                            >
                              <DeleteIcon width={18.667} height={21} stroke="#374151" strokeWidth={1} />
                            </button>
                          </div>
                          <div className="flex items-center w-full">
                            <h3 className="flex-1 font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] truncate">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-end justify-between w-full">
                          <div className="flex flex-1 gap-[10px] items-center min-w-0">
                            <div className="bg-[#f9fafb] border border-[#e5e7eb] flex gap-[10px] h-[36px] items-center justify-center px-[10px] py-[8px] rounded-[8px] shrink-0">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="flex items-center justify-center w-[16px] h-[16px] shrink-0 hover:opacity-80 transition-opacity"
                              >
                                <MinusIcon width={12} height={1} stroke="#6b7280" strokeWidth={1} />
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={item.quantity === 0 ? '' : item.quantity}
                                onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                                onFocus={() => handleQuantityFocus(item.id)}
                                onBlur={() => handleQuantityBlur(item.id)}
                                className="font-suit font-semibold text-[16px] leading-[1.35] text-[#6b7280] text-center bg-transparent border-none outline-none w-[50px] shrink-0"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="flex items-center justify-center w-[16px] h-[16px] shrink-0 hover:opacity-80 transition-opacity"
                              >
                                <PlusIcon width={15} height={15} stroke="#6b7280" strokeWidth={1.5} />
                              </button>
                            </div>
                            <div className="relative" ref={(el) => { colorDropdownRefs.current[item.id] = el; }}>
                              <button
                                onClick={() => toggleColorDropdown(item.id)}
                                className="bg-[#f9fafb] border border-[#e5e7eb] flex gap-[12px] h-[36px] items-center px-[12px] py-[10px] rounded-[8px] shrink-0 hover:opacity-80 transition-opacity"
                              >
                                <div
                                  className="rounded-full shrink-0 w-[19px] h-[19px] border"
                                  style={{
                                    backgroundColor: item.selectedColor.value,
                                    borderColor: item.selectedColor.borderColor,
                                  }}
                                />
                                <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#6b7280] whitespace-nowrap">
                                  {item.selectedColor.name.split('/')[0]}
                                </p>
                                <div className="flex items-center justify-center p-px rounded-[4px] w-[12px] h-[12px] shrink-0">
                                  <ArrowDownIcon
                                    width={9}
                                    height={5}
                                    fill="#6b7280"
                                    className={`transition-transform ${showColorDropdowns[item.id] ? 'rotate-180' : ''}`}
                                  />
                                </div>
                              </button>
                              {showColorDropdowns[item.id] && (
                                <div className="absolute top-full left-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-10 min-w-[200px]">
                                  {availableColors.map((color) => (
                                    <button
                                      key={color.id}
                                      onClick={() => handleColorChange(item.id, color)}
                                      className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] last:border-b-0 flex items-center gap-[12px] px-[12px] py-[10px] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[8px] last:rounded-b-[8px]"
                                    >
                                      <div
                                        className="rounded-full shrink-0 w-[19px] h-[19px] border"
                                        style={{
                                          backgroundColor: color.value,
                                          borderColor: color.borderColor,
                                        }}
                                      />
                                      <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#6b7280] whitespace-nowrap">
                                        {color.name.split('/')[0]}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center shrink-0">
                            <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                              {new Intl.NumberFormat('ko-KR').format(item.price * item.quantity)}원
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
          </div>

          <div className="flex flex-col gap-[26px] items-start rounded-[16px] shrink-0 w-full lg:w-[457px]">
            <h2 className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
              Order Summery
            </h2>
            <div className="h-[1px] w-full bg-[#e5e7eb]" />
            <div className="flex flex-col gap-[16px] items-end w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                  총 상품 가격
                </p>
                <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(totalProductPrice)}원
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                  배송비
                </p>
                <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(shippingFee)}원
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                  총 할인율
                </p>
                <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(discount)}원
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#e5e7eb]" />
            <div className="flex items-center justify-between w-full">
              <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                총 결제 예상 금액
              </p>
              <p className="font-suit font-bold text-[32px] leading-[1.5] text-[#1f2937]">
                {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
              </p>
            </div>
            <button
              onClick={() => {
                if (checkedItems.length === 0) {
                  alert('주문할 상품을 선택해주세요.');
                  return;
                }
                const orderData = {
                  items: checkedItems.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    selectedColor: item.selectedColor,
                    imageUrl: item.imageUrl,
                    category: item.category,
                    subCategory: item.subCategory,
                    companyName: item.companyName,
                  })),
                  totalProductPrice,
                  shippingFee,
                  discount,
                  totalPrice,
                };
                localStorage.setItem('checkoutData', JSON.stringify(orderData));
                router.push(ROUTES.CHECKOUT);
              }}
              className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity"
            >
              <p className="font-suit font-bold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                주문하기
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
