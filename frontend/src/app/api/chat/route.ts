import { chat } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';
import { toHttpResponse } from '@tanstack/ai';
import { NextRequest } from 'next/server';

// Edge Runtime에서 환경 변수 접근 문제가 있을 수 있으므로 Node.js runtime 사용
// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 환경 변수 확인 (Next.js는 .env.local을 자동으로 로드합니다)
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('Environment check:');
    console.log('- OPENAI_API_KEY exists:', !!apiKey);
    console.log('- OPENAI_API_KEY length:', apiKey?.length || 0);
    console.log('- All env keys:', Object.keys(process.env).filter(k => k.includes('OPENAI')));
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set. Please check:');
      console.error('1. .env.local file exists in frontend directory');
      console.error('2. File contains: OPENAI_API_KEY=your_key_here');
      console.error('3. Development server was restarted after adding .env.local');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API 키가 설정되지 않았습니다.',
          hint: '개발 서버를 재시작했는지 확인하세요.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('API Key exists:', !!apiKey);
    console.log('Messages count:', messages.length);

    // UIMessage 형식을 OpenAI 메시지 형식으로 변환
    const openaiMessages = messages.map((msg: any) => {
      if (msg.role === 'user') {
        // parts가 있는 경우 (UIMessage 형식)
        if (msg.parts && Array.isArray(msg.parts)) {
          const textParts = msg.parts.filter((part: any) => part.type === 'text') || [];
          const content = textParts.map((part: any) => part.text).join('');
          return {
            role: 'user',
            content: content || msg.content || '',
          };
        }
        // content가 직접 있는 경우
        return {
          role: 'user',
          content: msg.content || '',
        };
      } else if (msg.role === 'assistant') {
        if (msg.parts && Array.isArray(msg.parts)) {
          const textParts = msg.parts.filter((part: any) => part.type === 'text') || [];
          const content = textParts.map((part: any) => part.text).join('');
          return {
            role: 'assistant',
            content: content || msg.content || '',
          };
        }
        return {
          role: 'assistant',
          content: msg.content || '',
        };
      }
      return msg;
    });

    console.log('Converted messages:', JSON.stringify(openaiMessages, null, 2));

    // @tanstack/ai를 사용하여 채팅 스트림 생성
    // 환경 변수 OPENAI_API_KEY를 사용하도록 설정
    process.env.OPENAI_API_KEY = apiKey;
    
    const stream = chat({
      adapter: openaiText('gpt-4o-mini'),
      messages: openaiMessages,
      systemPrompts: [`당신은 로봇 쇼핑몰 "UNICORN"의 AI 어시스턴트입니다. 
사용자에게 로봇 제품을 추천하고 정보를 제공하는 것이 주 역할입니다.

응답 규칙:
1. 친절하고 전문적인 톤으로 답변하세요.
2. 로봇 제품에 대한 구체적인 정보를 제공하세요.
3. 필요시 제품 비교나 추천을 해주세요.
4. 한국어로 답변하세요.
5. 응답은 간결하고 명확하게 작성하세요.`],
      maxTokens: 1000,
      temperature: 0.7,
    });

    console.log('Stream created');
    // @tanstack/ai의 toHttpResponse를 사용하여 HTTP 스트림 형식으로 변환
    return toHttpResponse(stream);
  } catch (error) {
    console.error('AI API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return new Response(
      JSON.stringify({
        error: 'AI 응답 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
