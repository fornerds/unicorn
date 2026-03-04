-- dev 전용 더미 데이터 (MySQL 데이터 디렉터리가 비어 있을 때만 실행됨)
-- 비밀번호: password (BCrypt)

SET NAMES utf8mb4;

INSERT IGNORE INTO users (id, email, password_hash, name, status, role, created_at, updated_at) VALUES
(1, 'admin@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '개발관리자', 'active', 'ADMIN', NOW(), NOW()),
(2, 'user1@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저1', 'active', 'USER', NOW(), NOW()),
(3, 'user2@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저2', 'active', 'USER', NOW(), NOW());

INSERT IGNORE INTO categories (id, parent_id, name, slug, sort_order, created_at, updated_at) VALUES
(1, NULL, '가정용 로봇/가사 도우미', 'home', 1, NOW(), NOW()),
(2, NULL, '화재진압/인명구조용 로봇', 'firefighting', 2, NOW(), NOW()),
(3, NULL, '단순 업무/환자케어 로봇', 'medical', 3, NOW(), NOW()),
(4, NULL, '위험 현장', 'industrial', 4, NOW(), NOW()),
(5, NULL, '분류/포장 로봇', 'logistics', 5, NOW(), NOW()),
(6, 1, '청소/가사 로봇', 'home-cleaning', 1, NOW(), NOW()),
(7, 1, '요리/생활 보조 로봇', 'home-living', 2, NOW(), NOW()),
(8, 2, '화재 진압/구조', 'firefighting-rescue', 1, NOW(), NOW()),
(9, 2, '방화·탐지 설비', 'firefighting-detection', 2, NOW(), NOW()),
(10, 3, '의료/환자 케어', 'medical-care', 1, NOW(), NOW()),
(11, 3, '병원 업무/배송 로봇', 'medical-delivery', 2, NOW(), NOW()),
(12, 4, '산업/위험지역', 'industrial-hazard', 1, NOW(), NOW()),
(13, 4, '원격 탐사/작업', 'industrial-remote', 2, NOW(), NOW()),
(14, 5, '물류/포장', 'logistics-packaging', 1, NOW(), NOW()),
(15, 5, '피킹/분류 로봇', 'logistics-picking', 2, NOW(), NOW());

INSERT IGNORE INTO products (id, category_id, name, description, price, stock, created_at, updated_at) VALUES
(1, 6, '가정용 청소 로봇 A', '가사 도우미용 스마트 청소 로봇. 바닥 청소·걸레질 자동화.', 389000.00, 30, NOW(), NOW()),
(2, 6, '가정용 로봇 청소기 B', '일상 가사 지원 로봇. 먼지·알레르기 원인 제거.', 459000.00, 25, NOW(), NOW()),
(3, 8, '화재 진압 로봇', '인명구조용 방화 로봇. 고온·연기 환경 투입.', 12500000.00, 5, NOW(), NOW()),
(4, 8, '인명구조 탐색 로봇', '화재현장 탐색·구조용 로봇. 열화상·가스 감지.', 9800000.00, 8, NOW(), NOW()),
(5, 10, '병원 업무 보조 로봇', '단순 업무 자동화 로봇. 배송·안내·서류 전달.', 3200000.00, 12, NOW(), NOW()),
(6, 10, '환자 케어 로봇', '환자 모니터링·케어 지원 로봇. 원격 상주·알림.', 4500000.00, 10, NOW(), NOW()),
(7, 12, '위험 현장 작업 로봇', '위험 구역 작업용 로봇. 방사능·유해가스 대응.', 8500000.00, 6, NOW(), NOW()),
(8, 12, '산업용 위험지역 로봇', '고위험 현장 투입용. 원격 조작·탐사.', 11200000.00, 4, NOW(), NOW()),
(9, 14, '물류 분류 로봇', '물류 분류 자동화 로봇. 바코드·무게 기반 분류.', 2800000.00, 15, NOW(), NOW()),
(10, 14, '자동 포장 로봇', '분류/포장 로봇. 피킹·포장·라벨링 일체형.', 3500000.00, 12, NOW(), NOW());

INSERT IGNORE INTO mood_questions (id, question, sort_order, created_at, updated_at) VALUES
(1, '어떤 종류의 로봇에 관심이 있으신가요?', 1, NOW(), NOW()),
(2, '로봇을 어떤 용도로 사용할 계획인가요?', 2, NOW(), NOW()),
(3, '조립·프로그래밍 경험 수준을 알려주세요.', 3, NOW(), NOW());
