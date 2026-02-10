import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { NewsCard } from '@/components/features/news/NewsCard';
import { mockNewsData } from '@/data/mockNews';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';

export async function generateStaticParams() {
  return mockNewsData.map((news) => ({
    id: news.id,
  }));
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const newsId = params.id;

  const news = mockNewsData.find((item) => item.id === newsId);

  if (!news) {
    notFound();
  }

  const relatedNews = mockNewsData
    .filter((item) => item.id !== newsId)
    .slice(0, 4);

  const defaultContent = `정밀도 99.9%를 자랑하는 차세대 의료용 수술 로봇이 출시되었습니다. AI 기반 실시간 분석 시스템과 3D 영상 기술을 탑재하여 더욱 안전하고 정확한 수술을 지원합니다. Unicorn은 지속적인 기술 혁신을 통해 로봇 산업의 새로운 기준을 제시하고 있습니다. 이번 발표는 우리의 기술력과 비전을 다시 한번 입증하는 중요한 이정표가 될 것입니다.

최첨단 AI 기술과 정밀 제어 시스템을 결합하여 개발된 이 솔루션은 산업 현장의 생산성과 안전성을 동시에 향상시킬 수 있는 혁신적인 기술입니다. 특히 실시간 데이터 분석과 자율 학습 기능을 통해 지속적으로 성능이 개선됩니다. Unicorn의 연구개발팀은 앞으로도 고객의 니즈를 반영한 혁신적인 제품과 서비스를 지속적으로 선보일 예정입니다. 로봇 기술의 미래를 함께 만들어가겠습니다. 이번 발표를 시작으로 다양한 산업 분야로의 확대 적용을 계획하고 있습니다. 특히 의료, 물류, 제조 등 핵심 산업 분야에서의 실증 테스트를 진행하며, 고객 피드백을 적극 반영하여 제품을 고도화할 예정입니다.

정밀도 99.9%를 자랑하는 차세대 의료용 수술 로봇이 출시되었습니다. AI 기반 실시간 분석 시스템과 3D 영상 기술을 탑재하여 더욱 안전하고 정확한 수술을 지원합니다. Unicorn은 지속적인 기술 혁신을 통해 로봇 산업의 새로운 기준을 제시하고 있습니다. 이번 발표는 우리의 기술력과 비전을 다시 한번 입증하는 중요한 이정표가 될 것입니다.

최첨단 AI 기술과 정밀 제어 시스템을 결합하여 개발된 이 솔루션은 산업 현장의 생산성과 안전성을 동시에 향상시킬 수 있는 혁신적인 기술입니다. 특히 실시간 데이터 분석과 자율 학습 기능을 통해 지속적으로 성능이 개선됩니다. Unicorn의 연구개발팀은 앞으로도 고객의 니즈를 반영한 혁신적인 제품과 서비스를 지속적으로 선보일 예정입니다. 로봇 기술의 미래를 함께 만들어가겠습니다. 이번 발표를 시작으로 다양한 산업 분야로의 확대 적용을 계획하고 있습니다. 특히 의료, 물류, 제조 등 핵심 산업 분야에서의 실증 테스트를 진행하며, 고객 피드백을 적극 반영하여 제품을 고도화할 예정입니다. 정밀도 99.9%를 자랑하는 차세대 의료용 수술 로봇이 출시되었습니다. AI 기반 실시간 분석 시스템과 3D 영상 기술을 탑재하여 더욱 안전하고 정확한 수술을 지원합니다. Unicorn은 지속적인 기술 혁신을 통해 로봇 산업의 새로운 기준을 제시하고 있습니다. 이번 발표는 우리의 기술력과 비전을 다시 한번 입증하는 중요한 이정표가 될 것입니다.`;

  const content = news.content || defaultContent;

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[188px] items-center pb-[75px] pt-[100px] w-full max-w-[1167px] mx-auto">
        <div className="flex flex-col gap-[45px] items-start w-full max-w-[1167px]">
          <div className="flex flex-col gap-[15px] items-start w-full">
            <div className="flex items-center w-full">
              <Link
                href={ROUTES.NEWS}
                className="flex gap-[1.5px] items-center hover:opacity-80 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M19 11.9998L5 11.9998M5 11.9998L10.125 17.25M5 11.9998L10.125 6.75"
                    stroke="#374151"
                    strokeWidth="1.125"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-suit font-medium ml-[6px] text-[15px] leading-[1.45] text-[#1f2937] whitespace-nowrap">
                  뉴스 목록으로
                </p>
              </Link>
            </div>
            <div className="h-[599.25px] relative rounded-[9px] w-full overflow-hidden">
              <Image
                src={withBasePath(news.imageUrl)}
                alt={news.title}
                fill
                className="object-cover rounded-[9px]"
                unoptimized
              />
            </div>
          </div>

          <div className="flex items-start justify-between px-[3px] w-full">
            <div className="flex flex-col gap-[15px] items-start shrink-0">
              <div className="flex flex-col font-suit font-semibold leading-[1.5] text-[24px] text-[#1f2937]">
                {news.title.split('\n').map((line, index) => (
                  <p key={index} className="mb-0">
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex font-suit font-medium gap-[19.5px] items-center leading-[1.5] text-[15px] text-[#6b7280] w-full">
                <p className="leading-[1.5] whitespace-nowrap">{news.date}</p>
                <p className="leading-[1.5] whitespace-nowrap">조회수 {news.views}</p>
              </div>
            </div>

            <div className="flex flex-col gap-[58.5px] items-start text-[18px] w-[772.5px]">
              <div className="font-suit font-normal leading-[1.7] min-w-full text-[#374151] whitespace-pre-wrap">
                {content.split('\n').map((paragraph, index) => (
                  <p key={index} className={paragraph.trim() === '' ? 'mb-0' : 'mb-0'}>
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>
              <div className="flex flex-col font-suit font-medium leading-[1.5] text-[18px] text-[#b5b8c0]">
                <p className="leading-[1.5] break-words">
                  {news.tags.map((tag) => `#${tag}`).join('  ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[15px] items-start w-full">
          <div className="flex items-end justify-between px-[1.5px] w-full">
            <div className="flex items-center justify-center px-[3px]">
              <h3 className="font-suit font-semibold leading-[1.5] text-[18px] text-[#374151] whitespace-nowrap">
                관련 아티클
              </h3>
            </div>
            <Link
              href={ROUTES.NEWS}
              className="flex flex-col font-suit font-medium leading-[1.5] text-[12px] text-[#959ba9] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              <p className="leading-[1.5]">더보기</p>
            </Link>
          </div>
          <div className="flex flex-wrap gap-[11px] items-start justify-between w-full max-w-[1167px]">
            {relatedNews.map((item) => (
              <div key={item.id} className="w-[283px]">
                <NewsCard news={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
