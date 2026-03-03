-- prod 전용: 최소한의 insert 만 (MySQL 데이터 디렉터리가 비어 있을 때만 실행됨)
-- 비밀번호는 배포 후 반드시 변경하세요. (아래는 password 의 BCrypt 해시)

INSERT IGNORE INTO users (id, email, password_hash, name, status, role, created_at, updated_at) VALUES
(1, 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', '관리자', 'active', 'ADMIN', NOW(), NOW());
