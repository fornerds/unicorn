/**
 * 쿠키 기반 인증 유틸리티
 * 토큰은 서버가 Set-Cookie로 관리하며, 클라이언트에서 직접 접근하지 않음
 */

/**
 * 쿠키에서 특정 값 읽기 (httpOnly가 아닌 쿠키만 가능)
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * 클라이언트 쿠키 제거 (httpOnly가 아닌 쿠키)
 */
export const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
