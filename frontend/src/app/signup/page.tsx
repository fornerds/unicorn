'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AtIcon, EyeOffIcon, ViewIcon, ArrowDownIcon, ArrowBackIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [showName, setShowName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const fullEmail = `${email}@${emailDomain}`;
    console.log('Signup attempt:', {
      name,
      email: fullEmail,
      password,
      passwordConfirm,
      phone,
      agreements,
    });
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[40px] items-center w-full max-w-[458px]">
          <div className="flex items-center justify-center p-[10px] shrink-0">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
          </div>

          <div className="flex items-center w-full">
            <div className="flex gap-[6px] items-center">
              <Link
                href={ROUTES.LOGIN}
                className="flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="뒤로가기"
              >
                <ArrowBackIcon width={20} height={16} stroke="#1f2937" />
              </Link>
              <h2 className="font-suit font-medium text-[20px] text-[#1f2937] leading-[1.45] whitespace-nowrap">
                회원가입
              </h2>
            </div>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-[30px] items-start w-full">
            <div className="flex flex-col gap-[30px] items-start w-full">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    이름
                  </label>
                  <span className="font-suit font-bold text-[14px] text-[#3F7BFC] leading-[1.35]">
                    *
                  </span>
                </div>
                <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요."
                    className="flex-1 font-suit font-regular text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowName(!showName)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                    aria-label={showName ? '이름 숨기기' : '이름 보기'}
                  >
                    <ViewIcon width={20} height={20} stroke="#bac2d0" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    이메일 주소
                  </label>
                  <span className="font-suit font-bold text-[14px] text-[#3F7BFC] leading-[1.35]">
                    *
                  </span>
                </div>
                <div className="flex gap-[12px] items-center w-full">
                  <div className="flex flex-1 h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일 주소"
                      className="flex-1 font-suit font-semibold text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]"
                    />
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <AtIcon width={17} height={17} />
                  </div>
                  <div className="flex flex-1 h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                    <select
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className="flex-1 font-suit font-regular text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none appearance-none"
                    >
                      <option value="" className='placeholder:text-[#bac2d0]'>선택</option>
                      {emailDomains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]">
                      <ArrowDownIcon width={15} height={15} stroke="#bac2d0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    비밀번호
                  </label>
                </div>
                <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해 주세요."
                    className="flex-1 font-suit font-regular text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? (
                      <ViewIcon width={20} height={20} stroke="#bac2d0" />
                    ) : (
                      <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#161616] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    비밀번호 확인
                  </label>
                </div>
                <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력해 주세요."
                    className="flex-1 font-suit font-regular text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                    aria-label={showPasswordConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                  >
                    {showPasswordConfirm ? (
                      <ViewIcon width={20} height={20} stroke="#bac2d0" />
                    ) : (
                      <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    전화번호
                  </label>
                </div>
                <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="'-' 표시를 제외하고 입력해 주세요."
                    className="flex-1 font-suit font-regular text-[16px] text-[#161616] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                    aria-label={showPhone ? '전화번호 숨기기' : '전화번호 보기'}
                  >
                    <ViewIcon width={20} height={20} stroke="#bac2d0" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[20px] items-start w-full">
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className="flex gap-[6px] items-center">
                  <button
                    type="button"
                    onClick={() => handleAgreementChange('terms')}
                    className="flex gap-[8px] items-center py-[4px] cursor-pointer"
                  >
                    <div className="relative shrink-0 w-[22px] h-[22px]">
                      {agreements.terms ? (
                        <div className="absolute bg-[#161616] inset-0 rounded-[4px]">
                          <div className="absolute inset-[6.67%] overflow-clip">
                            <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                              >
                                <path
                                  d="M1 5L5 9L13 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute border border-[#BAC2D0] inset-0 rounded-[4px]" />
                      )}
                    </div>
                    <div className="flex h-[22px] items-center py-[10px]">
                      <span className="font-suit font-medium text-[16px] text-[#374151] leading-[1.35]">
                        이용약관에 동의합니다.
                      </span>
                    </div>
                  </button>
                  <Link
                    href="#"
                    className="font-suit font-medium text-[16px] text-[#959ba9] leading-[1.35] underline"
                  >
                    보기
                  </Link>
                </div>
                <div className="flex gap-[6px] items-center">
                  <button
                    type="button"
                    onClick={() => handleAgreementChange('privacy')}
                    className="flex gap-[8px] items-center py-[4px] cursor-pointer"
                  >
                    <div className="relative shrink-0 w-[22px] h-[22px]">
                      {agreements.privacy ? (
                        <div className="absolute bg-[#161616] inset-0 rounded-[4px]">
                          <div className="absolute inset-[6.67%] overflow-clip">
                            <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                              >
                                <path
                                  d="M1 5L5 9L13 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute border border-[#BAC2D0] inset-0 rounded-[4px]" />
                      )}
                    </div>
                    <div className="flex h-[22px] items-center py-[10px]">
                      <span className="font-suit font-medium text-[16px] text-[#374151] leading-[1.35]">
                        개인정보처리방침에 동의합니다.
                      </span>
                    </div>
                  </button>
                  <Link
                    href="#"
                    className="font-suit font-medium text-[16px] text-[#959ba9] leading-[1.35] underline"
                  >
                    보기
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => handleAgreementChange('marketing')}
                  className="flex gap-[8px] items-center py-[4px] cursor-pointer w-full"
                >
                  <div className="relative shrink-0 w-[22px] h-[22px]">
                    {agreements.marketing ? (
                      <div className="absolute bg-[#161616] inset-0 rounded-[4px]">
                        <div className="absolute inset-[6.67%] overflow-clip">
                          <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                            >
                              <path
                                d="M1 5L5 9L13 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute border border-[#BAC2D0] inset-0 rounded-[4px]" />
                    )}
                  </div>
                  <div className="flex h-[22px] items-center py-[10px]">
                    <span className="font-suit font-medium text-[16px] text-[#374151] leading-[1.35]">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </span>
                  </div>
                </button>
              </div>
              <Button type="submit" className="w-full bg-[#161616] text-[#FFFBF4]">
                회원가입
              </Button>
            </div>
          </form>

          <div className="flex gap-[8px] h-[24px] items-center justify-center w-full">
            <p className="font-suit font-regular text-[16px] text-[#4b5563] leading-[1.5] text-center whitespace-nowrap">
              이미 계정이 있으신가요?
            </p>
            <Link
              href={ROUTES.LOGIN}
              className="font-suit font-semibold text-[16px] text-[#1f2937] leading-[1.5] text-center whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              로그인
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
