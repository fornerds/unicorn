'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { PasswordChangeModal } from '@/components/ui/PasswordChangeModal';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [name, setName] = useState('김철수');
  const [email, setEmail] = useState('cheon@gmail.com');
  const [phone, setPhone] = useState('010-1234-5678');
  const [joinDate] = useState('2024-01-15');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Save profile:', { name, email, phone });
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    console.log('Password change:', { currentPassword, newPassword, confirmPassword });
    
    // TODO: 실제 API 호출로 대체
    // 예시: 현재 비밀번호가 틀렸을 때
    // if (currentPassword !== 'correct-password') {
    //   throw new Error('현재 비밀번호가 올바르지 않습니다.');
    // }
    
    // 성공 시 아무것도 반환하지 않음 (모달에서 성공 메시지 표시)
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[36px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[275px]">
            <div className="flex flex-col font-suit font-extralight justify-center text-[60px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap">Mypage</p>
            </div>
            <div className="flex flex-col font-suit font-light justify-center text-[30px] w-full">
              <p className="leading-[1.35] whitespace-pre-wrap">마이페이지</p>
            </div>
          </div>

          <div className="flex flex-col gap-[60px] items-start w-[727px]">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col font-elice font-light justify-center text-[#111827] text-[26px] w-[191px]">
                <p className="leading-[36px] whitespace-pre-wrap">프로필 정보</p>
              </div>
              <div className="flex gap-[12px] items-center w-[235px]">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="bg-[#f9fafb] border border-[#e5e7eb] flex flex-1 h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity"
                >
                  <div className="flex flex-col font-suit font-medium justify-center text-[#6c6c6c] text-[16px] text-center whitespace-nowrap">
                    <p className="leading-[1.3]">비밀번호 변경</p>
                  </div>
                </button>
                <button
                  onClick={isEditing ? handleSave : handleEdit}
                  className="bg-black flex flex-1 h-[40px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity"
                >
                  <div className="flex flex-col font-suit font-bold justify-center text-[16px] text-center text-white whitespace-nowrap">
                    <p className="leading-[1.3]">{isEditing ? '저장' : '정보 수정'}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[40px] items-start w-full">
              <div className="flex gap-[21px] items-center w-full">
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div className="flex flex-1 flex-col gap-[4px] h-full items-start">
                    <div className="flex gap-[4px] items-start w-full">
                      <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        이름
                      </label>
                      <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                        *
                      </span>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      {isEditing ? (
                        <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none ${
                              name ? 'text-[#161616]' : 'text-[#bac2d0]'
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
                          <p className="flex-1 font-suit font-regular text-[16px] text-[#bac2d0] leading-[1.35]">
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
                      <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        이메일
                      </label>
                      <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                        *
                      </span>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      {isEditing ? (
                        <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none ${
                              email ? 'text-[#161616]' : 'text-[#bac2d0]'
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
                          <p className="flex-1 font-suit font-regular text-[16px] text-[#bac2d0] leading-[1.35]">
                            {email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-[21px] items-center w-full">
                <div className="flex flex-1 flex-col gap-[4px] items-start">
                  <div className="flex gap-[4px] items-start w-full">
                    <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                      전화번호
                    </label>
                    <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                      *
                    </span>
                  </div>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    {isEditing ? (
                      <div className="flex h-[48px] items-center pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none ${
                            phone ? 'text-[#161616]' : 'text-[#bac2d0]'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
                        <p className="flex-1 font-suit font-regular text-[16px] text-[#bac2d0] leading-[1.35]">
                          {phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div className="flex flex-1 flex-col gap-[4px] h-full items-start">
                    <div className="flex gap-[4px] items-start w-full">
                      <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                        가입일
                      </label>
                      <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                        *
                      </span>
                    </div>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
                        <p className="flex-1 font-suit font-regular text-[16px] text-[#bac2d0] leading-[1.35]">
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
              className="flex flex-col font-suit font-medium justify-center text-[18px] text-[#4b5563] underline decoration-solid hover:opacity-80 transition-opacity"
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
    </div>
  );
}
