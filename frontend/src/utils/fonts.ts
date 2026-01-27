/**
 * 폰트 관련 유틸리티 함수
 */

/**
 * EliceDXNeolliOTF 폰트 클래스 반환
 */
export const getEliceFontClass = (weight: 'light' | 'medium' | 'bold' = 'medium'): string => {
  const weightMap = {
    light: 'font-elice font-light',
    medium: 'font-elice font-normal',
    bold: 'font-elice font-bold',
  };
  return weightMap[weight];
};

/**
 * SUIT 폰트 클래스 반환
 */
export const getSuitFontClass = (): string => {
  return 'font-suit';
};

/**
 * Cardo 폰트 클래스 반환
 */
export const getCardoFontClass = (): string => {
  return 'font-cardo';
};
