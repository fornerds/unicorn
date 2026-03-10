'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import { PasswordChangeModal } from '@/components/ui/PasswordChangeModal';
import { AlertModal } from '@/components/ui/AlertModal';
import { formatPhoneNumber, stripPhoneFormat } from '@/utils/phone';
import { apiFetch, ApiClientError } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function MyProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const authLogout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [joinDate, setJoinDate] = useState('');
  const [isSnsUser, setIsSnsUser] = useState(false);

  // GET /users/me - 페이지 로드 시 최신 회원정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiFetch<{ data: { email: string; name: string; phone: string; marketingAgreed: boolean; isSnsUser: boolean } }>('/users/me');
        const data = res.data;
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone ? formatPhoneNumber(data.phone) : '');
        setMarketingAgreed(data.marketingAgreed ?? false);
        setIsSnsUser(data.isSnsUser ?? false);
        updateUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          marketingAgreed: data.marketingAgreed,
        });
      } catch {
        // API 실패 시 스토어 데이터로 폴백
        if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
          setPhone(user.phone ? formatPhoneNumber(user.phone) : '');
          setMarketingAgreed(user.marketingAgreed ?? false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user?.createdAt) {
      const d = new Date(user.createdAt);
      setJoinDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }
  }, [user?.createdAt]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // 수정 취소 시 서버에서 가져온 원래 값으로 복원
    if (user) {
      setName(user.name || '');
      setPhone(user.phone ? formatPhoneNumber(user.phone) : '');
      setMarketingAgreed(user.marketingAgreed ?? false);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await apiFetch<{ data: { email: string; name: string; phone: string; marketingAgreed: boolean } }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          phone: stripPhoneFormat(phone),
          marketingAgreed,
        }),
      });

      setName(res.data.name || '');
      setPhone(res.data.phone ? formatPhoneNumber(res.data.phone) : '');
      setMarketingAgreed(res.data.marketingAgreed ?? false);
      updateUser({
        name: res.data.name,
        phone: res.data.phone,
        marketingAgreed: res.data.marketingAgreed,
      });

      setIsEditing(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        alert(err.message);
      } else {
        alert('정보 수정에 실패했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // 로그아웃 API 실패해도 클라이언트 상태는 초기화
    } finally {
      authLogout();
      router.push(ROUTES.LOGIN);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // 1. 현재 비밀번호 확인
    try {
      await apiFetch('/users/me/password/verify', {
        method: 'POST',
        body: JSON.stringify({ currentPassword }),
      });
    } catch {
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }

    // 2. 비밀번호 변경
    await apiFetch('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col items-center justify-center min-h-[400px]">
        <p className="font-suit text-[16px] text-[#6c6c6c]">회원정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[36px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[275px]">
            <div className="flex flex-col font-suit font-thin justify-center text-[60px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap">Mypage</p>
            </div>
            <div className="flex flex-col font-suit font-extralight justify-center text-[30px] w-full">
              <p className="leading-[1.35] whitespace-pre-wrap">마이페이지</p>
            </div>
          </div>

          <div className="flex flex-col gap-[60px] items-start w-[727px]">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col font-elice font-extralight justify-center text-[#111827] text-[26px] w-[191px]">
                <p className="leading-[36px] whitespace-pre-wrap">프로필 정보</p>
              </div>
              <div className="flex gap-[12px] items-center">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-[#f9fafb] border border-[#e5e7eb] flex h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <div className="flex flex-col font-suit font-normal justify-center text-[#6c6c6c] text-[16px] text-center whitespace-nowrap">
                        <p className="leading-[1.3]">취소</p>
                      </div>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-black flex h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <div className="flex flex-col font-suit font-semibold justify-center text-[16px] text-center text-white whitespace-nowrap">
                        <p className="leading-[1.3]">{isSaving ? '저장 중...' : '저장'}</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      disabled={isSnsUser}
                      title={isSnsUser ? 'SNS 로그인 회원은 비밀번호 변경이 불가합니다.' : undefined}
                      className="bg-[#f9fafb] border border-[#e5e7eb] flex h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    >
                      <div className="flex flex-col font-suit font-normal justify-center text-[#6c6c6c] text-[16px] text-center whitespace-nowrap">
                        <p className="leading-[1.3]">비밀번호 변경</p>
                      </div>
                    </button>
                    <button
                      onClick={handleEdit}
                      className="bg-black flex h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity"
                    >
                      <div className="flex flex-col font-suit font-semibold justify-center text-[16px] text-center text-white whitespace-nowrap">
                        <p className="leading-[1.3]">정보 수정</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[40px] items-start w-full">
              <div className="flex gap-[21px] items-center w-full">
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div className="flex flex-1 flex-col gap-[4px] h-full items-start">
                    <div className="flex gap-[4px] items-start w-full">
                      <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        이름
                      </label>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      {isEditing ? (
                        <div 
                          className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                          style={{
                            display: 'flex',
                            height: '48px',
                            padding: '16px 4px',
                            alignItems: 'center',
                            gap: '10px',
                            alignSelf: 'stretch',
                            borderBottom: '1px solid #BAC2D0',
                            backgroundColor: 'transparent',
                            background: 'transparent',
                          }}
                        >
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5] bg-transparent border-none outline-none"
                            style={{
                              color: '#4B5563',
                              fontFamily: 'SUIT',
                              fontSize: '18px',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '150%',
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                          style={{
                            display: 'flex',
                            height: '48px',
                            padding: '16px 4px',
                            alignItems: 'center',
                            gap: '10px',
                            alignSelf: 'stretch',
                            borderBottom: '1px solid #BAC2D0',
                            backgroundColor: 'transparent',
                            background: 'transparent',
                          }}
                        >
                          <p 
                            className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5]"
                            style={{
                              color: '#4B5563',
                              fontFamily: 'SUIT',
                              fontSize: '18px',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '150%',
                            }}
                          >
                            {name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div className="flex flex-1 flex-col gap-[4px] h-full items-start">
                    <div className="flex gap-[4px] items-start w-full">
                      <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        이메일
                      </label>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <div
                        className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                        style={{
                          display: 'flex',
                          height: '48px',
                          padding: '16px 4px',
                          alignItems: 'center',
                          gap: '10px',
                          alignSelf: 'stretch',
                          borderBottom: '1px solid #BAC2D0',
                          backgroundColor: 'transparent',
                          background: 'transparent',
                        }}
                      >
                        <p
                          className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5]"
                          style={{
                            color: '#4B5563',
                            fontFamily: 'SUIT',
                            fontSize: '18px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                          }}
                        >
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-[21px] items-center w-full">
                <div className="flex flex-1 flex-col gap-[4px] items-start">
                  <div className="flex gap-[4px] items-start w-full">
                    <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                      전화번호
                    </label>
                  </div>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    {isEditing ? (
                      <div 
                        className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                        style={{
                          display: 'flex',
                          height: '48px',
                          padding: '16px 4px',
                          alignItems: 'center',
                          gap: '10px',
                          alignSelf: 'stretch',
                          borderBottom: '1px solid #BAC2D0',
                          backgroundColor: 'transparent',
                          background: 'transparent',
                        }}
                      >
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                          maxLength={13}
                          className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5] bg-transparent border-none outline-none"
                          style={{
                            color: '#4B5563',
                            fontFamily: 'SUIT',
                            fontSize: '18px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                        style={{
                          display: 'flex',
                          height: '48px',
                          padding: '16px 4px',
                          alignItems: 'center',
                          gap: '10px',
                          alignSelf: 'stretch',
                          borderBottom: '1px solid #BAC2D0',
                          backgroundColor: 'transparent',
                          background: 'transparent',
                        }}
                      >
                        <p 
                          className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5]"
                          style={{
                            color: '#4B5563',
                            fontFamily: 'SUIT',
                            fontSize: '18px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                          }}
                        >
                          {phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div className="flex flex-1 flex-col gap-[4px] h-full items-start">
                    <div className="flex gap-[4px] items-start w-full">
                      <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        가입일
                      </label>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <div 
                        className="flex h-[48px] items-center gap-[10px] py-[16px] px-[4px] border-b border-[#BAC2D0] w-full self-stretch bg-transparent"
                        style={{
                          display: 'flex',
                          height: '48px',
                          padding: '16px 4px',
                          alignItems: 'center',
                          gap: '10px',
                          alignSelf: 'stretch',
                          borderBottom: '1px solid #BAC2D0',
                          backgroundColor: 'transparent',
                          background: 'transparent',
                        }}
                      >
                        <p 
                          className="flex-1 font-suit font-normal text-[18px] text-[#4B5563] leading-[1.5]"
                          style={{
                            color: '#4B5563',
                            fontFamily: 'SUIT',
                            fontSize: '18px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                          }}
                        >
                          {joinDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex flex-col font-suit font-normal justify-center text-[18px] text-[#4b5563] underline decoration-solid hover:opacity-80 transition-opacity"
            >
              <p className="leading-[1.5]">로그아웃</p>
            </button>
          </div>
        </div>
      </div>

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />

      <AlertModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="회원정보가 안전하게 수정되었습니다."
      />
    </div>
  );
}
