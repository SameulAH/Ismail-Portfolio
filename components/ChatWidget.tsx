import React, { useState, useRef, useEffect } from 'react';

type Role = 'user' | 'assistant';

type Message = {
  role: Role;
  content: string;
};

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await resp.json();
      if (data.reply) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              "I couldn't generate a reply right now. Please try again in a moment.",
          },
        ]);
      }
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'I had an issue connecting to my brain. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Don't render on server
  if (!mounted) return null;

  return (
    <>
      {/* Floating avatar button with tooltip bubble */}
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
        {!open && (
          <div className="bg-white text-slate-800 text-sm px-3 py-2 rounded-lg shadow-lg max-w-[180px] animate-pulse">
            <span>Ask Ismail about his experience 💬</span>
            <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white"></div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-16 h-16 rounded-full border-2 border-darkGreen bg-slate-900 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
          aria-label="Open chat with Hero"
        >
          <img
            src="/images/ismail.jpeg"
            alt="Ismail Ahouari"
            className="object-cover object-top w-full h-full"
          />
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-h-[70vh] bg-slate-950 text-slate-100 shadow-2xl rounded-xl border border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-slate-700 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-darkGreen flex-shrink-0">
              <img
                src="/images/ismail.jpeg"
                alt="Ismail Ahouari"
                className="object-cover object-top w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-lightGreen">Ismail</span>
              <span className="text-[11px] text-slate-400">
                Ask me about my experience & projects
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-slate-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 text-sm space-y-3 min-h-[200px] max-h-[300px]">
            {messages.length === 0 && (
              <div className="text-xs text-slate-400 bg-slate-900 rounded-lg p-3">
                👋 Hi, I&apos;m Hero in AI form! I&apos;m Ismail Ahouari&apos;s digital twin. Ask me about my background, thesis research on Split Learning, or current projects in agentic LLM infrastructure.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'text-right'
                    : 'text-left'
                }
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'inline-block bg-darkGreen text-white rounded-lg px-3 py-2 max-w-[85%] text-left'
                      : 'inline-block bg-slate-800 rounded-lg px-3 py-2 max-w-[85%]'
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-slate-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-lightGreen rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-lightGreen rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-lightGreen rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-darkGreen transition-colors"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 text-sm bg-darkGreen text-white rounded-lg hover:bg-lightGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
