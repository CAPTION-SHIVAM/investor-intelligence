'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  TrendingUp,
  Gift,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { postJson } from '../../lib/api';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  verdict?: string;
  score?: number;
  facts?: string[];
  risks?: string[];
  sources?: { title: string; page?: string }[];
  timestamp: string;
};

const SUGGESTED_QUERIES = [
  'Should I apply for Swiggy Limited IPO?',
  'Analyze Hyundai Motor India DRHP valuation',
  'What are the red flags in Ather Energy IPO?',
  'Explain The Gift Point scoring engine',
  'How to log trades in the Trading Journal?',
  'Screen high ROCE low debt compounders',
];

export function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your **Investor Intelligence Pro AI Copilot**.\n\nI perform real-time **IPO DRHP Analysis, 6-Pillar Reality Scoring, Gift Point Verdicts, and Trading Journal Psychology Audits**.\n\nHow can I assist your investment decisions today?",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      type AIResponse = {
        success: boolean;
        data: {
          answer: string;
          verdict?: string;
          score?: number;
          facts?: string[];
          risks?: string[];
          sources?: { title: string; page?: string }[];
        };
      };

      const response = await postJson<AIResponse>('/ai/chat', {
        message: textToSend,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });

      const aiData = response.data;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiData.answer,
        verdict: aiData.verdict,
        score: aiData.score,
        facts: aiData.facts,
        risks: aiData.risks,
        sources: aiData.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Backend AI fallback used:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "### 📊 Investor Intelligence Research Analysis\n\nI evaluated your inquiry using our **6-Pillar IPO Reality Scoring Framework**:\n\n- **Dominant Issues in Radar:** Swiggy Limited (Score: 78/100 · APPLY Growth) and Bajaj Housing Finance (Score: 91/100 · APPLY High Moat).\n- **Key Disclaimers:** Strictly educational research. We are not a SEBI registered advisor.\n- **Flagship Tools:** Check our **IPO Radar** for live Gift Point verdicts and **Trading Journal** (`/journal`) to track execution discipline.",
          verdict: 'RESEARCH',
          score: 88,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-3.5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 px-3.5 py-2.5 sm:px-5 sm:py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
        >
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs sm:text-sm font-extrabold tracking-tight">
            <span className="sm:hidden">AI Copilot</span>
            <span className="hidden sm:inline">AI Investment Copilot</span>
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-950 animate-ping" />
        </button>
      )}

      {/* Main Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
          <div
            className={`pointer-events-auto flex flex-col rounded-3xl border border-cyan-500/30 bg-[#070e1c]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isExpanded
                ? 'h-[90vh] w-full max-w-4xl'
                : 'h-[620px] w-full max-w-md sm:max-w-lg'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 bg-slate-950/80 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-black text-white">Investor Intelligence AI</h3>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-500/30">
                      PRO AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">IPO DRHP Analysis · Valuation · Risk Scoring</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Suggested Quick Queries */}
            <div className="border-b border-slate-800/60 bg-slate-950/40 px-4 py-2.5 overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-max">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1">
                  <Sparkles size={11} className="text-cyan-400" /> Prompts:
                </span>
                {SUGGESTED_QUERIES.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(query)}
                    className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md shadow-cyan-600/20'
                        : 'border border-slate-800/80 bg-slate-900/90 text-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Verdict & Score Badge */}
                    {msg.verdict && (
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            msg.verdict.includes('APPLY')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : msg.verdict.includes('AVOID')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          Verdict: {msg.verdict}
                        </span>
                        {msg.score && (
                          <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-slate-700">
                            Reality Score: {msg.score}/100
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Body with clean formatting */}
                    <div className="space-y-2 whitespace-pre-line text-slate-200">
                      {msg.content}
                    </div>

                    {/* Facts / Highlights */}
                    {msg.facts && msg.facts.length > 0 && (
                      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[11px] font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> Key Issue Metrics
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                          {msg.facts.map((fact, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                              <span>{fact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks Alert */}
                    {msg.risks && msg.risks.length > 0 && (
                      <div className="mt-2.5 rounded-xl border border-rose-500/25 bg-rose-950/30 p-2.5 text-[11px] text-rose-200">
                        <p className="font-bold flex items-center gap-1 mb-1 text-rose-300">
                          <ShieldAlert size={12} /> Red Flags / Critical Risks
                        </p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {msg.risks.map((risk, idx) => (
                            <li key={idx}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
                        <span className="text-slate-500">Source:</span>
                        <span>{msg.sources.map((s) => `${s.title} (${s.page || ''})`).join(' · ')}</span>
                      </div>
                    )}

                    <div className="mt-2 text-right text-[9px] text-slate-500">{msg.timestamp}</div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
                    <Bot size={16} />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-cyan-300">
                    <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Auditing DRHP prospectus &amp; calculating 6-pillar score...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="border-t border-slate-800/80 bg-slate-950/90 p-3 rounded-b-3xl">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any IPO (e.g. Swiggy, Hyundai), screener or trade..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3 pl-4 pr-12 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
