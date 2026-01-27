'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';
import {
  AiIcon,
  ArrowDiagonalIcon,
  PlusIcon,
  UploadIcon,
  ArrowDownDoubleIcon,
} from '@/components/ui/icons';

const suggestedQuestions = [
  '몸이 불편한 가족을 케어할 로봇이 필요해요',
  '산업현장용 로봇이 필요해요',
  '공장에 인력대신 투입할 로봇이 필요해요',
];

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  products?: Array<{
    id: string;
    name: string;
    price: string;
    category: string;
    image: string;
  }>;
}

export const AIChatSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: {
      async sendMessages({ messages, abortSignal }) {
        // basePath를 고려한 API 경로
        const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/unicorn') ? '/unicorn' : '';
        const apiPath = `${basePath}/api/chat`;
        
        const response = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
          signal: abortSignal,
        });
        
        // 405 Method Not Allowed는 정적 export 환경에서 발생 (API 라우트 미지원)
        if (response.status === 405) {
          throw new Error('정적 사이트에서는 AI 채팅 기능을 사용할 수 없습니다. 개발 서버에서만 사용 가능합니다.');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }
        if (!response.body) throw new Error('No response body');
        
        // @tanstack/ai의 toHttpResponse는 newline-delimited JSON 형식으로 스트림을 반환
        // 각 라인은 JSON 객체로 파싱되어야 함
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        return new ReadableStream({
          async start(controller) {
            let isClosed = false;
            let currentMessageId: string | null = null;
            let hasSentTextStart = false;
            
            const safeEnqueue = (chunk: any) => {
              if (!isClosed) {
                try {
                  controller.enqueue(chunk);
                } catch (e) {
                  // 스트림이 이미 닫혔으면 무시
                  isClosed = true;
                }
              }
            };
            
            try {
              while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                  // 남은 버퍼 처리 (스트림을 닫기 전에)
                  if (buffer.trim() && !isClosed) {
                    const lines = buffer.split('\n').filter(Boolean);
                    for (const line of lines) {
                      if (isClosed) break;
                      try {
                        const chunk = JSON.parse(line);
                        // @tanstack/ai의 StreamChunk 형식을 @ai-sdk/react의 UIMessageChunk 형식으로 변환
                        if (chunk.type === 'content' && chunk.delta) {
                          const messageId = chunk.id || 'temp';
                          
                          // 첫 번째 content chunk인 경우 text-start 전송
                          if (!hasSentTextStart || currentMessageId !== messageId) {
                            safeEnqueue({
                              type: 'text-start',
                              id: messageId,
                            });
                            hasSentTextStart = true;
                            currentMessageId = messageId;
                          }
                          
                          safeEnqueue({
                            type: 'text-delta',
                            delta: chunk.delta,
                            id: messageId,
                          });
                        } else if (chunk.type === 'done') {
                          safeEnqueue({
                            type: 'finish',
                            finishReason: chunk.finishReason || 'stop',
                          });
                          // 메시지 완료 후 상태 리셋
                          hasSentTextStart = false;
                          currentMessageId = null;
                        }
                      } catch (e) {
                        // 파싱 오류는 무시하고 계속 진행
                        console.warn('Parse warning:', e, line);
                      }
                    }
                  }
                  // 모든 데이터 처리 후 스트림 닫기
                  if (!isClosed) {
                    controller.close();
                    isClosed = true;
                  }
                  break;
                }
                
                if (isClosed) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 보관
                
                for (const line of lines) {
                  if (isClosed || !line.trim()) continue;
                  try {
                    const chunk = JSON.parse(line);
                    // @tanstack/ai의 StreamChunk 형식을 @ai-sdk/react의 UIMessageChunk 형식으로 변환
                    if (chunk.type === 'content' && chunk.delta) {
                      const messageId = chunk.id || 'temp';
                      
                      // 첫 번째 content chunk인 경우 text-start 전송
                      if (!hasSentTextStart || currentMessageId !== messageId) {
                        safeEnqueue({
                          type: 'text-start',
                          id: messageId,
                        });
                        hasSentTextStart = true;
                        currentMessageId = messageId;
                      }
                      
                      safeEnqueue({
                        type: 'text-delta',
                        delta: chunk.delta,
                        id: messageId,
                      });
                    } else if (chunk.type === 'done') {
                      safeEnqueue({
                        type: 'finish',
                        finishReason: chunk.finishReason || 'stop',
                      });
                      // 메시지 완료 후 상태 리셋
                      hasSentTextStart = false;
                      currentMessageId = null;
                    }
                  } catch (e) {
                    // 파싱 오류는 무시하고 계속 진행
                    console.warn('Parse warning:', e, line);
                  }
                }
              }
            } catch (error) {
              if (!isClosed) {
                try {
                  controller.error(error);
                } catch (e) {
                  // 이미 닫힌 스트림에 대한 오류는 무시
                }
              }
            }
          },
        });
      },
      async reconnectToStream({ chatId }) {
        // 재연결 기능은 필요시 구현
        throw new Error('Reconnect not implemented');
      },
    },
    onError: (error: Error) => {
      console.error('Chat error:', error);
      // 정적 사이트 환경에서의 에러를 사용자에게 표시
      if (error.message.includes('정적 사이트') || error.message.includes('405')) {
        setMessages([
          ...messages,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            parts: [{ type: 'text', text: '죄송합니다. 현재 정적 사이트 환경에서는 AI 채팅 기능을 사용할 수 없습니다. 이 기능은 개발 서버에서만 작동합니다.' }],
          },
        ]);
      }
    },
  });

  // 새로고침 시 메시지 초기화
  useEffect(() => {
    if (setMessages) {
      setMessages([]);
    }
  }, [setMessages]);

  useEffect(() => {
    if (chatEndRef.current) {
      // 내부 스크롤 컨테이너 찾기
      const scrollContainer = chatEndRef.current.closest('[class*="overflow-y-auto"]') as HTMLElement;
      if (scrollContainer) {
        // 내부 스크롤만 수행
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || status === 'streaming' || status === 'submitted') return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  const isLoading = status === 'streaming' || status === 'submitted';
  const hasChatHistory = messages.length > 0;

  return (
    <section className="snap-start h-screen w-full flex items-center justify-center bg-[#ffffff] overflow-hidden relative">
      <div className="flex flex-col items-center justify-center w-full max-w-[986px] px-[10px] h-full pt-[120px] pb-[40px]">
        {!hasChatHistory ? (
          <div className="flex flex-col gap-[80px] items-center w-full">
            <div className="flex flex-col gap-[16px] items-center justify-center">
              <AiIcon width={26} height={26} fill="#1F2937" />
              <div className="flex gap-[10px] items-center justify-center">
                <p className="font-suit font-normal text-[24px] leading-[1.3] text-[#1f2937] text-center tracking-[-0.96px] whitespace-nowrap">
                  Ask to AI
                </p>
                <div className="w-[13px] h-[13px] relative shrink-0 flex items-center justify-center">
                  <ArrowDiagonalIcon width={13} height={13} stroke="#1F2937" strokeWidth={1.5} />
                </div>
              </div>
              <p className="font-suit font-semibold text-[36px] leading-[1.3] text-[#1f2937] text-center tracking-[-1.44px]">
                찾고있는 로봇이 있으신가요?
              </p>
            </div>

            <div className="flex flex-col gap-[12px] items-start w-full">
              <div
                className={cn(
                  'flex gap-[6px] items-center overflow-hidden px-[16px] w-full',
                  'group'
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div
                  className={cn(
                    'flex gap-[6px] items-center animate-marquee'
                  )}
                  style={{
                    width: 'max-content',
                    animationPlayState: isHovered ? 'paused' : 'running',
                  }}
                >
                  {[...suggestedQuestions, ...suggestedQuestions].map((question, index) => (
                    <button
                      key={index}
                      className="bg-[#f9fafb] border border-[#eaebef] rounded-[31px] flex gap-[10px] items-center justify-center px-[18px] py-[10px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setInput(question);
                      }}
                    >
                      <div className="w-[16px] h-[16px] relative shrink-0">
                        <AiIcon width={16} height={16} fill="#959BA9" />
                      </div>
                      <p className="font-suit font-semibold text-[14px] leading-[1.3] text-[#6B7280] whitespace-nowrap">
                        {question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1F2937] rounded-[31px] w-full overflow-hidden pt-[16px] px-[10px] pb-[10px]">
                <div className="px-[30px] pt-[4px] pb-[20px]">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    placeholder="AI에게 질문해 보세요!"
                    className="w-full font-suit font-semibold text-[20px] leading-[1.3] text-white bg-transparent border-none outline-none resize-none min-h-[60px] max-h-[130px] overflow-y-auto placeholder:text-[#6b7280]"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex h-[43px] items-center justify-between pl-[30px]">
                  <button className="flex gap-[10px] items-center p-[6px] rounded-[10px] hover:bg-[#374151] transition-colors">
                    <div className="w-[20px] h-[20px] relative shrink-0 flex items-center justify-center">
                      <PlusIcon width={20} height={20} stroke="#959BA9" strokeWidth={2} />
                    </div>
                    <p className="font-suit font-medium text-[20px] leading-[1.3] text-[#959BA9]">
                      Add File
                    </p>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="bg-white border border-[#d1d5db] rounded-full w-[44px] h-[44px] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-[28px] h-[28px] relative shrink-0 flex items-center justify-center">
                      <UploadIcon width={28} height={28} stroke="#1f2937" strokeWidth={2} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[40px] items-start w-full flex-1 min-h-0 overflow-hidden pb-[140px]">
            <div className="flex flex-1 gap-[10px] items-start justify-center w-full min-h-0 overflow-hidden">
              <div 
                className="flex flex-col gap-[40px] items-start overflow-y-auto pr-[10px] w-full max-h-[50vh] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[#eeeff1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                onWheel={(e) => {
                  const element = e.currentTarget;
                  const isScrollingDown = e.deltaY > 0;
                  const isScrollingUp = e.deltaY < 0;
                  const isAtTop = element.scrollTop <= 1;
                  const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
                  
                  // 스크롤이 맨 위에 있고 위로 스크롤하려는 경우
                  if (isScrollingUp && isAtTop) {
                    // 외부 스크롤로 전파 허용
                    return;
                  }
                  
                  // 스크롤이 맨 아래에 있고 아래로 스크롤하려는 경우
                  if (isScrollingDown && isAtBottom) {
                    // 외부 스크롤로 전파 허용
                    return;
                  }
                  
                  // 내부 스크롤 중에는 외부 스크롤 전파 방지
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // 내부 스크롤 수행
                  element.scrollTop += e.deltaY;
                }}
              >
                {messages.length === 0 ? (
                  <div className="w-full text-center text-[#6b7280]">메시지가 없습니다.</div>
                ) : (
                  messages.map((msg) => {
                    const textParts = msg.parts?.filter((part: any) => part.type === 'text') || [];
                    const content = textParts.map((part: any) => part.text).join('');
                    return (
                      <div key={msg.id} className="w-full">
                        {msg.role === 'user' ? (
                          <div className="flex flex-col items-end justify-center w-full">
                            <div className="bg-[#f3f4f6] border border-[#eaebef] rounded-[999px] flex items-center justify-end px-[20px] py-[6px] shrink-0 max-w-[80%]">
                              <p className="font-suit font-medium text-[16px] leading-[1.6] text-[#374151] text-right whitespace-pre-wrap break-words">
                                {content}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-[20px] items-start w-full">
                            <div className="font-suit font-medium text-[16px] leading-[1.6] text-[#374151] prose prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({ children }) => (
                                    <h1 className="font-suit font-bold text-[20px] leading-[1.5] text-[#374151] mb-[12px] mt-[16px] first:mt-0">
                                      {children}
                                    </h1>
                                  ),
                                  h2: ({ children }) => (
                                    <h2 className="font-suit font-bold text-[18px] leading-[1.5] text-[#374151] mb-[10px] mt-[14px] first:mt-0">
                                      {children}
                                    </h2>
                                  ),
                                  h3: ({ children }) => (
                                    <h3 className="font-suit font-semibold text-[17px] leading-[1.5] text-[#374151] mb-[8px] mt-[12px] first:mt-0">
                                      {children}
                                    </h3>
                                  ),
                                  p: ({ children }) => (
                                    <p className="font-suit font-medium text-[16px] leading-[1.6] text-[#374151] mb-[8px] last:mb-0">
                                      {children}
                                    </p>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-outside mb-[8px] space-y-[4px] ml-[20px] pl-[20px]">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-outside mb-[8px] space-y-[4px] ml-[20px] pl-[20px]">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="font-suit font-medium text-[16px] leading-[1.6] text-[#374151]">
                                      {children}
                                    </li>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-suit font-semibold text-[#374151]">
                                      {children}
                                    </strong>
                                  ),
                                  em: ({ children }) => (
                                    <em className="font-suit font-medium italic text-[#374151]">
                                      {children}
                                    </em>
                                  ),
                                  code: ({ children, className }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                      <code className="bg-[#f3f4f6] px-[4px] py-[2px] rounded text-[14px] font-mono text-[#374151]">
                                        {children}
                                      </code>
                                    ) : (
                                      <code className="block bg-[#f3f4f6] p-[12px] rounded-[8px] text-[14px] font-mono text-[#374151] overflow-x-auto mb-[8px]">
                                        {children}
                                      </code>
                                    );
                                  },
                                  blockquote: ({ children }) => (
                                    <blockquote className="border-l-[4px] border-[#d1d5db] pl-[16px] my-[8px] italic text-[#6b7280]">
                                      {children}
                                    </blockquote>
                                  ),
                                }}
                              >
                                {content}
                              </ReactMarkdown>
                              {isLoading && msg.id === messages[messages.length - 1]?.id && (
                                <span className="inline-block w-2 h-4 bg-[#374151] ml-1 animate-pulse" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>
        )}

        {hasChatHistory && (
          <div className="flex flex-col gap-[12px] items-start w-full absolute bottom-[60px] left-1/2 -translate-x-1/2 max-w-[986px] w-[calc(100%-20px)] px-[10px]">
            <div className="bg-[#1F2937] rounded-[31px] w-full overflow-hidden pt-[16px] px-[10px] pb-[10px]">
              <div className="px-[30px] pt-[4px] pb-[20px]">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder=""
                  className="w-full font-suit font-semibold text-[20px] leading-[1.3] text-white bg-transparent border-none outline-none resize-none min-h-[60px] max-h-[78px] overflow-y-auto placeholder:text-[#6b7280]"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <div className="flex h-[43px] items-center justify-between pl-[30px]">
                <button className="flex gap-[10px] items-center p-[6px] rounded-[10px] hover:bg-[#374151] transition-colors">
                  <div className="w-[20px] h-[20px] relative shrink-0 flex items-center justify-center">
                    <PlusIcon width={20} height={20} stroke="#959BA9" strokeWidth={2} />
                  </div>
                  <p className="font-suit font-medium text-[20px] leading-[1.3] text-[#959BA9]">
                    Add File
                  </p>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="bg-white border border-[#d1d5db] rounded-full w-[44px] h-[44px] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-[28px] h-[28px] relative shrink-0 flex items-center justify-center">
                    <UploadIcon width={28} height={28} stroke="#1f2937" strokeWidth={2} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex flex-col gap-[10px] items-center justify-center pointer-events-none z-10">
        <div className="flex gap-[10px] items-end justify-center">
          <p className="font-suit font-normal text-[20px] leading-[1.3] text-[#6b7280] text-center tracking-[-0.8px] whitespace-nowrap">
            계속 스크롤해서 카테고리 한 눈에 확인하기
          </p>
          <div className="w-[14px] h-[24px] relative shrink-0 flex items-center justify-center">
            <ArrowDownDoubleIcon width={14} height={24} stroke="#6B7280" strokeWidth={1.16667} />
          </div>
        </div>
      </div>
    </section>
  );
};

