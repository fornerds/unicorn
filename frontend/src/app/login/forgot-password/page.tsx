'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowBackIcon, ArrowDownIcon, AtIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';

export default function ForgotPasswordPage() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');

  const countryCodes = [
    { code: '82', label: '82' },
    { code: '1', label: '1' },
    { code: '81', label: '81' },
    { code: '86', label: '86' },
  ];

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'phone') {
      console.log('Forgot password attempt:', { countryCode, phone, verificationCode, activeTab });
    } else {
      console.log('Forgot password attempt:', { email, emailDomain, verificationCode, activeTab });
    }
  };

  const handleSendVerificationCode = () => {
    console.log('Send verification code');
  };

  const handleVerifyCode = () => {
    console.log('Verify code');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[60px] items-center w-full max-w-[580px]">
          <div className="flex items-center justify-center p-[10px] shrink-0">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
          </div>

          <div className="flex items-center w-full">
            <div className="flex gap-[6px] items-center">
              <Link href={ROUTES.LOGIN} className="flex items-center">
                <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
                  <ArrowBackIcon width={20} height={16} stroke="#1F2937" />
                </div>
              </Link>
              <h2 className="font-suit font-medium text-[20px] text-[#1f2937] leading-[1.45] whitespace-nowrap">
                비밀번호 변경
              </h2>
            </div>
          </div>

          <div className="flex gap-[4px] items-center w-full">
            <button
              type="button"
              onClick={() => setActiveTab('phone')}
              className={`flex flex-1 h-[56px] items-center justify-center border-b ${
                activeTab === 'phone'
                  ? 'border-[#374151] border-b-[1.5px]'
                  : 'border-[#d1d5db] border-b-2'
              }`}
            >
              <span
                className={`font-suit font-semibold text-[22px] leading-[1.45] whitespace-nowrap ${
                  activeTab === 'phone' ? 'text-[#374151]' : 'text-[#d1d5db]'
                }`}
              >
                전화번호로 인증
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex flex-1 h-[56px] items-center justify-center border-b ${
                activeTab === 'email'
                  ? 'border-[#374151] border-b-[1.5px]'
                  : 'border-[#d1d5db] border-b-2'
              }`}
            >
              <span
                className={`font-suit font-semibold text-[22px] leading-[1.45] whitespace-nowrap ${
                  activeTab === 'email' ? 'text-[#374151]' : 'text-[#d1d5db]'
                }`}
              >
                이메일로 인증
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[60px] items-start w-full">
            <div className="flex flex-col gap-[20px] items-start w-full">
              {activeTab === 'phone' ? (
                <>
                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                      <div className="flex items-start w-full">
                        <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                          전화번호 입력
                        </label>
                      </div>
                      <div className="flex gap-[12px] items-start w-full">
                        <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] shrink-0 w-[120px]">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none appearance-none ${
                              countryCode ? 'text-[#161616]' : 'text-[#bac2d0]'
                            }`}
                          >
                            <option value="" disabled>
                              선택
                            </option>
                            {countryCodes.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]">
                            <ArrowDownIcon width={15} height={15} fill="#bac2d0" />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-[6px] items-start min-w-0">
                          <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="전화번호를 입력해 주세요."
                              className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                                phone ? 'text-[#161616]' : 'text-[#bac2d0]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start shrink-0 w-[149px]">
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
                      >
                        인증번호 전송
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col items-start min-w-0">
                      <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="인증번호를 입력해 주세요."
                          className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                            verificationCode ? 'text-[#161616]' : 'text-[#bac2d0]'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start shrink-0 w-[149px]">
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#6C6C6C] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
                      >
                        인증하기
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                      <div className="flex gap-[4px] items-start w-full">
                        <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                          이메일 주소
                        </label>
                      </div>
                      <div className="flex gap-[12px] items-center w-full">
                        <div className="flex flex-1 h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 주소"
                            className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                              email ? 'text-[#161616]' : 'text-[#bac2d0]'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                          <AtIcon width={17} height={17} />
                        </div>
                        <div className="flex flex-1 h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                          <select
                            value={emailDomain}
                            onChange={(e) => setEmailDomain(e.target.value)}
                            className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none appearance-none ${
                              emailDomain ? 'text-[#161616]' : 'text-[#bac2d0]'
                            }`}
                          >
                            <option value="" disabled>
                              선택
                            </option>
                            {emailDomains.map((domain) => (
                              <option key={domain} value={domain}>
                                {domain}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]">
                            <ArrowDownIcon width={15} height={15} fill="#bac2d0" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start shrink-0 w-[149px]">
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
                      >
                        인증번호 전송
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col items-start min-w-0">
                      <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="인증번호를 입력해 주세요."
                          className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                            verificationCode ? 'text-[#161616]' : 'text-[#bac2d0]'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start shrink-0 w-[149px]">
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#6C6C6C] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
                      >
                        인증하기
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-start w-full">
              <button
                type="submit"
                className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
              >
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
