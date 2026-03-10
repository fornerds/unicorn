package com.unicorn.service;

/**
 * HTML 이메일 본문 템플릿. 이메일 클라이언트 호환을 위해 인라인 스타일·테이블 레이아웃 사용.
 */
public final class EmailHtmlTemplates {

    private static final String STYLE_CONTAINER = "max-width:560px; margin:0 auto; font-family:'Malgun Gothic',Apple SD Gothic Neo,sans-serif; font-size:15px; line-height:1.6; color:#333;";
    private static final String STYLE_HEADER = "padding:24px 24px 16px; border-bottom:2px solid #111;";
    private static final String STYLE_BODY = "padding:24px;";
    private static final String STYLE_FOOTER = "padding:16px 24px; font-size:12px; color:#888; border-top:1px solid #eee;";
    private static final String STYLE_BOX = "background:#f8f9fa; border-radius:8px; padding:16px; margin:12px 0;";
    private static final String STYLE_CODE = "font-size:28px; font-weight:bold; letter-spacing:6px; color:#111;";
    private static final String STYLE_BTN = "display:inline-block; padding:14px 28px; background:#111; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold; margin:16px 0;";

    private EmailHtmlTemplates() {
    }

    private static String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    /**
     * 회원가입 / 비밀번호 찾기 인증번호
     */
    public static String verificationCode(String purposeText, String code) {
        String safePurpose = escapeHtml(purposeText);
        String safeCode = escapeHtml(code);
        return """
            <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
            <body style="margin:0; background:#f0f0f0;">
            <div style="%s">
              <div style="%s">
                <div style="font-size:20px; font-weight:bold;">Unicorn</div>
                <div style="font-size:14px; color:#666; margin-top:4px;">%s 인증번호 안내</div>
              </div>
              <div style="%s">
                <p style="margin:0 0 16px;">요청하신 인증번호는 아래와 같습니다.</p>
                <div style="%s">
                  <span style="%s">%s</span>
                </div>
                <p style="margin:16px 0 0; color:#666; font-size:13px;">해당 인증번호는 3분 동안 유효합니다.</p>
              </div>
              <div style="%s">본인이 요청한 것이 아닌 경우 이 메일을 무시해 주세요.</div>
            </div>
            </body></html>
            """
            .formatted(
                STYLE_CONTAINER,
                STYLE_HEADER,
                safePurpose,
                STYLE_BODY,
                STYLE_BOX,
                STYLE_CODE,
                safeCode,
                STYLE_FOOTER
            );
    }

    /**
     * 비밀번호 재설정 링크
     */
    public static String passwordResetLink(String resetLink) {
        String safeLink = escapeHtml(resetLink);
        return """
            <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
            <body style="margin:0; background:#f0f0f0;">
            <div style="%s">
              <div style="%s">
                <div style="font-size:20px; font-weight:bold;">Unicorn</div>
                <div style="font-size:14px; color:#666; margin-top:4px;">비밀번호 재설정</div>
              </div>
              <div style="%s">
                <p style="margin:0 0 16px;">비밀번호를 재설정하려면 아래 버튼을 클릭하세요.</p>
                <p><a href="%s" style="%s">비밀번호 재설정하기</a></p>
                <p style="margin:16px 0 0; color:#666; font-size:13px;">버튼이 동작하지 않으면 아래 링크를 복사해 브라우저에 붙여넣기 하세요.</p>
                <p style="word-break:break-all; font-size:12px; color:#666;">%s</p>
                <p style="margin:16px 0 0; color:#888; font-size:12px;">이 링크는 1시간 동안 유효합니다.</p>
              </div>
              <div style="%s">본인이 요청한 것이 아닌 경우 이 메일을 무시해 주세요.</div>
            </div>
            </body></html>
            """
            .formatted(
                STYLE_CONTAINER,
                STYLE_HEADER,
                STYLE_BODY,
                safeLink,
                STYLE_BTN,
                safeLink,
                STYLE_FOOTER
            );
    }

    /**
     * 문의 답변 메일 (문의 내용 + 답변)
     */
    public static String inquiryReply(String inquirerName, String inquiryContent, String replyMessage) {
        String safeName = escapeHtml(inquirerName);
        String safeInquiry = escapeHtml(inquiryContent != null ? inquiryContent : "").replace("\n", "<br>");
        String safeReply = escapeHtml(replyMessage != null ? replyMessage : "").replace("\n", "<br>");
        return """
            <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
            <body style="margin:0; background:#f0f0f0;">
            <div style="%s">
              <div style="%s">
                <div style="font-size:20px; font-weight:bold;">Unicorn</div>
                <div style="font-size:14px; color:#666; margin-top:4px;">문의하신 내용에 대한 답변입니다</div>
              </div>
              <div style="%s">
                <p style="margin:0 0 16px;">%s님, 문의해 주셔서 감사합니다.</p>
                <div style="%s">
                  <div style="font-weight:bold; margin-bottom:8px; color:#555;">■ 문의 내용</div>
                  <div>%s</div>
                </div>
                <div style="%s">
                  <div style="font-weight:bold; margin-bottom:8px; color:#555;">■ 답변</div>
                  <div>%s</div>
                </div>
                <p style="margin:16px 0 0; color:#666; font-size:13px;">추가로 궁금하신 점이 있으시면 이 메일에 답장 주시면 됩니다.</p>
              </div>
              <div style="%s">— Unicorn</div>
            </div>
            </body></html>
            """
            .formatted(
                STYLE_CONTAINER,
                STYLE_HEADER,
                STYLE_BODY,
                safeName,
                STYLE_BOX,
                safeInquiry,
                STYLE_BOX,
                safeReply,
                STYLE_FOOTER
            );
    }

    /**
     * 임시 비밀번호 안내
     */
    public static String tempPassword(String tempPassword) {
        String safe = escapeHtml(tempPassword);
        return """
            <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
            <body style="margin:0; background:#f0f0f0;">
            <div style="%s">
              <div style="%s">
                <div style="font-size:20px; font-weight:bold;">Unicorn</div>
                <div style="font-size:14px; color:#666; margin-top:4px;">임시 비밀번호 안내</div>
              </div>
              <div style="%s">
                <p style="margin:0 0 16px;">요청하신 임시 비밀번호는 아래와 같습니다.</p>
                <div style="%s"><span style="%s">%s</span></div>
                <p style="margin:16px 0 0; color:#c00; font-size:13px;">로그인 후 반드시 비밀번호를 변경해 주세요.</p>
              </div>
              <div style="%s">— Unicorn</div>
            </div>
            </body></html>
            """
            .formatted(STYLE_CONTAINER, STYLE_HEADER, STYLE_BODY, STYLE_BOX, STYLE_CODE, safe, STYLE_FOOTER);
    }

    /**
     * 테스트 메일
     */
    public static String testEmail() {
        return """
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="margin:0; background:#f0f0f0;">
            <div style="%s">
              <div style="%s">
                <div style="font-size:20px; font-weight:bold;">Unicorn</div>
                <div style="font-size:14px; color:#666; margin-top:4px;">이메일 발송 테스트</div>
              </div>
              <div style="%s">
                <p style="margin:0;">이메일 발송 테스트입니다. 메일 설정이 정상 동작합니다.</p>
              </div>
              <div style="%s">— Unicorn</div>
            </div>
            </body></html>
            """
            .formatted(STYLE_CONTAINER, STYLE_HEADER, STYLE_BODY, STYLE_FOOTER);
    }
}
