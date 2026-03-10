"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AtIcon, ArrowDownIcon } from "@/components/ui/icons";
import { Divider } from "@/components/ui/Divider";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/utils/constants";
import { withBasePath } from "@/utils/assets";
import { apiFetch } from "@/lib/api";

interface PaymentMethod {
  id: string;
  name: string;
  type: "toss" | "paypal";
}

const paymentMethods: PaymentMethod[] = [
  { id: "toss", name: "토스 (국내 KRW)", type: "toss" },
  { id: "paypal", name: "PayPal", type: "paypal" },
];

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  imageUrl: string;
}

interface CheckoutData {
  cartItemIds?: number[];
  items: OrderItem[];
  totalProductPrice: number;
  shippingFee: number;
  discount: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("toss");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: "",
    contact: "",
    address: "",
    zipCode: "",
    detailAddress: "",
    shippingRequest: "",
    email: "",
    emailDomain: "",
  });
  const [showEmailDomainDropdown, setShowEmailDomainDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tossClientKey, setTossClientKey] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);
  const emailDomainRef = useRef<HTMLDivElement>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRenderedRef = useRef(false);
  const deliveryInfoRef = useRef(deliveryInfo);
  useEffect(() => {
    deliveryInfoRef.current = deliveryInfo;
  }, [deliveryInfo]);

  const emailDomains = [
    "gmail.com",
    "naver.com",
    "daum.net",
    "hanmail.net",
    "직접 입력",
  ];

  useEffect(() => {
    const checkoutDataStr = localStorage.getItem("checkoutData");
    if (checkoutDataStr) {
      try {
        const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);
        setOrderItems(checkoutData.items);
        setTotalProductPrice(checkoutData.totalProductPrice);
        setShippingFee(checkoutData.shippingFee);
        setDiscount(checkoutData.discount);
        setTotalPrice(checkoutData.totalPrice);
      } catch (error) {
        console.error("Failed to parse checkout data:", error);
      }
    }

    if (!document.querySelector('script[src*="tosspayments"]')) {
      const tossScript = document.createElement("script");
      tossScript.src = "https://js.tosspayments.com/v2/standard";
      tossScript.async = true;
      document.head.appendChild(tossScript);
    }

    if (!document.querySelector('script[src*="kakaocdn.net/mapjsapi"]')) {
      const postcodeScript = document.createElement("script");
      postcodeScript.src =
        "//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      postcodeScript.async = true;
      document.head.appendChild(postcodeScript);
    }
  }, []);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setPaypalReady(false);
    paypalButtonsRenderedRef.current = false;
  };

  const handlePaypalReady = () => {
    if (!deliveryInfo.recipientName.trim()) { alert("받는 분 이름을 입력해 주세요."); return; }
    if (!deliveryInfo.contact.trim()) { alert("연락처를 입력해 주세요."); return; }
    if (!deliveryInfo.address.trim()) { alert("주소를 입력해 주세요."); return; }
    const checkoutDataStr = localStorage.getItem("checkoutData");
    if (!checkoutDataStr) { alert("주문 정보를 찾을 수 없습니다. 장바구니로 돌아가 주세요."); return; }
    try {
      const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);
      if (!checkoutData.items?.length) { alert("주문할 상품이 없습니다."); return; }
    } catch { alert("주문 정보를 불러오는 데 실패했습니다."); return; }
    setPaypalReady(true);
  };

  const handleAddressSearch = () => {
    const PostcodeClass =
      (window as any).kakao?.Postcode ?? (window as any).daum?.Postcode;
    if (!PostcodeClass) {
      alert(
        "주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }
    new PostcodeClass({
      oncomplete: (data: {
        roadAddress: string;
        jibunAddress: string;
        zonecode: string;
      }) => {
        const address = data.roadAddress || data.jibunAddress;
        setDeliveryInfo((prev) => ({
          ...prev,
          address,
          zipCode: data.zonecode,
        }));
      },
    }).open();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emailDomainRef.current &&
        !emailDomainRef.current.contains(event.target as Node)
      ) {
        setShowEmailDomainDropdown(false);
      }
    };

    if (showEmailDomainDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmailDomainDropdown]);

  const loadPaypalSdk = (clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        return;
      }
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("PayPal SDK 로드 실패"));
      document.head.appendChild(script);
    });
  };

  // PayPal: 검증 통과 후 버튼 로드
  useEffect(() => {
    if (!paypalReady) return;
    if (paypalButtonsRenderedRef.current) return;

    const loadAndRender = async () => {
      try {
        const cfgRes = await apiFetch<{ data: { paypalClientId: string } }>(
          "/payments/paypal-client-id",
        );
        const { paypalClientId } = cfgRes.data;
        if (!paypalClientId || !paypalContainerRef.current) return;

        await loadPaypalSdk(paypalClientId);
        if (
          paypalButtonsRenderedRef.current ||
          !(window as any).paypal ||
          !paypalContainerRef.current
        )
          return;
        paypalContainerRef.current.innerHTML = "";

        (window as any).paypal
          .Buttons({
            createOrder: async () => {
              const info = deliveryInfoRef.current;
              const checkoutDataStr = localStorage.getItem("checkoutData");
              if (!checkoutDataStr) throw new Error("no checkout data");
              const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);

              const shippingAddress = {
                recipient: info.recipientName,
                phone: info.contact,
                address: [info.address, info.detailAddress]
                  .filter(Boolean)
                  .join(" "),
                zipCode: info.zipCode,
                deliveryRequest: info.shippingRequest,
              };
              const items = checkoutData.items.map((item) => ({
                productId: Number(item.productId),
                color: item.color,
                quantity: item.quantity,
              }));

              localStorage.setItem(
                "checkoutData",
                JSON.stringify({
                  ...checkoutData,
                  deliveryInfo: {
                    recipientName: info.recipientName,
                    contact: info.contact,
                    address: info.address,
                    detailAddress: info.detailAddress,
                  },
                }),
              );

              const orderRes = await apiFetch<{
                data: {
                  orderId: number;
                  paymentOrderId: string;
                  totalAmount: number;
                };
              }>("/orders", {
                method: "POST",
                body: JSON.stringify({
                  shippingAddress,
                  paymentMethod: "paypal",
                  items,
                }),
              });
              const { orderId, paymentOrderId, totalAmount } = orderRes.data;

              localStorage.setItem(
                "payPrepareData",
                JSON.stringify({
                  orderId,
                  paymentOrderId,
                  totalAmount,
                  shippingAddress,
                  paymentMethod: "paypal",
                }),
              );

              const paypalOrderRes = await apiFetch<{
                data: { paypalOrderId: string };
              }>("/payments/paypal/create-order", {
                method: "POST",
                body: JSON.stringify({ orderId }),
              });
              return paypalOrderRes.data.paypalOrderId;
            },
            onApprove: async (data: { orderID: string }) => {
              try {
                const prepareData = JSON.parse(
                  localStorage.getItem("payPrepareData") || "{}",
                );
                await apiFetch("/payments/confirm", {
                  method: "POST",
                  body: JSON.stringify({
                    orderId: prepareData.orderId,
                    paymentProvider: "paypal",
                    paymentKey: data.orderID,
                    amount: 0,
                  }),
                });
                localStorage.setItem(
                  "payPrepareData",
                  JSON.stringify({ ...prepareData, confirmed: true }),
                );
                router.push(ROUTES.CHECKOUT_COMPLETE);
              } catch {
                alert("PayPal 결제 확인 중 오류가 발생했습니다.");
              }
            },
            onError: () => {
              alert("PayPal 결제 중 오류가 발생했습니다.");
            },
          })
          .render(paypalContainerRef.current);
        paypalButtonsRenderedRef.current = true;
      } catch {
        alert("PayPal을 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadAndRender();
  }, [paypalReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toss 결제
  const handlePayment = async () => {
    if (!deliveryInfo.recipientName.trim()) {
      alert("받는 분 이름을 입력해 주세요.");
      return;
    }
    if (!deliveryInfo.contact.trim()) {
      alert("연락처를 입력해 주세요.");
      return;
    }
    if (!deliveryInfo.address.trim()) {
      alert("주소를 입력해 주세요.");
      return;
    }

    const checkoutDataStr = localStorage.getItem("checkoutData");
    if (!checkoutDataStr) {
      alert("주문 정보를 찾을 수 없습니다. 장바구니로 돌아가 주세요.");
      return;
    }

    let checkoutData: CheckoutData;
    try {
      checkoutData = JSON.parse(checkoutDataStr);
    } catch {
      alert("주문 정보를 불러오는 데 실패했습니다.");
      return;
    }

    if (!checkoutData.items || checkoutData.items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    const shippingAddress = {
      recipient: deliveryInfo.recipientName,
      phone: deliveryInfo.contact,
      address: [deliveryInfo.address, deliveryInfo.detailAddress]
        .filter(Boolean)
        .join(" "),
      zipCode: deliveryInfo.zipCode,
      deliveryRequest: deliveryInfo.shippingRequest,
    };

    const items = checkoutData.items.map((item) => ({
      productId: Number(item.productId),
      color: item.color,
      quantity: item.quantity,
    }));

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        ...checkoutData,
        deliveryInfo: {
          recipientName: deliveryInfo.recipientName,
          contact: deliveryInfo.contact,
          address: deliveryInfo.address,
          detailAddress: deliveryInfo.detailAddress,
        },
      }),
    );

    setIsSubmitting(true);
    try {
      const orderRes = await apiFetch<{
        data: { orderId: number; paymentOrderId: string; totalAmount: number };
      }>("/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress, paymentMethod: "toss", items }),
      });
      const { orderId, paymentOrderId, totalAmount } = orderRes.data;

      localStorage.setItem(
        "payPrepareData",
        JSON.stringify({
          orderId,
          paymentOrderId,
          totalAmount,
          shippingAddress,
          paymentMethod: "toss",
        }),
      );

      let key = tossClientKey;
      if (!key) {
        try {
          const cfgRes = await apiFetch<{ data: { tossClientKey: string } }>(
            "/payments/toss-client-key",
          );
          key = cfgRes.data.tossClientKey;
          setTossClientKey(key);
        } catch {}
      }
      if (!key) {
        alert("결제 키를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (typeof (window as any).TossPayments === "undefined") {
        alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      const base = window.location.href.replace(/\/checkout.*/, "");
      const successUrl = `${base}/checkout/complete?success=1&provider=toss&orderId=${orderId}`;
      const failUrl = `${base}/checkout/complete?fail=1`;

      try {
        const tossPayments = (window as any).TossPayments(key);
        const payment = tossPayments.payment({
          customerKey: (window as any).TossPayments.ANONYMOUS,
        });
        await payment.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: Math.round(Number(totalAmount)) },
          orderId: paymentOrderId,
          orderName: "유니콘 로봇 결제",
          successUrl,
          failUrl,
          customerName: deliveryInfo.recipientName,
          customerMobilePhone: deliveryInfo.contact.replace(/-/g, ""),
          card: {
            useEscrow: false,
            flowMode: "DEFAULT",
            useCardPoint: false,
            useAppCardOnly: false,
          },
        });
      } catch (e: any) {
        if (e?.code !== "USER_CANCEL") {
          alert("결제창 열기에 실패했습니다. 다시 시도해 주세요.");
        }
      }
    } catch {
      alert("결제 준비 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[50px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[152px] items-start w-full">
          <div className="flex flex-col gap-[50px] items-start w-full lg:w-[885px]">
            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-start justify-center w-[50px] shrink-0">
                  <p className="font-suit font-extralight text-[48px] leading-[1.5] text-[#1f2937]">
                    1
                  </p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    배송정보
                  </h2>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-light text-[16px] leading-[1.5] text-[#6b7280]">
                      배송정보를 확인하고 내용을 입력해 주세요.
                    </p>
                    <button className="font-suit font-light text-[16px] leading-[1.5] text-[#1f2937] underline hover:opacity-80 transition-opacity">
                      배송정보 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full">
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      받는 분
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.recipientName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          recipientName: e.target.value,
                        })
                      }
                      placeholder="이름을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      연락처
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="tel"
                      value={deliveryInfo.contact}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                        let formatted = digits;
                        if (digits.length > 7) {
                          formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
                        } else if (digits.length > 3) {
                          formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                        }
                        setDeliveryInfo({ ...deliveryInfo, contact: formatted });
                      }}
                      placeholder="010-0000-0000"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start w-full">
                    <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      주소
                    </p>
                  </label>
                  <div className="flex gap-[10px] h-[48px] items-center w-full">
                    <input
                      type="text"
                      value={
                        deliveryInfo.address
                          ? `${deliveryInfo.zipCode ? `[${deliveryInfo.zipCode}] ` : ""}${deliveryInfo.address}`
                          : ""
                      }
                      readOnly
                      placeholder="주소 검색 버튼을 클릭해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] flex-1 items-center p-[16px] rounded-[6px] font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none cursor-default"
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      className="bg-white border border-[#3f7bfc] flex h-[48px] items-center justify-center px-[16px] py-[10px] rounded-[4px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <p className="font-suit font-semibold text-[14px] leading-[1.35] text-[#3f7bfc] whitespace-nowrap">
                        주소 검색
                      </p>
                    </button>
                  </div>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.detailAddress}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          detailAddress: e.target.value,
                        })
                      }
                      placeholder="상세주소를 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      배송 요청사항
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.shippingRequest}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          shippingRequest: e.target.value,
                        })
                      }
                      placeholder="배송 시 요청사항을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[60px] w-full">
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
            </div>

            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-start justify-center w-[50px] shrink-0">
                  <p className="font-suit font-extralight text-[48px] leading-[1.5] text-[#1f2937]">
                    2
                  </p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    결제방법
                  </h2>
                  <p className="font-suit font-light text-[16px] leading-[1.5] text-[#6b7280]">
                    결제방법을 선택해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center w-full flex-wrap gap-[6px]">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={cn(
                      "flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] shrink-0 transition-colors w-[199px]",
                      selectedPaymentMethod === method.id
                        ? "bg-[#1f2937]"
                        : "bg-[#f9fafb] border-[0.5px] border-[#e5e7eb]",
                    )}
                  >
                    {method.type === "paypal" ? (
                      <div className="h-[26px] w-[119px] relative">
                        <Image
                          src={withBasePath("/images/paypal.png")}
                          alt="PayPal"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "h-[60px] w-[120px] relative",
                          selectedPaymentMethod === method.id &&
                            "brightness-0 invert",
                        )}
                      >
                        <Image
                          src={withBasePath("/images/Toss_Logo_Primary.png")}
                          alt="Toss"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="h-[60px] w-full">
                <div className="h-[1px] w-full bg-[#e5e7eb]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[90px] items-start shrink-0 w-full lg:w-[457px]">
            <div className="flex flex-col gap-[26px] items-start rounded-[16px] shrink-0 w-full">
              <h2 className="font-suit font-medium text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                Order Summary
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
              {selectedPaymentMethod !== "paypal" ? (
                <button
                  disabled={isSubmitting}
                  onClick={handlePayment}
                  className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <p className="font-suit font-semibold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                    {isSubmitting
                      ? "결제 준비 중..."
                      : `${new Intl.NumberFormat("ko-KR").format(totalPrice)}원 결제하기`}
                  </p>
                </button>
              ) : !paypalReady ? (
                <button
                  onClick={handlePaypalReady}
                  className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity"
                >
                  <p className="font-suit font-semibold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                    PayPal로 결제하기
                  </p>
                </button>
              ) : (
                <div className="flex flex-col gap-[10px] w-full">
                  <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#6b7280]">
                    아래 PayPal 버튼을 클릭하여 결제를 완료해 주세요.
                  </p>
                  <div ref={paypalContainerRef} className="min-h-[45px]" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[22px] items-start w-full">
              <h3 className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                구매 진행중인 상품({orderItems.length})
              </h3>
              <div className="flex flex-col gap-[16px] items-start w-full">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div key={item.id} className="w-full">
                      <div className="flex gap-[10px] items-center w-full">
                        <div className="bg-[#f9fafb] flex items-center justify-center rounded-[12px] shrink-0 w-[104px] h-[104px]">
                          {item.imageUrl ? (
                            <div className="relative w-full h-full">
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
                            </div>
                          ) : (
                            <span className="font-cardo font-medium text-[12px] text-[#1f2937]">
                              UNICORN
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col h-[104px] items-start justify-between min-w-0">
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center w-full">
                              <h4 className="flex-1 font-suit font-normal text-[20px] leading-[1.5] text-[#1f2937] truncate">
                                {item.name}
                              </h4>
                            </div>
                            <div className="flex gap-[8px] items-center">
                              <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                수량 {item.quantity}
                              </p>
                              <Divider orientation="vertical" />
                              <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                {item.color?.split("/")[0] ?? ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-end justify-end w-full">
                            <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                              {new Intl.NumberFormat("ko-KR").format(
                                item.price * item.quantity,
                              )}
                              원
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < orderItems.length - 1 && (
                        <div className="h-[1px] w-full bg-[#e5e7eb] mt-[16px]" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="font-suit font-light text-[16px] text-[#959ba9]">
                    주문할 상품이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
