-- dev 전용 더미 데이터 (MySQL 데이터 디렉터리가 비어 있을 때만 실행됨)
-- 비밀번호: password (BCrypt)

SET NAMES utf8mb4;

INSERT IGNORE INTO users (id, email, password_hash, name, status, role, created_at, updated_at) VALUES
(1, 'admin@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '개발관리자', 'active', 'ADMIN', NOW(), NOW()),
(2, 'user1@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저1', 'active', 'USER', NOW(), NOW()),
(3, 'user2@unicorn.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '테스트유저2', 'active', 'USER', NOW(), NOW());

INSERT IGNORE INTO categories (id, parent_id, name, slug, sort_order, created_at, updated_at) VALUES
(1, NULL, '휴머노이드 로봇', 'humanoid', 1, NOW(), NOW()),
(2, NULL, '논휴머노이드 로봇', 'non-humanoid', 2, NOW(), NOW());

-- 가격·통화: DB에는 USD로 저장. API 응답 시 환율 적용해 원화로 전달.
INSERT IGNORE INTO products (id, category_id, name, short_description, ai_summary, content, price, currency, stock, weight, total_height, operating_time, battery, speed, created_at, updated_at) VALUES
(1, 1, '1X Technologies NEO', '가정용 휴머노이드 167cm 30kg. Redwood AI. 프리오더 2026.', '1X NEO. 가정용 휴머노이드. $20,000 또는 월 $499 리스. https://www.1x.tech/neo', '<p>1X NEO. <a href="https://www.1x.tech/neo" target="_blank" rel="noopener">공식</a>. $20,000 / 월 $499 리스.</p>', 20000.00, 'USD', 0, '30kg', '167cm', NULL, NULL, NULL, NOW(), NOW()),
(2, 1, 'Unitree G1', '127cm 35kg 휴머노이드. G1 Basic $19,995~$21,600, EDU $43,500~.', 'Unitree G1. 휴머노이드. 기본 $19,995~$21,600, EDU $43,500~. https://www.unitree.com/', '<p>Unitree G1. <a href="https://www.unitree.com/g1" target="_blank" rel="noopener">공식</a>. Basic $19,995~, EDU $43,500~.</p>', 19995.00, 'USD', 3, '35kg', '127cm', NULL, NULL, NULL, NOW(), NOW()),
(3, 1, 'Unitree H1', '180cm 대형 휴머노이드. 기준가 $90,000.', 'Unitree H1. 휴머노이드 180cm. $90,000. https://www.unitree.com/', '<p>Unitree H1. <a href="https://www.unitree.com/" target="_blank" rel="noopener">공식</a>. $90,000.</p>', 90000.00, 'USD', 2, NULL, '180cm', NULL, NULL, NULL, NOW(), NOW()),
(4, 1, 'Figure 03', 'Figure AI 휴머노이드. 소비자 $20,000, 상용 $130,000.', 'Figure 03. 휴머노이드. 소비자 $20,000 / 상용 $130,000. https://www.figure.ai/', '<p>Figure 03. <a href="https://www.figure.ai/" target="_blank" rel="noopener">공식</a> / <a href="https://www.figure.ai/figure" target="_blank" rel="noopener">제품</a>. $20,000~$130,000.</p>', 20000.00, 'USD', 0, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(5, 1, 'Agility Robotics DIGIT', '물류 휴머노이드 175cm 64kg. 16kg 적재 8시간. $250,000.', 'Agility DIGIT. 휴머노이드 물류. $250,000. https://www.agilityrobotics.com/', '<p>Agility DIGIT. <a href="https://www.agilityrobotics.com/" target="_blank" rel="noopener">공식</a>. $250,000~.</p>', 250000.00, 'USD', 2, '64kg', '175cm', '8시간', NULL, NULL, NOW(), NOW()),
(6, 1, 'Boston Dynamics Atlas', '전기 휴머노이드 제조/물류. 가격 문의.', 'Boston Dynamics Atlas. 휴머노이드. 가격 미공개(문의). https://bostondynamics.com/products/atlas/', '<p>Boston Dynamics Atlas. <a href="https://bostondynamics.com/products/atlas/" target="_blank" rel="noopener">제품</a>. 가격 문의.</p>', 0.00, 'USD', 0, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
(7, 2, 'Boston Dynamics Spot', '4족 로봇. Explorer Kit 약 $74,500. 옵션 시 $100K~$195K.', 'Boston Dynamics Spot. 4족. 기준 $74,500. https://bostondynamics.com/products/spot/', '<p>Boston Dynamics Spot. <a href="https://bostondynamics.com/products/spot/" target="_blank" rel="noopener">제품</a>. 약 $74,500.</p>', 74500.00, 'USD', 3, NULL, NULL, '90분/배터리', '2팩 포함', NULL, NOW(), NOW()),
(8, 2, 'Boston Dynamics Stretch', '창고 언로딩. 50lb 600~800케이스/시간. 16시간. 가격 문의.', 'Boston Dynamics Stretch. 창고 언로딩. 가격 미공개(문의). https://bostondynamics.com/products/stretch/', '<p>Boston Dynamics Stretch. <a href="https://bostondynamics.com/products/stretch/" target="_blank" rel="noopener">제품</a>. 가격 문의.</p>', 0.00, 'USD', 0, NULL, NULL, '16시간', NULL, NULL, NOW(), NOW()),
(9, 2, 'Unitree Go2 (Edu)', '교육용 4족. Standard $13,999, Plus $15,900~$20,800. 15kg.', 'Unitree Go2 Edu. 4족 교육. Standard $13,999~. https://www.unitree.com/go2', '<p>Unitree Go2 (Edu). <a href="https://www.unitree.com/go2" target="_blank" rel="noopener">제품</a>. $13,999~.</p>', 13999.00, 'USD', 5, '15kg', NULL, '2~4시간', NULL, NULL, NOW(), NOW());

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

-- 주문 금액·통화: 결제 수단에 따라 DB에 KRW 또는 USD 저장. 더미는 금액이 USD 기준이므로 currency=USD.
INSERT IGNORE INTO orders (id, user_id, total_amount, currency, status, recipient, phone, address, zip_code, payment_provider, payment_id, paid_at, created_at, updated_at) VALUES
(1, 3, 33994.00, 'USD', 'pending', '테스트유저2', '010-2222-2222', '서울시 강남구 테스트로 22', '06222', NULL, NULL, NULL, NOW(), NOW()),
(2, 3, 20000.00, 'USD', 'paid', '테스트유저2', '010-2222-2222', '서울시 강남구 테스트로 22', '06222', 'toss', 'pay-002', NOW(), DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(3, 3, 19995.00, 'USD', 'preparing', '테스트유저2', '010-2222-2222', '서울시 서초구 샘플동 33', '06633', 'toss', 'pay-003', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(4, 3, 250000.00, 'USD', 'shipping', '테스트유저2', '010-2222-2222', '경기도 성남시 분당구 44', '13444', 'toss', 'pay-004', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(5, 3, 13999.00, 'USD', 'delivered', '테스트유저2', '010-2222-2222', '서울시 강남구 테스트로 22', '06222', 'toss', 'pay-005', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(6, 3, 74500.00, 'USD', 'cancelled', '테스트유저2', '010-2222-2222', '서울시 강남구 테스트로 22', '06222', NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, price, created_at) VALUES
(1, 1, 1, 1, 20000.00, NOW()),
(2, 1, 2, 1, 13994.00, NOW()),
(3, 2, 1, 1, 20000.00, NOW()),
(4, 3, 2, 1, 19995.00, NOW()),
(5, 4, 5, 1, 250000.00, NOW()),
(6, 5, 9, 1, 13999.00, NOW()),
(7, 6, 7, 1, 74500.00, NOW());

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
