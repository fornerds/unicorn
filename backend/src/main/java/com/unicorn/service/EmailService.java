package com.unicorn.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@example.com}")
    private String fromEmail;

    private void sendHtml(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            log.warn("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String html = EmailHtmlTemplates.passwordResetLink(resetLink);
        sendHtml(toEmail, "[Unicorn] 비밀번호 재설정 링크", html);
        log.debug("Password reset email sent to {}", toEmail);
    }

    public void sendTestEmail(String toEmail) {
        String html = EmailHtmlTemplates.testEmail();
        sendHtml(toEmail, "[Unicorn] 이메일 발송 테스트", html);
        log.info("Test email sent to {}", toEmail);
    }

    public void sendTempPasswordEmail(String toEmail, String tempPassword) {
        String html = EmailHtmlTemplates.tempPassword(tempPassword);
        sendHtml(toEmail, "[Unicorn] 임시 비밀번호 안내", html);
        log.info("Temp password email sent to {}", toEmail);
    }

    public void sendVerificationCodeEmail(String toEmail, String code, String purposeText) {
        String html = EmailHtmlTemplates.verificationCode(purposeText, code);
        sendHtml(toEmail, "[Unicorn] " + purposeText + " 인증번호 안내", html);
        log.info("Verification code email sent to {}", toEmail);
    }

    /**
     * 문의 답변 메일 발송 (1차 답변). 이후 추가 대화는 메일에서 진행.
     */
    public void sendInquiryReply(String toEmail, String inquirerName, String inquiryContent, String replyMessage) {
        String html = EmailHtmlTemplates.inquiryReply(inquirerName, inquiryContent, replyMessage);
        sendHtml(toEmail, "[Unicorn] 문의하신 내용에 대한 답변입니다", html);
        log.info("Inquiry reply email sent to {}", toEmail);
    }
}
