-- dev 전용 더미 데이터 (MySQL 데이터 디렉터리가 비어 있을 때만 실행됨)
-- 비밀번호: password (BCrypt)

INSERT IGNORE INTO users (id, email, password_hash, name, status, role, created_at, updated_at) VALUES
(1, 'admin@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '개발관리자', 'active', 'ADMIN', NOW(), NOW()),
(2, 'user1@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저1', 'active', 'USER', NOW(), NOW()),
(3, 'user2@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저2', 'active', 'USER', NOW(), NOW());

INSERT IGNORE INTO categories (id, name, slug, sort_order, created_at, updated_at) VALUES
(1, '로봇 부품', 'robot-parts', 1, NOW(), NOW()),
(2, '로봇 키트', 'robot-kits', 2, NOW(), NOW()),
(3, '센서·제어', 'sensors-control', 3, NOW(), NOW());

INSERT IGNORE INTO products (id, category_id, name, description, price, stock, created_at, updated_at) VALUES
(1, 1, '서보 모터 SG90', '개발용 더미 상품입니다. 소형 서보 모터.', 8500.00, 100, NOW(), NOW()),
(2, 1, 'DC 모터 12V', '개발용 더미 상품입니다. 12V DC 모터.', 12000.00, 50, NOW(), NOW()),
(3, 2, '아두이노 로봇 키트', '개발용 더미 상품입니다. 초보자용 로봇 조립 키트.', 45000.00, 30, NOW(), NOW()),
(4, 3, '초음파 거리 센서', '개발용 더미 상품입니다. HC-SR04 호환.', 5500.00, 80, NOW(), NOW()),
(5, 3, '라인 트레이서 센서 모듈', '개발용 더미 상품입니다. 5채널 라인 감지.', 18000.00, 40, NOW(), NOW());

INSERT IGNORE INTO mood_questions (id, question, sort_order, created_at, updated_at) VALUES
(1, '어떤 종류의 로봇에 관심이 있으신가요?', 1, NOW(), NOW()),
(2, '로봇을 어떤 용도로 사용할 계획인가요?', 2, NOW(), NOW()),
(3, '조립·프로그래밍 경험 수준을 알려주세요.', 3, NOW(), NOW());
