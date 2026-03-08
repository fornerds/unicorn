import { paths } from './paths';

export const sitemap = [
  { name: '대시보드', path: paths.dashboard },
  { name: '회원 관리', path: paths.users },
  { name: '카테고리', path: paths.categories },
  { name: '제품 관리', path: paths.products },
  { name: '주문 관리', path: paths.orders },
  { name: '문의 관리', path: paths.inquiries },
  { name: '뉴스 관리', path: paths.news },
  { name: '태그 관리', path: paths.tags },
  { name: '기분 질문', path: paths.moodQuestions },
  { name: '설정', path: paths.settings },
] as const;

export function getPageTitle(pathname: string): string {
  const item = sitemap.find((n) => n.path === pathname);
  return item?.name ?? '관리자';
}
