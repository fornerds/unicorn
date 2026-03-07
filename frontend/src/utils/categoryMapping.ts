/**
 * 카테고리 이름을 영문으로 매핑합니다
 */
export const categoryNameMap: Record<string, string> = {
  // 영문 대문자
  HOME: 'Home',
  FIREFIGHTING: 'Firefighting',
  INDUSTRIAL: 'Industrial',
  MEDICAL: 'Medical',
  LOGISTICS: 'Logistics',
  // 한글 대분류 매핑
  '가정용 로봇/가사 도우미': 'Home',
  '소방/구조 로봇': 'Firefighting',
  '화재진압/인명구조용 로봇': 'Firefighting',
  '산업용 로봇': 'Industrial',
  '위험 현장': 'Industrial',
  '의료/헬스케어 로봇': 'Medical',
  '단순 업무/환자케어 로봇': 'Medical',
  '물류/배송 로봇': 'Logistics',
  '분류/포장 로봇': 'Logistics',
  // 간단 한글 매핑
  홈: 'Home',
  가정용: 'Home',
  소방: 'Firefighting',
  산업: 'Industrial',
  산업용: 'Industrial',
  의료: 'Medical',
  물류: 'Logistics',
};

/**
 * 카테고리 이름을 영문으로 변환합니다
 * @param name 카테고리 이름 (한글 또는 영문)
 * @returns 영문 표기 (첫 글자만 대문자)
 */
export function getCategoryDisplayName(name: string): string {
  // 정확히 일치하는 것 먼저 찾기
  if (categoryNameMap[name]) {
    return categoryNameMap[name];
  }
  // 대문자 변환해서 찾기 (영문의 경우)
  if (categoryNameMap[name.toUpperCase()]) {
    return categoryNameMap[name.toUpperCase()];
  }
  // 매핑이 없으면 원본 반환
  return name;
}
