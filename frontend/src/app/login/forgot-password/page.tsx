'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowBackIcon, ArrowDownIcon, AtIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { formatPhoneNumber, stripPhoneFormat } from '@/utils/phone';
import { apiFetch, ApiClientError } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const countryCodes = [
    { code: '82', label: '82' },
    { code: '1', label: '1' },
    { code: '81', label: '81' },
    { code: '86', label: '86' },
  ];

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

  const handleSendVerificationCode = async () => {
    setError('');
    setSuccessMessage('');

    if (activeTab === 'phone') {
      if (!phone.trim()) {
        setError('전화번호를 입력해 주세요.');
        return;
      }
      setIsSending(true);
      try {
        await apiFetch<{ data: { sent: boolean } }>('/auth/password/find/phone', {
          method: 'POST',
          body: JSON.stringify({ phone: stripPhoneFormat(phone) }),
        });
        setIsCodeSent(true);
        setSuccessMessage('인증번호가 전송되었습니다.');
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('인증번호 전송에 실패했습니다.');
        }
      } finally {
        setIsSending(false);
      }
    } else {
      if (!email.trim() || !emailDomain) {
        setError('이메일 주소를 입력해 주세요.');
        return;
      }
      const fullEmail = `${email}@${emailDomain}`;
      setIsSending(true);
      try {
        await apiFetch<{ data: { sent: boolean } }>('/auth/password/find/email/send-code', {
          method: 'POST',
          body: JSON.stringify({ email: fullEmail }),
        });
        setIsCodeSent(true);
        setSuccessMessage('인증번호가 이메일로 전송되었습니다. 이메일을 확인해 주세요.');
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('인증 메일 전송에 실패했습니다.');
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    if (!verificationCode.trim()) {
      setError('인증번호를 입력해 주세요.');
      return;
    }

    if (activeTab === 'phone') {
      setIsVerified(true);
      setSuccessMessage('인증이 완료되었습니다.');
      return;
    }

    // 이메일 인증: verify-code API 호출 후 resetToken 저장
    const fullEmail = `${email}@${emailDomain}`;
    setIsVerifying(true);
    try {
      const res = await apiFetch<{ data: { sent: boolean; success: boolean; resetToken: string } }>(
        '/auth/password/find/email/verify-code',
        {
          method: 'POST',
          body: JSON.stringify({ email: fullEmail, code: verificationCode }),
        },
      );
      setResetToken(res.data.resetToken);
      setIsVerified(true);
      setSuccessMessage('인증이 완료되었습니다.');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('인증번호 확인에 실패했습니다. 다시 확인해 주세요.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isCodeSent) {
      setError('먼저 인증번호를 전송해 주세요.');
      return;
    }
    if (!isVerified) {
      setError('인증을 완료해 주세요.');
      return;
    }

    if (activeTab === 'phone') {
      const params = new URLSearchParams({
        method: 'phone',
        phone: stripPhoneFormat(phone),
        verifyCode: verificationCode,
      });
      router.push(`/login/reset-password?${params.toString()}`);
    } else {
      const fullEmail = `${email}@${emailDomain}`;
      const params = new URLSearchParams({
        method: 'email',
        email: fullEmail,
        token: resetToken,
      });
      router.push(`/login/reset-password?${params.toString()}`);
    }
  };

  const handleTabChange = (tab: 'phone' | 'email') => {
    setActiveTab(tab);
    setIsCodeSent(false);
    setIsVerified(false);
    setVerificationCode('');
    setResetToken('');
    setError('');
    setSuccessMessage('');
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
              <h2 className="font-suit font-normal text-[20px] text-[#1f2937] leading-[1.45] whitespace-nowrap">
                비밀번호 변경
              </h2>
            </div>
          </div>

          <div className="flex gap-[4px] items-center w-full">
            <button
              type="button"
              onClick={() => handleTabChange('phone')}
              className={`flex flex-1 h-[56px] items-center justify-center border-b ${
                activeTab === 'phone'
                  ? 'border-[#374151] border-b-[1.5px]'
                  : 'border-[#d1d5db] border-b-2'
              }`}
            >
              <span
                className={`font-suit font-medium text-[22px] leading-[1.45] whitespace-nowrap ${
                  activeTab === 'phone' ? 'text-[#374151]' : 'text-[#d1d5db]'
                }`}
              >
                전화번호로 인증
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('email')}
              className={`flex flex-1 h-[56px] items-center justify-center border-b ${
                activeTab === 'email'
                  ? 'border-[#374151] border-b-[1.5px]'
                  : 'border-[#d1d5db] border-b-2'
              }`}
            >
              <span
                className={`font-suit font-medium text-[22px] leading-[1.45] whitespace-nowrap ${
                  activeTab === 'email' ? 'text-[#374151]' : 'text-[#d1d5db]'
                }`}
              >
                이메일로 인증
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[60px] items-start w-full">
            {error && (
              <div className="w-full px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[6px]">
                <p className="font-suit font-normal text-[14px] text-red-600 leading-[1.5]">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="w-full px-[16px] py-[12px] bg-green-50 border border-green-200 rounded-[6px]">
                <p className="font-suit font-normal text-[14px] text-green-700 leading-[1.5]">{successMessage}</p>
              </div>
            )}

            <div className="flex flex-col gap-[20px] items-start w-full">
              {activeTab === 'phone' ? (
                <>
                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                      <div className="flex items-start w-full">
                        <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
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
                              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                              placeholder="010-0000-0000"
                              maxLength={13}
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
                        disabled={isSending}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSending ? '전송 중...' : isCodeSent ? '재전송' : '인증번호 전송'}
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
                        disabled={isVerifying || isVerified}
                        className={`w-full h-[48px] flex items-center justify-center rounded-[6px] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50 ${
                          isVerified
                            ? 'bg-green-50 border border-green-300 text-green-700'
                            : 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#6C6C6C]'
                        }`}
                      >
                        {isVerified ? '인증완료' : '인증하기'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-[30px] items-end justify-center w-full">
                    <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                      <div className="flex gap-[4px] items-start w-full">
                        <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
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
                        disabled={isSending}
                        className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSending ? '전송 중...' : isCodeSent ? '재전송' : '인증번호 전송'}
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
                        disabled={isVerifying || isVerified}
                        className={`w-full h-[48px] flex items-center justify-center rounded-[6px] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50 ${
                          isVerified
                            ? 'bg-green-50 border border-green-300 text-green-700'
                            : 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#6C6C6C]'
                        }`}
                      >
                        {isVerified ? '인증완료' : '인증하기'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-start w-full">
              <button
                type="submit"
                disabled={!isVerified}
                className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50"
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
