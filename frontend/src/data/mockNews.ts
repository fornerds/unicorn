export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  tags: string[];
  views: number;
  likes: number;
  content?: string;
}

export const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: '가정용 청소 로봇\n\'CleanBot X\' 사전예약 시작',
    description:
      'AI 기반 자율 청소 로봇 CleanBot X가 정식 출시를 앞두고 사전예약을 시작했습니다. 실시간 환경 인식 기술과 강력한 흡입력을 자랑하는 차세대 청소 로봇입니다.',
    date: '2026-01-03',
    imageUrl: '/images/NEWS01.png',
    tags: ['자율주행', 'AI'],
    views: 1520,
    likes: 89,
  },
  {
    id: '2',
    title: '산업용 자동화 시스템\n\'FactoryBot Pro\' 공개',
    description:
      '대규모 물류 창고를 위한 자동화 시스템 FactoryBot Pro가 공개되었습니다. 다중 로봇 협업 시스템으로 효율성을 극대화했습니다.',
    date: '2026-01-02',
    imageUrl: '/images/NEWS02.png',
    tags: ['자율주행', 'AI'],
    views: 2340,
    likes: 156,
  },
  {
    id: '3',
    title: '친환경 에너지 관리\n로봇 \'EcoBot\' 출시',
    description:
      '스마트 홈 에너지 관리를 위한 EcoBot이 출시되었습니다. 실시간 전력 모니터링과 최적화 기능을 제공합니다.',
    date: '2026-01-01',
    imageUrl: '/images/NEWS03.png',
    tags: ['AI'],
    views: 980,
    likes: 67,
  },
  {
    id: '4',
    title: '의료용 수술 로봇\n\'MediBot\' 정밀도 향상',
    description:
      '정밀도 99.9%를 자랑하는 차세대 의료용 수술 로봇이 출시되었습니다. AI 기반 실시간 분석 시스템과 3D 영상 기술을 탑재하여 더욱 안전하고 정확한 수술을 지원합니다.',
    date: '2025-12-30',
    imageUrl: '/images/NEWS04.png',
    tags: ['AI', '의료'],
    views: 3450,
    likes: 234,
  },
  {
    id: '5',
    title: '물류 창고 자동화\n시스템 대규모 도입',
    description:
      '국내 주요 물류 기업들이 자동화 시스템을 대규모로 도입하기 시작했습니다. 인력 부족 문제 해결과 효율성 향상을 기대하고 있습니다.',
    date: '2025-12-29',
    imageUrl: '/images/NEWS05.png',
    tags: ['자율주행'],
    views: 1890,
    likes: 123,
  },
  {
    id: '6',
    title: '로봇 기술 컨퍼런스\n\'RoboTech 2026\' 개최',
    description:
      '글로벌 로봇 기술 컨퍼런스 RoboTech 2026이 성황리에 개최되었습니다. 최신 기술 트렌드와 미래 전망을 공유했습니다.',
    date: '2025-12-28',
    imageUrl: '/images/NEWS06.png',
    tags: ['AI', '휴머노이드'],
    views: 2760,
    likes: 198,
  },
  {
    id: '7',
    title: '스마트 홈 로봇\n\'HomeBot\' 신제품 출시',
    description:
      '일상 생활을 편리하게 만들어주는 스마트 홈 로봇 HomeBot이 새롭게 출시되었습니다. 음성 인식과 자율 학습 기능을 강화했습니다.',
    date: '2025-12-27',
    imageUrl: '/images/NEWS07.png',
    tags: ['AI', '자율주행'],
    views: 1450,
    likes: 92,
  },
  {
    id: '8',
    title: '산업용 로봇 팔\n정밀도 개선 발표',
    description:
      '산업용 로봇 팔의 정밀도가 크게 개선되었습니다. 마이크로미터 단위의 정밀한 작업이 가능해져 제조업 효율성이 향상될 것으로 예상됩니다.',
    date: '2025-12-26',
    imageUrl: '/images/NEWS08.png',
    tags: ['AI'],
    views: 2100,
    likes: 145,
  },
  {
    id: '9',
    title: '휴머노이드 로봇\n\'HumanBot\' 프로토타입 공개',
    description:
      '인간과 유사한 움직임을 구현한 휴머노이드 로봇 HumanBot의 프로토타입이 공개되었습니다. 다양한 서비스 분야에서 활용될 예정입니다.',
    date: '2025-12-25',
    imageUrl: '/images/NEWS09.png',
    tags: ['휴머노이드', 'AI'],
    views: 3890,
    likes: 267,
  },
  {
    id: '10',
    title: '로봇 교육 플랫폼\n\'EduBot\' 런칭',
    description:
      '로봇 프로그래밍 교육을 위한 플랫폼 EduBot이 정식 런칭되었습니다. 초보자부터 전문가까지 단계별 학습이 가능합니다.',
    date: '2025-12-24',
    imageUrl: '/images/NEWS01.png',
    tags: ['AI', '교육'],
    views: 1200,
    likes: 78,
  },
  {
    id: '11',
    title: '자율주행 배송 로봇\n실제 도로 테스트 성공',
    description:
      '자율주행 배송 로봇이 실제 도로 환경에서의 테스트를 성공적으로 완료했습니다. 안전성과 신뢰성을 입증했습니다.',
    date: '2025-12-23',
    imageUrl: '/images/NEWS02.png',
    tags: ['자율주행', 'AI'],
    views: 2980,
    likes: 201,
  },
  {
    id: '12',
    title: '로봇 보안 시스템\n강화 방안 발표',
    description:
      '로봇 보안 시스템 강화 방안이 발표되었습니다. 사이버 공격으로부터 로봇 시스템을 보호하기 위한 새로운 기술이 적용됩니다.',
    date: '2025-12-22',
    imageUrl: '/images/NEWS03.png',
    tags: ['AI', '보안'],
    views: 1650,
    likes: 112,
  },
  {
    id: '13',
    title: '의료진 보조 로봇\n병원 도입 확대',
    description:
      '의료진을 보조하는 로봇 시스템이 전국 병원에 확대 도입되고 있습니다. 업무 효율성 향상과 환자 안전 강화에 기여하고 있습니다.',
    date: '2025-12-21',
    imageUrl: '/images/NEWS04.png',
    tags: ['의료', 'AI'],
    views: 2230,
    likes: 156,
  },
  {
    id: '14',
    title: '로봇 산업 생태계\n성장세 지속',
    description:
      '로봇 산업 생태계가 지속적인 성장세를 보이고 있습니다. 다양한 분야에서 로봇 기술의 활용이 확대되고 있습니다.',
    date: '2025-12-20',
    imageUrl: '/images/NEWS05.png',
    tags: ['AI'],
    views: 1780,
    likes: 124,
  },
  {
    id: '15',
    title: '스마트 팩토리 구축\n로봇 솔루션 제공',
    description:
      '스마트 팩토리 구축을 위한 종합 로봇 솔루션이 제공되고 있습니다. 제조업의 디지털 전환을 지원합니다.',
    date: '2025-12-19',
    imageUrl: '/images/NEWS06.png',
    tags: ['AI', '자율주행'],
    views: 2560,
    likes: 189,
  },
  {
    id: '16',
    title: '로봇 케어 서비스\n노인 복지 시설 도입',
    description:
      '노인 복지 시설에 로봇 케어 서비스가 도입되었습니다. 일상 생활 지원과 건강 모니터링 기능을 제공합니다.',
    date: '2025-12-18',
    imageUrl: '/images/NEWS07.png',
    tags: ['AI', '케어'],
    views: 3120,
    likes: 223,
  },
  {
    id: '17',
    title: '로봇 개발 플랫폼\n오픈소스 공개',
    description:
      '로봇 개발을 위한 오픈소스 플랫폼이 공개되었습니다. 개발자들이 쉽게 접근할 수 있는 환경을 제공합니다.',
    date: '2025-12-17',
    imageUrl: '/images/NEWS08.png',
    tags: ['AI', '개발'],
    views: 1980,
    likes: 134,
  },
  {
    id: '18',
    title: '휴머노이드 로봇\n감정 인식 기술 개발',
    description:
      '휴머노이드 로봇의 감정 인식 기술이 개발되었습니다. 인간의 감정을 이해하고 적절히 반응할 수 있는 로봇이 등장했습니다.',
    date: '2025-12-16',
    imageUrl: '/images/NEWS09.png',
    tags: ['휴머노이드', 'AI'],
    views: 3450,
    likes: 245,
  },
  {
    id: '19',
    title: '로봇 안전 표준\n국제 규격 제정',
    description:
      '로봇 안전에 관한 국제 표준 규격이 제정되었습니다. 전 세계적으로 통일된 안전 기준이 적용됩니다.',
    date: '2025-12-15',
    imageUrl: '/images/NEWS01.png',
    tags: ['안전', '규격'],
    views: 1670,
    likes: 98,
  },
  {
    id: '20',
    title: '로봇 시장 전망\n2030년 급성장 예상',
    description:
      '로봇 시장이 2030년까지 급성장할 것으로 전망됩니다. 다양한 산업 분야에서 로봇 기술의 활용이 확대될 예정입니다.',
    date: '2025-12-14',
    imageUrl: '/images/NEWS02.png',
    tags: ['AI', '시장'],
    views: 2890,
    likes: 201,
  },
  {
    id: '21',
    title: '자율주행 로봇\n도심 배포 시작',
    description:
      '자율주행 로봇이 도심 지역에 배포되기 시작했습니다. 배송과 안내 서비스를 제공합니다.',
    date: '2025-12-13',
    imageUrl: '/images/NEWS03.png',
    tags: ['자율주행', 'AI'],
    views: 2340,
    likes: 167,
  },
  {
    id: '22',
    title: '의료 로봇 기술\n국제 인증 획득',
    description:
      '의료 로봇 기술이 국제 인증을 획득했습니다. 전 세계 의료 기관에서 활용될 수 있는 인증을 받았습니다.',
    date: '2025-12-12',
    imageUrl: '/images/NEWS04.png',
    tags: ['의료', 'AI'],
    views: 2780,
    likes: 198,
  },
  {
    id: '23',
    title: '로봇 학습 알고리즘\n성능 개선 발표',
    description:
      '로봇 학습 알고리즘의 성능이 크게 개선되었습니다. 더 빠르고 정확한 학습이 가능해졌습니다.',
    date: '2025-12-11',
    imageUrl: '/images/NEWS05.png',
    tags: ['AI', '학습'],
    views: 1890,
    likes: 134,
  },
  {
    id: '24',
    title: '스마트 시티 구축\n로봇 인프라 확대',
    description:
      '스마트 시티 구축을 위한 로봇 인프라가 확대되고 있습니다. 도시 생활의 편의성을 높이는 다양한 서비스가 제공됩니다.',
    date: '2025-12-10',
    imageUrl: '/images/NEWS06.png',
    tags: ['AI', '스마트시티'],
    views: 3120,
    likes: 223,
  },
  {
    id: '25',
    title: '로봇 제조 공정\n자동화 완성',
    description:
      '로봇 제조 공정의 완전 자동화가 완성되었습니다. 생산 효율성과 품질이 크게 향상되었습니다.',
    date: '2025-12-09',
    imageUrl: '/images/NEWS07.png',
    tags: ['자율주행', '제조'],
    views: 2450,
    likes: 178,
  },
  {
    id: '26',
    title: '로봇 교육 프로그램\n전국 확대',
    description:
      '로봇 교육 프로그램이 전국으로 확대되었습니다. 초중고 학생들을 대상으로 로봇 교육이 제공됩니다.',
    date: '2025-12-08',
    imageUrl: '/images/NEWS08.png',
    tags: ['교육', 'AI'],
    views: 1980,
    likes: 145,
  },
  {
    id: '27',
    title: '휴머노이드 로봇\n언어 학습 기능 추가',
    description:
      '휴머노이드 로봇에 다국어 학습 기능이 추가되었습니다. 다양한 언어로 대화할 수 있는 능력을 갖추게 되었습니다.',
    date: '2025-12-07',
    imageUrl: '/images/NEWS09.png',
    tags: ['휴머노이드', 'AI'],
    views: 2670,
    likes: 189,
  },
  {
    id: '28',
    title: '로봇 보안 솔루션\n신제품 출시',
    description:
      '로봇 보안을 강화하는 새로운 솔루션이 출시되었습니다. 사이버 공격으로부터 로봇을 보호하는 기술이 적용되었습니다.',
    date: '2025-12-06',
    imageUrl: '/images/NEWS01.png',
    tags: ['보안', 'AI'],
    views: 1780,
    likes: 123,
  },
  {
    id: '29',
    title: '의료 로봇 수술\n성공률 99% 달성',
    description:
      '의료 로봇 수술의 성공률이 99%에 달했습니다. 정밀도와 안전성이 크게 향상되었습니다.',
    date: '2025-12-05',
    imageUrl: '/images/NEWS02.png',
    tags: ['의료', 'AI'],
    views: 3450,
    likes: 256,
  },
  {
    id: '30',
    title: '로봇 산업 투자\n글로벌 확대',
    description:
      '로봇 산업에 대한 글로벌 투자가 확대되고 있습니다. 다양한 벤처 캐피털과 기업들이 로봇 기술에 투자하고 있습니다.',
    date: '2025-12-04',
    imageUrl: '/images/NEWS03.png',
    tags: ['AI', '투자'],
    views: 2230,
    likes: 167,
  },
  {
    id: '31',
    title: '자율주행 로봇\n야간 운행 테스트',
    description:
      '자율주행 로봇의 야간 운행 테스트가 성공적으로 완료되었습니다. 어두운 환경에서도 안전하게 작동하는 것을 확인했습니다.',
    date: '2025-12-03',
    imageUrl: '/images/NEWS04.png',
    tags: ['자율주행', 'AI'],
    views: 2890,
    likes: 201,
  },
  {
    id: '32',
    title: '로봇 기술 혁신\n미래 전망 발표',
    description:
      '로봇 기술의 혁신과 미래 전망이 발표되었습니다. 2030년까지 로봇 기술이 급속도로 발전할 것으로 예상됩니다.',
    date: '2025-12-02',
    imageUrl: '/images/NEWS05.png',
    tags: ['AI', '미래'],
    views: 3120,
    likes: 234,
  },
];
