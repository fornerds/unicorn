'use client';

import { useState } from 'react';
import { EyeOffIcon, ViewIcon } from '@/components/ui/icons';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
}

export const PasswordChangeModal = ({ isOpen, onClose, onSave }: PasswordChangeModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateCurrentPassword = (value: string) => {
    if (!value) {
      return '현재 비밀번호를 입력해 주세요.';
    }
    return undefined;
  };

  const validateNewPassword = (value: string) => {
    if (!value) {
      return '변경할 비밀번호를 입력해 주세요.';
    } else if (value.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    return undefined;
  };

  const validateConfirmPassword = (value: string, newPwd: string) => {
    if (!value) {
      return '변경할 비밀번호 확인을 입력해 주세요.';
    } else if (newPwd && value !== newPwd) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return undefined;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      currentPassword: validateCurrentPassword(currentPassword),
      newPassword: validateNewPassword(newPassword),
      confirmPassword: validateConfirmPassword(confirmPassword, newPassword),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await onSave(currentPassword, newPassword, confirmPassword);
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes('현재 비밀번호')) {
        setErrors({ currentPassword: error.message || '현재 비밀번호가 올바르지 않습니다.' });
      } else {
        setErrors({ currentPassword: error.message || '비밀번호 변경에 실패했습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCancel}>
      <div className="bg-white overflow-visible relative rounded-[30px] w-[620px] min-h-[600px] pb-[50px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="absolute flex flex-col font-suit font-semibold justify-center left-[43px] text-[#111827] text-[26px] top-[68px] whitespace-nowrap">
          <p className="leading-[36px]">비밀번호 변경</p>
        </div>

        {successMessage && (
          <div className="absolute top-[110px] left-[44px] w-[532px] bg-green-50 border border-green-200 rounded-[6px] p-[12px]">
            <p className="font-suit font-medium text-[14px] text-green-700 leading-[1.5]">
              {successMessage}
            </p>
          </div>
        )}

        <form id="password-change-form" onSubmit={handleSubmit} className="absolute flex flex-col gap-[50px] items-start left-[44px] top-[126px] w-[532px] pb-[120px]">
          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="flex gap-[2px] items-start w-full">
              <label className="font-suit font-bold text-[20px] text-[#374151] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                현재 비밀번호
              </label>
            </div>
            <div className="flex flex-col gap-[6px] items-start w-full">
              <div className={`bg-[#f9fafb] flex h-[48px] items-center justify-between p-[16px] rounded-[6px] w-full ${
                errors.currentPassword ? 'border border-red-300' : ''
              }`}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentPassword(value);
                    const error = validateCurrentPassword(value);
                    setErrors((prev) => ({ ...prev, currentPassword: error }));
                  }}
                  onBlur={() => {
                    const error = validateCurrentPassword(currentPassword);
                    setErrors((prev) => ({ ...prev, currentPassword: error }));
                  }}
                  placeholder="현재 비밀번호를 입력해 주세요."
                  className={`flex-1 font-suit font-semibold text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                    currentPassword ? 'text-[#161616]' : 'text-[#bac2d0]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px] ml-[8px]"
                  aria-label={showCurrentPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showCurrentPassword ? (
                    <ViewIcon width={20} height={20} stroke="#bac2d0" />
                  ) : (
                    <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="font-suit font-medium text-[14px] text-red-600 leading-[1.5]">
                  {errors.currentPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-start w-full">
            <div className="flex flex-col gap-[8px] items-start w-full">
              <div className="flex gap-[2px] items-start w-full">
                <label className="font-suit font-bold text-[20px] text-[#374151] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                  변경할 비밀번호
                </label>
              </div>
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className={`bg-[#f9fafb] flex h-[48px] items-center justify-between p-[16px] rounded-[6px] w-full ${
                  errors.newPassword ? 'border border-red-300' : ''
                }`}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewPassword(value);
                      const error = validateNewPassword(value);
                      setErrors((prev) => ({ ...prev, newPassword: error }));
                      // 새 비밀번호가 변경되면 확인 비밀번호도 다시 검증
                      if (confirmPassword) {
                        const confirmError = validateConfirmPassword(confirmPassword, value);
                        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                      }
                    }}
                    onBlur={() => {
                      const error = validateNewPassword(newPassword);
                      setErrors((prev) => ({ ...prev, newPassword: error }));
                    }}
                    placeholder="변경할 비밀번호를 입력해 주세요."
                    className={`flex-1 font-suit font-semibold text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                      newPassword ? 'text-[#161616]' : 'text-[#bac2d0]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px] ml-[8px]"
                    aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showNewPassword ? (
                      <ViewIcon width={20} height={20} stroke="#bac2d0" />
                    ) : (
                      <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="font-suit font-medium text-[14px] text-red-600 leading-[1.5]">
                    {errors.newPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[8px] items-start w-full">
              <div className="flex gap-[2px] items-start w-full">
                <label className="font-suit font-bold text-[20px] text-[#374151] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                  변경할 비밀번호 확인
                </label>
              </div>
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className={`bg-[#f9fafb] flex h-[48px] items-center justify-between p-[16px] rounded-[6px] w-full ${
                  errors.confirmPassword ? 'border border-red-300' : ''
                }`}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                      const error = validateConfirmPassword(value, newPassword);
                      setErrors((prev) => ({ ...prev, confirmPassword: error }));
                    }}
                    onBlur={() => {
                      const error = validateConfirmPassword(confirmPassword, newPassword);
                      setErrors((prev) => ({ ...prev, confirmPassword: error }));
                    }}
                    placeholder="변경할 비밀번호를 다시 입력해 주세요."
                    className={`flex-1 font-suit font-semibold text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                      confirmPassword ? 'text-[#161616]' : 'text-[#bac2d0]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px] ml-[8px]"
                    aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                  >
                    {showConfirmPassword ? (
                      <ViewIcon width={20} height={20} stroke="#bac2d0" />
                    ) : (
                      <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="font-suit font-medium text-[14px] text-red-600 leading-[1.5]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="absolute bottom-[50px] flex gap-[12px] items-center left-[44px] w-[532px]">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] flex flex-1 h-[54px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col font-suit font-medium justify-center text-[#6c6c6c] text-[20px] text-center whitespace-nowrap">
              <p className="leading-[1.3]">취소</p>
            </div>
          </button>
          <button
            type="submit"
            form="password-change-form"
            disabled={isLoading}
            className="bg-black flex flex-1 h-[54px] items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col font-suit font-bold justify-center text-[20px] text-center text-white whitespace-nowrap">
              <p className="leading-[1.3]">저장</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
