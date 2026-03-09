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

    public void sendTempPasswordEmail(String toEmail, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("[Unicorn] 임시 비밀번호 안내");
        message.setText("요청하신 임시 비밀번호는 다음과 같습니다.\n\n[" + tempPassword + "]\n\n로그인 후 반드시 비밀번호를 변경해 주세요.");
        try {
            mailSender.send(message);
            log.info("Temp password email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send temp password email to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    public void sendVerificationCodeEmail(String toEmail, String code, String purposeText) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("[Unicorn] " + purposeText + " 인증번호 안내");
        message.setText("요청하신 인증번호는 [" + code + "] 입니다.\n\n해당 인증번호는 3분 동안 유효합니다.");
        try {
            mailSender.send(message);
            log.info("Verification code email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send verification code email to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("인증 메일 발송에 실패했습니다. 이메일 주소를 확인하거나 잠시 후 다시 시도해 주세요.");
        }
    }

    /**
     * 문의 답변 메일 발송 (1차 답변). 이후 추가 대화는 메일에서 진행.
     */
    public void sendInquiryReply(String toEmail, String inquirerName, String inquiryContent, String replyMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("[Unicorn] 문의하신 내용에 대한 답변입니다");
        String body = inquirerName + "님,\n\n문의해 주셔서 감사합니다.\n\n"
                + "■ 문의 내용\n" + (inquiryContent != null ? inquiryContent : "") + "\n\n"
                + "■ 답변\n" + (replyMessage != null ? replyMessage : "") + "\n\n"
                + "추가로 궁금하신 점이 있으시면 이 메일에 답장 주시면 됩니다.\n\n— Unicorn";
        message.setText(body);
        try {
            mailSender.send(message);
            log.info("Inquiry reply email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send inquiry reply to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("답변 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }
}
