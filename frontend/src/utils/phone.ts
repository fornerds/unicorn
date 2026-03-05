/**
 * 전화번호 자동 포맷팅 (한국 번호)
 * 010-1234-5678, 02-123-4567, 031-123-4567 등
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  // 02 지역번호 (서울)
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // 010, 011, 031 등 3자리 지역/이동통신 번호
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

/**
 * 포맷된 전화번호에서 숫자만 추출 (API 전송용)
 */
export function stripPhoneFormat(value: string): string {
  return value.replace(/\D/g, '');
}
