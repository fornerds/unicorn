-- prod 전용: 최소한의 insert 만 (MySQL 데이터 디렉터리가 비어 있을 때만 실행됨)
-- 비밀번호는 배포 후 반드시 변경하세요. (아래는 password 의 BCrypt 해시)

SET NAMES utf8mb4;

INSERT IGNORE INTO users (id, email, password_hash, name, status, role, created_at, updated_at) VALUES
(1, 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '관리자', 'active', 'ADMIN', NOW(), NOW());

INSERT IGNORE INTO categories (id, parent_id, name, slug, sort_order, created_at, updated_at) VALUES
(1, NULL, '휴머노이드 로봇', 'humanoid', 1, NOW(), NOW()),
(2, NULL, '논휴머노이드 로봇', 'non-humanoid', 2, NOW(), NOW());

-- 가격·통화: DB에는 USD 저장. API 응답 시 환율 적용해 원화로 전달.
INSERT IGNORE INTO products (id, category_id, name, short_description, ai_summary, content, price, currency, stock, weight, total_height, operating_time, battery, speed, created_at, updated_at) VALUES
(1, 1, '1X Technologies NEO', '가정용 휴머노이드 167cm 30kg. $20,000 또는 월 $499 리스.', '1X NEO. 가정용 휴머노이드. $20,000 또는 월 $499. https://www.1x.tech/neo', '<p><a href="https://www.1x.tech/neo" target="_blank" rel="noopener">공식</a>. $20,000 / 월 $499 리스.</p>', 20000.00, 'USD', 0, '30kg', '167cm', NULL, NULL, NULL, NOW(), NOW()),
(2, 1, 'Unitree G1', '127cm 35kg 휴머노이드. Basic $19,995~$21,600, EDU $43,500~.', 'Unitree G1. 휴머노이드. $19,995~$21,600. https://www.unitree.com/', '<p><a href="https://www.unitree.com/g1" target="_blank" rel="noopener">공식</a>. $19,995~.</p>', 19995.00, 'USD', 3, '35kg', '127cm', NULL, NULL, NULL, NOW(), NOW()),
(3, 1, 'Unitree H1', '180cm 대형 휴머노이드. $90,000.', 'Unitree H1. 휴머노이드. $90,000. https://www.unitree.com/', '<p><a href="https://www.unitree.com/" target="_blank" rel="noopener">공식</a>. $90,000.</p>', 90000.00, 'USD', 2, NULL, '180cm', NULL, NULL, NULL, NOW(), NOW()),
(4, 1, 'Figure 03', 'Figure AI 휴머노이드. 소비자 $20,000, 상용 $130,000.', 'Figure 03. 휴머노이드. $20,000~$130,000. https://www.figure.ai/', '<p><a href="https://www.figure.ai/" target="_blank" rel="noopener">공식</a> / <a href="https://www.figure.ai/figure" target="_blank" rel="noopener">제품</a>.</p>', 20000.00, 'USD', 0, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(5, 1, 'Agility Robotics DIGIT', '물류 휴머노이드 175cm 64kg. $250,000.', 'Agility DIGIT. 휴머노이드 물류. $250,000. https://www.agilityrobotics.com/', '<p><a href="https://www.agilityrobotics.com/" target="_blank" rel="noopener">공식</a>. $250,000~.</p>', 250000.00, 'USD', 2, '64kg', '175cm', '8시간', NULL, NULL, NOW(), NOW()),
(6, 1, 'Boston Dynamics Atlas', '전기 휴머노이드 제조/물류. 가격 문의.', 'Boston Dynamics Atlas. 휴머노이드. 가격 문의. https://bostondynamics.com/products/atlas/', '<p><a href="https://bostondynamics.com/products/atlas/" target="_blank" rel="noopener">제품</a>. 가격 문의.</p>', 0.00, 'USD', 0, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(7, 2, 'Boston Dynamics Spot', '4족 로봇. Explorer Kit 약 $74,500.', 'Boston Dynamics Spot. 4족. $74,500. https://bostondynamics.com/products/spot/', '<p><a href="https://bostondynamics.com/products/spot/" target="_blank" rel="noopener">제품</a>. 약 $74,500.</p>', 74500.00, 'USD', 3, NULL, NULL, '90분/배터리', '2팩 포함', NULL, NOW(), NOW()),
(8, 2, 'Boston Dynamics Stretch', '창고 언로딩. 50lb 600~800케이스/시간. 가격 문의.', 'Boston Dynamics Stretch. 창고 언로딩. 가격 문의. https://bostondynamics.com/products/stretch/', '<p><a href="https://bostondynamics.com/products/stretch/" target="_blank" rel="noopener">제품</a>. 가격 문의.</p>', 0.00, 'USD', 0, NULL, NULL, '16시간', NULL, NULL, NOW(), NOW()),
(9, 2, 'Unitree Go2 (Edu)', '교육용 4족. Standard $13,999~. 15kg.', 'Unitree Go2 Edu. 4족 교육. $13,999~. https://www.unitree.com/go2', '<p><a href="https://www.unitree.com/go2" target="_blank" rel="noopener">제품</a>. $13,999~.</p>', 13999.00, 'USD', 5, '15kg', NULL, '2~4시간', NULL, NULL, NOW(), NOW());

INSERT IGNORE INTO product_color_stock (product_id, color, color_code, stock, created_at, updated_at) VALUES
(1, '기본', NULL, 0, NOW(), NOW()),
(2, '기본', NULL, 3, NOW(), NOW()),
(3, '기본', NULL, 2, NOW(), NOW()),
(4, '기본', NULL, 0, NOW(), NOW()),
(5, '기본', NULL, 2, NOW(), NOW()),
(6, '기본', NULL, 0, NOW(), NOW()),
(7, '기본', NULL, 3, NOW(), NOW()),
(8, '기본', NULL, 0, NOW(), NOW()),
(9, '기본', NULL, 5, NOW(), NOW());

INSERT IGNORE INTO mood_questions (id, question, sort_order, created_at, updated_at) VALUES
(1, '어떤 종류의 로봇에 관심이 있으신가요?', 1, NOW(), NOW()),
(2, '로봇을 어떤 용도로 사용할 계획인가요?', 2, NOW(), NOW()),
(3, '조립·프로그래밍 경험 수준을 알려주세요.', 3, NOW(), NOW());

INSERT IGNORE INTO tags (id, name, created_at, updated_at) VALUES
(1, 'AI', NOW(), NOW()),
(2, '휴머노이드', NOW(), NOW()),
(3, '자율주행', NOW(), NOW());

INSERT IGNORE INTO news (id, title, content, image_url, published_at, published, view_count, is_featured, featured_order, created_at, updated_at) VALUES
(1, 'AI 로봇의 미래', '인공지능과 로봇 공학이 결합하여 일상과 산업을 바꾸고 있습니다.', NULL, NOW(), 1, 10, 1, 1, NOW(), NOW()),
(2, '휴머노이드 로봇, 인간과 협업', '휴머노이드 로봇이 제조·서비스 현장에서 인간과 함께 일하는 사례가 늘고 있습니다.', NULL, NOW(), 1, 5, 1, 2, NOW(), NOW()),
(3, '자율주행 로봇 배송', '자율주행 기술을 적용한 배송·물류 로봇이 상용화 단계에 접어들었습니다.', NULL, NOW(), 1, 3, 0, NULL, NOW(), NOW()),
(4, 'AI와 자율주행의 융합', 'AI 비전과 자율주행이 결합한 로봇 플랫폼이 주목받고 있습니다.', NULL, NOW(), 1, 0, 0, NULL, NOW(), NOW());

INSERT IGNORE INTO news_tags (news_id, tag_id, created_at) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW()),
(4, 1, NOW()),
(4, 3, NOW());

-- 카테고리 추가 (id 3~17, 기존 1~2와 중복 없음)
INSERT IGNORE INTO categories (id, parent_id, name, slug, sort_order, created_at, updated_at) VALUES
(3, NULL, '가정용 로봇/가사 도우미', 'home', 3, NOW(), NOW()),
(4, NULL, '화재진압/인명구조용 로봇', 'firefighting', 4, NOW(), NOW()),
(5, NULL, '단순 업무/환자케어 로봇', 'medical', 5, NOW(), NOW()),
(6, NULL, '위험 현장', 'industrial', 6, NOW(), NOW()),
(7, NULL, '분류/포장 로봇', 'logistics', 7, NOW(), NOW()),
(8, 3, '청소/가사 로봇', 'home-cleaning', 1, NOW(), NOW()),
(9, 3, '요리/생활 보조 로봇', 'home-living', 2, NOW(), NOW()),
(10, 4, '화재 진압/구조', 'firefighting-rescue', 1, NOW(), NOW()),
(11, 4, '방화·탐지 설비', 'firefighting-detection', 2, NOW(), NOW()),
(12, 5, '의료/환자 케어', 'medical-care', 1, NOW(), NOW()),
(13, 5, '병원 업무/배송 로봇', 'medical-delivery', 2, NOW(), NOW()),
(14, 6, '산업/위험지역', 'industrial-hazard', 1, NOW(), NOW()),
(15, 6, '원격 탐사/작업', 'industrial-remote', 2, NOW(), NOW()),
(16, 7, '물류/포장', 'logistics-packaging', 1, NOW(), NOW()),
(17, 7, '피킹/분류 로봇', 'logistics-picking', 2, NOW(), NOW());

-- 제품 추가 (id 11~20, 기존 1~9와 중복 없음). 스키마에 맞게 description 제거, currency 추가
INSERT IGNORE INTO products (id, category_id, name, short_description, ai_summary, content, price, currency, stock, weight, total_height, operating_time, battery, speed, created_at, updated_at) VALUES
(11, 8, '가정용 청소 로봇 A', '스마트 바닥 청소', '가사 도우미용 스마트 청소 로봇.', '<p>가정용 청소 로봇 A의 상세 설명입니다.</p>', 389000.00, 'KRW', 30, '3.5kg', '10cm', '120분', '5200mAh', '0.5m/s', NOW(), NOW()),
(12, 8, '가정용 로봇 청소기 B', '알레르기 케어 청소', '일상 가사 지원 로봇.', '<p>가정용 로봇 청소기 B 상세.</p>', 459000.00, 'KRW', 25, '4.0kg', '9.5cm', '150분', '6400mAh', '0.6m/s', NOW(), NOW()),
(13, 10, '화재 진압 로봇', '고온 환경 화재 진압', '인명구조용 방화 로봇.', '<p>화재 진압 로봇입니다.</p>', 12500000.00, 'KRW', 5, '120kg', '1.2m', '4시간', '대용량 배터리팩', '1.5m/s', NOW(), NOW()),
(14, 10, '인명구조 탐색 로봇', '열화상 감지 탐색', '화재현장 탐색·구조용 로봇.', '<p>구조 탐색용 로봇입니다.</p>', 9800000.00, 'KRW', 8, '45kg', '0.8m', '6시간', '리튬이온 100Ah', '2.0m/s', NOW(), NOW()),
(15, 12, '병원 업무 보조 로봇', '병원 물류 배송', '단순 업무 자동화 로봇.', '<p>병원 내 배송 로봇입니다.</p>', 3200000.00, 'KRW', 12, '35kg', '1.1m', '8시간', '리튬이온 60Ah', '1.2m/s', NOW(), NOW()),
(16, 12, '환자 케어 로봇', '실시간 환자 모니터링', '환자 모니터링·케어 지원 로봇.', '<p>환자 케어 로봇입니다.</p>', 4500000.00, 'KRW', 10, '25kg', '1.4m', '12시간', '리튬이온 80Ah', '1.0m/s', NOW(), NOW()),
(17, 14, '위험 현장 작업 로봇', '방사능/가스 현장 투입', '위험 구역 작업용 로봇.', '<p>위험 구역 특수 로봇입니다.</p>', 8500000.00, 'KRW', 6, '80kg', '1.0m', '5시간', '내환경 배터리', '1.0m/s', NOW(), NOW()),
(18, 14, '산업용 위험지역 로봇', '원격 조작 탐사', '고위험 현장 투입용.', '<p>산업용 탐사 로봇입니다.</p>', 11200000.00, 'KRW', 4, '150kg', '1.5m', '4시간', '산업용 배터리팩', '1.5m/s', NOW(), NOW()),
(19, 16, '물류 분류 로봇', '자동 물류 피킹', '물류 분류 자동화 로봇.', '<p>물류 센터 분류 로봇입니다.</p>', 2800000.00, 'KRW', 15, '15kg', '0.5m', '10시간', '리튬이온 40Ah', '2.5m/s', NOW(), NOW()),
(20, 16, '자동 포장 로봇', '포장 라벨링 일체형', '분류/포장 로봇.', '<p>포장 자동화 로봇입니다.</p>', 3500000.00, 'KRW', 12, '60kg', '1.8m', '상시(유선)', 'AC전원', 'N/A', NOW(), NOW());

-- 제품 11~20 색상·재고
INSERT IGNORE INTO product_color_stock (product_id, color, color_code, stock, created_at, updated_at) VALUES
(11, '화이트/White', '#FFFFFF', 10, NOW(), NOW()),
(11, '블랙/Black', '#000000', 10, NOW(), NOW()),
(11, '블루/Blue', '#0000FF', 10, NOW(), NOW()),
(12, '화이트/White', '#FFFFFF', 8, NOW(), NOW()),
(12, '블랙/Black', '#000000', 9, NOW(), NOW()),
(12, '블루/Blue', '#0000FF', 8, NOW(), NOW()),
(13, '레드/Red', '#FF0000', 3, NOW(), NOW()),
(13, '그레이/Gray', '#808080', 2, NOW(), NOW()),
(14, '레드/Red', '#FF0000', 4, NOW(), NOW()),
(14, '그레이/Gray', '#808080', 4, NOW(), NOW()),
(15, '화이트/White', '#FFFFFF', 6, NOW(), NOW()),
(15, '실버/Silver', '#C0C0C0', 6, NOW(), NOW()),
(16, '화이트/White', '#FFFFFF', 5, NOW(), NOW()),
(16, '실버/Silver', '#C0C0C0', 5, NOW(), NOW()),
(17, '블랙/Black', '#000000', 3, NOW(), NOW()),
(17, '옐로우/Yellow', '#FFFF00', 2, NOW(), NOW()),
(17, '그린/Green', '#008000', 1, NOW(), NOW()),
(18, '블랙/Black', '#000000', 2, NOW(), NOW()),
(18, '옐로우/Yellow', '#FFFF00', 1, NOW(), NOW()),
(18, '그린/Green', '#008000', 1, NOW(), NOW()),
(19, '화이트/White', '#FFFFFF', 5, NOW(), NOW()),
(19, '블랙/Black', '#000000', 5, NOW(), NOW()),
(19, '그레이/Gray', '#808080', 5, NOW(), NOW()),
(20, '화이트/White', '#FFFFFF', 4, NOW(), NOW()),
(20, '블랙/Black', '#000000', 4, NOW(), NOW()),
(20, '그레이/Gray', '#808080', 4, NOW(), NOW());

UPDATE product_color_stock SET color_code = '#FFFFFF' WHERE color = '화이트/White';
UPDATE product_color_stock SET color_code = '#000000' WHERE color = '블랙/Black';
UPDATE product_color_stock SET color_code = '#0000FF' WHERE color = '블루/Blue';
UPDATE product_color_stock SET color_code = '#FF0000' WHERE color = '레드/Red';
UPDATE product_color_stock SET color_code = '#808080' WHERE color = '그레이/Gray';
UPDATE product_color_stock SET color_code = '#C0C0C0' WHERE color = '실버/Silver';
UPDATE product_color_stock SET color_code = '#FFFF00' WHERE color = '옐로우/Yellow';
UPDATE product_color_stock SET color_code = '#008000' WHERE color = '그린/Green';