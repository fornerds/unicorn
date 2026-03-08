"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import {
  AiIcon,
  ArrowDiagonalIcon,
  PlusIcon,
  UploadIcon,
} from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";

const FALLBACK_QUESTIONS = [
  "몸이 불편한 가족을 케어할 로봇이 필요해요",
  "산업현장용 로봇이 필요해요",
  "공장에 인력대신 투입할 로봇이 필요해요",
];

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
}

interface MoodQuestion {
  id: number;
  question: string;
  sortOrder: number;
}

interface MoodQuestionsResponse {
  data: {
    items: MoodQuestion[];
  };
}

interface ChatResponse {
  data: {
    reply: string;
    conversationId: string;
  };
}

export const AIChatSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] =
    useState<string[]>(FALLBACK_QUESTIONS);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res =
          await apiFetch<MoodQuestionsResponse>("/ai/mood-questions");
        const questions = res.data.items.map((q) => q.question);
        if (questions.length > 0) {
          setSuggestedQuestions(questions);
        }
      } catch {
        // fallback questions already set as default state
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      const scrollContainer = chatEndRef.current.closest(
        '[class*="overflow-y-auto"]',
      ) as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await apiFetch<ChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: messageText,
          ...(conversationId && { conversationId }),
        }),
      });

      setConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          type: "ai",
          content: res.data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: "ai",
          content: "죄송합니다. 응답을 불러오는 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChatHistory = messages.length > 0;

  return (
    <section className="snap-start h-screen w-full flex items-center justify-center bg-[#ffffff] overflow-hidden relative">
      <div className="flex flex-col items-center justify-center w-full max-w-[986px] px-[10px] h-full pt-[120px] pb-[40px]">
        {!hasChatHistory ? (
          <motion.div
            className="flex flex-col gap-[80px] items-center w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-[16px] items-center justify-center">
              <AiIcon width={26} height={26} fill="#1F2937" />
              <div className="flex gap-[10px] items-center justify-center">
                <p className="font-suit font-normal text-[24px] leading-[1.3] text-[#1f2937] text-center tracking-[-0.96px] whitespace-nowrap">
                  Ask to AI
                </p>
                <div className="w-[13px] h-[13px] relative shrink-0 flex items-center justify-center">
                  <ArrowDiagonalIcon
                    width={13}
                    height={13}
                    stroke="#1F2937"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <p className="font-suit font-semibold text-[36px] leading-[1.3] text-[#1f2937] text-center tracking-[-1.44px]">
                찾고있는 로봇이 있으신가요?
              </p>
            </div>

            <div className="flex flex-col gap-[12px] items-start w-full">
              <div
                className={cn(
                  "flex gap-[6px] items-center overflow-hidden px-[16px] w-full",
                  "group",
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div
                  className={cn("flex gap-[6px] items-center animate-marquee")}
                  style={{
                    width: "max-content",
                    animationPlayState: isHovered ? "paused" : "running",
                  }}
                >
                  {[...suggestedQuestions, ...suggestedQuestions].map(
                    (question, index) => (
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
                    ),
                  )}
                </div>
              </div>

              <div className="bg-[#1F2937] rounded-[31px] w-full overflow-hidden pt-[16px] px-[10px] pb-[10px]">
                <div className="px-[30px] pt-[4px] pb-[20px]">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
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
                    <PlusIcon
                      width={20}
                      height={20}
                      stroke="#959BA9"
                      strokeWidth={2}
                    />
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
                      <UploadIcon
                        width={28}
                        height={28}
                        stroke="#1f2937"
                        strokeWidth={2}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
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
                  const isAtBottom =
                    element.scrollTop + element.clientHeight >=
                    element.scrollHeight - 1;

                  if (isScrollingUp && isAtTop) return;
                  if (isScrollingDown && isAtBottom) return;

                  e.preventDefault();
                  e.stopPropagation();
                  element.scrollTop += e.deltaY;
                }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="w-full">
                    {msg.type === "user" ? (
                      <div className="flex flex-col items-end justify-center w-full">
                        <div className="bg-[#f3f4f6] border border-[#eaebef] rounded-[999px] flex items-center justify-end px-[20px] py-[6px] shrink-0 max-w-[80%]">
                          <p className="font-suit font-medium text-[16px] leading-[1.6] text-[#374151] text-right whitespace-pre-wrap break-words">
                            {msg.content}
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
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="w-full">
                    <div className="flex gap-[6px] items-center">
                      <span className="w-2 h-2 bg-[#d1d5db] rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-[#d1d5db] rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-[#d1d5db] rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
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
                    if (e.key === "Enter" && !e.shiftKey) {
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
                    <PlusIcon
                      width={20}
                      height={20}
                      stroke="#959BA9"
                      strokeWidth={2}
                    />
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
                    <UploadIcon
                      width={28}
                      height={28}
                      stroke="#1f2937"
                      strokeWidth={2}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
