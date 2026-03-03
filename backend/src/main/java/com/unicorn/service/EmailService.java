package com.unicorn.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@example.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("[Unicorn] 비밀번호 재설정 링크");
        message.setText("비밀번호를 재설정하려면 아래 링크를 클릭하세요.\n\n" + resetLink + "\n\n이 링크는 1시간 동안 유효합니다.");
        try {
            mailSender.send(message);
            log.debug("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    public void sendTestEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("[Unicorn] 이메일 발송 테스트");
        message.setText("이메일 발송 테스트입니다. 메일 설정이 정상 동작합니다.");
        try {
            mailSender.send(message);
            log.info("Test email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send test email to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("이메일 발송에 실패했습니다: " + e.getMessage());
        }
    }
}
