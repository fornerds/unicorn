'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { AlertModal } from '@/components/ui/AlertModal';
import { AtIcon } from '@/components/ui/icons';
import { withBasePath } from '@/utils/assets';
import { useHeader } from '@/contexts/HeaderContext';
import { apiFetch, ApiClientError } from '@/lib/api';
import { formatPhoneNumber, stripPhoneFormat } from '@/utils/phone';

const emailDomains = [
  { value: 'gmail.com', label: 'gmail.com' },
  { value: 'naver.com', label: 'naver.com' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'kakao.com', label: 'kakao.com' },
  { value: 'outlook.com', label: 'outlook.com' },
];

interface ProductOption {
  value: string;
  label: string;
}

const inquiryTypes = [
  { value: 'general', label: '일반 문의' },
  { value: 'product', label: '제품 문의' },
  { value: 'technical', label: '기술 문의' },
  { value: 'partnership', label: '파트너십 문의' },
  { value: 'cancel', label: '취소/환불' },
];

interface FormErrors {
  name?: string;
  contact?: string;
  email?: string;
  type?: string;
  content?: string;
}

export default function ContactPage() {
  const { setIsFirstSection } = useHeader();
  const bannerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(84);
  const [inquiryProducts, setInquiryProducts] = useState<ProductOption[]>([
    { value: '', label: '상품 무관' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    emailDomain: '',
    company: '',
    product: '',
    type: '',
    content: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const currentHeaderHeight = header.offsetHeight;
        setHeaderHeight(currentHeaderHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    // 헤더 높이 변화 감지를 위한 MutationObserver
    const header = document.querySelector('header');
    if (header) {
      const observer = new MutationObserver(updateHeaderHeight);
      observer.observe(header, { attributes: true, attributeFilter: ['style', 'class'] });

      return () => {
        window.removeEventListener('resize', updateHeaderHeight);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch<{ data: { items: { id: number; name: string }[] } }>(
          '/products?limit=100&sort=name&order=asc',
        );
        const options: ProductOption[] = [
          { value: '', label: '상품 무관' },
          ...res.data.items.map((p) => ({ value: String(p.id), label: p.name })),
        ];
        setInquiryProducts(options);
      } catch {
        // 실패 시 기본값 유지
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // 초기 로드 시 투명 헤더로 시작
    setIsFirstSection(true);

    const checkVisibility = () => {
      if (!bannerRef.current || !formRef.current) return;

      const formRect = formRef.current.getBoundingClientRect();

      const formTop = formRect.top;

      const formReachedViewport = formTop <= 200;

      if (formReachedViewport) {
        setIsFirstSection(false);
      } else {
        setIsFirstSection(true);
      }
    };

    checkVisibility();

    const timeoutId = setTimeout(() => {
      checkVisibility();
    }, 100);

    const handleScroll = () => {
      checkVisibility();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [setIsFirstSection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해 주세요.';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = '연락처를 입력해 주세요.';
    }
    if (!formData.email.trim() || !formData.emailDomain) {
      newErrors.email = '이메일을 입력해 주세요.';
    }
    if (!formData.type) {
      newErrors.type = '문의 유형을 선택해 주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '문의 내용을 입력해 주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const fullEmail = `${formData.email}@${formData.emailDomain}`;
      const body: Record<string, unknown> = {
        name: formData.name,
        phone: stripPhoneFormat(formData.contact),
        email: fullEmail,
        company: formData.company || null,
        inquiryType: formData.type,
        content: formData.content,
      };

      if (formData.product) {
        body.productId = Number(formData.product);
      }

      await apiFetch('/inquiries', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      // 성공 시 폼 초기화 + 모달
      setFormData({
        name: '',
        contact: '',
        email: '',
        emailDomain: '',
        company: '',
        product: '',
        type: '',
        content: '',
      });
      setIsSuccessModalOpen(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        alert(err.message);
      } else {
        alert('문의 전송에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen" style={{ marginTop: 0, paddingTop: 0 }}>
      <div
        ref={bannerRef}
        data-banner-section
        className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[341px] w-full overflow-hidden"
        style={{
          marginTop: `-${headerHeight}px`,
          paddingTop: 0,
          zIndex: 1,
        }}
      >
        <div className="absolute inset-0">
          <Image
            src={withBasePath('/images/contactBanner.png')}
            alt="Contact Banner"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
        {/* 그라데이션 오버레이 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.40) 30.78%, rgba(255, 255, 255, 0.00) 76.95%)',
          }}
        />
      </div>

      <div
        className="flex flex-col 4xl:flex-row gap-[40px] md:gap-[80px] 4xl:gap-[182px] items-start px-[20px] md:px-[40px] lg:px-[60px] 4xl:px-[213px] py-[160px] w-full max-w-[1920px] mx-auto bg-transparent relative"
        style={{
          marginTop: `-${headerHeight + 132}px`,
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[40px] md:gap-[80px] 4xl:gap-[200px] items-start shrink-0 w-full 4xl:w-[580px]"
        >
          <div className="flex flex-col gap-[12px] items-start w-full">
            <h2 className="font-suit font-normal text-[18px] md:text-[20px] lg:text-[24px] text-[#1f2937] leading-[1.2] tracking-[-0.96px]">
              Contact us
            </h2>
            <h1 className="font-suit font-extralight text-[32px] sm:text-[40px] md:text-[50px] lg:text-[70px] text-[#1f2937] leading-[1.2] tracking-[-2.8px]">
              Beyond the Limits
              <br />
              of Robotic Toward
              <br />
              a New Era
            </h1>
          </div>

          <div className="flex flex-col gap-[30px] md:gap-[40px] lg:gap-[60px] items-start w-full">
            <div className="flex flex-col md:flex-row gap-[30px] md:gap-[50px] lg:gap-[86px] items-start md:items-center w-full">
              <div className="flex flex-col gap-[12px] md:gap-[16px] lg:gap-[20px] items-start justify-center">
                <h3 className="font-suit font-normal text-[18px] md:text-[20px] lg:text-[24px] text-[#1f2937] leading-[1.2] tracking-[-0.96px]">
                  Address
                </h3>
                <p className="font-suit text-[14px] md:text-[15px] lg:text-[16px] text-[#959ba9] leading-[1.2] tracking-[-0.64px] break-words">
                  05029 서울특별시 광진구 능동로 120 신공학관 1F
                </p>
              </div>
              <div className="flex flex-col gap-[12px] md:gap-[16px] lg:gap-[20px] items-start justify-center">
                <h3 className="font-suit font-normal text-[18px] md:text-[20px] lg:text-[24px] text-[#1f2937] leading-[1.2] tracking-[-0.96px]">
                  Tel.
                </h3>
                <p className="font-suit text-[14px] md:text-[15px] lg:text-[16px] text-[#959ba9] leading-[1.2] tracking-[-0.64px]">
                  02-540-0003
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] md:gap-[16px] lg:gap-[20px] items-start justify-center">
              <h3 className="font-suit font-normal text-[18px] md:text-[20px] lg:text-[24px] text-[#1f2937] leading-[1.2] tracking-[-0.96px]">
                E-mail
              </h3>
              <p className="font-suit text-[14px] md:text-[15px] lg:text-[16px] text-[#959ba9] leading-[1.2] tracking-[-0.64px] break-all">
                unicorn_official@gmail.com
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-[#f3f4f6] flex flex-col gap-[30px] md:gap-[40px] lg:gap-[50px] items-start p-[20px] md:p-[24px] lg:p-[30px] rounded-[16px] shrink-0 w-full 4xl:w-[733px]"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] md:gap-[32px] lg:gap-[40px] items-start w-full">
            <div className="flex flex-col gap-[24px] md:gap-[32px] lg:gap-[40px] items-start w-full">
              <div className="flex flex-col gap-[8px] md:gap-[10px] lg:gap-[12px] items-start px-[2px] w-full">
                <h2 className="font-suit font-medium text-[24px] md:text-[28px] lg:text-[32px] text-[#1f2937] leading-[1.5]">
                  문의하기
                </h2>
                <p className="font-suit text-[14px] md:text-[15px] lg:text-[16px] text-[#959ba9] leading-[1.5]">
                  문의하실 내용을 입력해 주세요
                </p>
              </div>

              <div className="flex flex-col gap-[16px] md:gap-[18px] lg:gap-[20px] items-start w-full">
                <div className="flex flex-col lg:flex-row gap-[12px] md:gap-[14px] lg:gap-[16px] items-start w-full">
                  <div className="flex flex-1 flex-col gap-[8px] items-start w-full">
                    <Input
                      label="이름"
                      required
                      placeholder="이름을 입력해 주세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[8px] items-start w-full">
                    <Input
                      label="연락처"
                      required
                      placeholder="연락처를 입력해 주세요"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', formatPhoneNumber(e.target.value))}
                      maxLength={13}
                      error={errors.contact}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <div className="flex gap-[2px] items-start px-[4px] w-full">
                    <label className="font-suit font-medium text-[18px] text-[#374151] leading-[1.5]">
                      이메일
                    </label>
                    <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                      *
                    </span>
                  </div>
                  <div className="flex gap-[10px] items-center w-full">
                    <div className="flex flex-1">
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
                          <input
                            placeholder="이메일 주소를 입력해 주세요"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 font-suit font-medium text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#ABB0BA]"
                            style={{
                              color: formData.email && formData.email.trim() !== '' ? '#121212' : '#ABB0BA',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center shrink-0 w-[24px] h-[24px]">
                      <AtIcon width={20} height={20} />
                    </div>
                    <div className="flex flex-1">
                      <Select
                        placeholder="선택"
                        options={emailDomains}
                        value={formData.emailDomain}
                        onChange={(e) => handleInputChange('emailDomain', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="font-suit text-[14px] text-red-500 leading-[1.5]">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <Input
                    label="회사명"
                    placeholder="회사명을 입력해 주세요"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-[16px] md:gap-[18px] lg:gap-[20px] items-start w-full">
                  <div className="flex flex-1 flex-col gap-[8px] items-start w-full">
                    <Select
                      label="문의 상품"
                      placeholder="문의 상품을 선택해 주세요"
                      options={inquiryProducts}
                      value={formData.product}
                      onChange={(e) => handleInputChange('product', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[8px] items-start w-full">
                    <Select
                      label="문의 유형"
                      required
                      placeholder="문의 유형을 선택해 주세요"
                      options={inquiryTypes}
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      error={errors.type}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <Textarea
                    label="문의 내용"
                    required
                    placeholder="문의하실 내용을 자세히 입력해 주세요 (최대 500자)"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    maxLength={500}
                    showCounter
                    className="min-h-[200px]"
                    error={errors.content}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#161616] text-[#ffffff] w-full h-[48px] text-[18px] disabled:opacity-50"
              >
                {isSubmitting ? '전송 중...' : '문의 전송'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <AlertModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={'문의가 성공적으로 접수되었습니다.\n빠른 시일 내에 답변드리겠습니다.'}
      />
    </div>
  );
}
