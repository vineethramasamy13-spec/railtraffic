'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Paperclip, Mic, FileText, 
  Clock, AlertTriangle, Info, Map, Search, ChevronRight, X
} from 'lucide-react';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'user',
      content: 'Why is Route Delhi-Howrah congested?'
    },
    {
      role: 'assistant',
      content: `The Delhi-Howrah route is currently experiencing a **Moderate to High congestion** (Level 4/5) with average delays of 47 minutes. Multiple cascading factors have contributed to this situation over the last 4 hours:

1. **Weather Impact at Pt. Deen Dayal Upadhyaya Jn (MGS):** Heavy localized fog has reduced visibility to under 50m, forcing Loco Pilots to operate under restricted speed (max 30 km/h) as per Winter Safety SOP.
2. **Infrastructure Failure at NDLS:** A track circuit failure on Point 8 at New Delhi station occurred at 06:15 hrs, taking 45 minutes to restore, which delayed the morning outbound fleet.
3. **Cascading Effects:** Due to the delayed outbound fleet, inbound trains are being held at outer signals (Ghaziabad and Aligarh), causing a backlog of 14 express and 6 freight trains.

I recommend holding lower-priority freight traffic in the Kanpur loop lines for the next 2 hours to allow the passenger fleet to recover. Would you like me to draft an advisory for the affected stations?`,
      sources: [
        { title: 'Winter Operations Manual 2023', excerpt: 'Speed restrictions during fog conditions...' },
        { title: 'Signaling Incident Log - NDLS', excerpt: 'Track circuit failure Point 8 reported at 06:15...' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    const newMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { streamChat } = await import('@/lib/api-client');
      const assistantMessage = { role: 'assistant', content: '', sources: [] as any[] };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      let accumulatedText = '';
      const context = { current_page: 'ai-assistant', user_role: 'traffic_controller' };
      const sessionId = 'demo-session';

      const chatHistory = [...messages, newMsg];
      const stream = streamChat(chatHistory, context, sessionId);
      
      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            last.content = accumulatedText;
          }
          return updated;
        });
      }
    } catch (err) {
      console.warn("FastAPI chat stream failed, falling back to mock response.", err);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          const mockMsg = {
            role: 'assistant',
            content: `Based on current network telemetry and historical data, the optimal action is to issue an immediate caution order. I've analyzed the patterns and identified similar incidents from last month where this approach reduced delays by 15%.\n\nShall I proceed with preparing the official communication?`
          };
          if (last && last.role === 'assistant' && last.content === '') {
            updated[updated.length - 1] = mockMsg;
          } else {
            updated.push(mockMsg);
          }
          return updated;
        });
      }, 1200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-[1600px] mx-auto bg-[#0A1628] text-slate-100 overflow-hidden border-t border-white/5">
      {/* LEFT SIDEBAR */}
      <div className="w-[280px] hidden md:flex flex-col border-r border-white/10 bg-[#0D1B2A]">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-[#FF6B2B]" />
            <h2 className="font-bold text-lg">RailCopilot</h2>
          </div>
          <p className="text-xs text-slate-400 mb-3">AI Railway Operations Copilot</p>
          <span className="text-[10px] bg-[#1A2840] border border-white/10 px-2 py-1 rounded text-slate-300 w-full block text-center">
            Groq llama-3.3-70b • Gemini Fallback
          </span>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium mb-6 transition-colors flex items-center justify-center gap-2">
            + New Conversation
          </button>

          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Chats</h3>
          <div className="space-y-1 mb-8">
            {['Route Congestion Analysis', 'Signal Failure SOP Review', 'Weekly Performance Summary'].map((chat, i) => (
              <button key={i} className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate ${i === 0 ? 'bg-[#FF6B2B]/10 text-[#FF6B2B]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                {chat}
              </button>
            ))}
          </div>

          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Capabilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FileText, label: 'SOP RAG' },
              { icon: Clock, label: 'Delay Predict' },
              { icon: AlertTriangle, label: 'Root Cause' },
              { icon: Map, label: 'Rerouting' }
            ].map((cap, i) => (
              <div key={i} className="bg-[#1A2840] border border-white/5 p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-center">
                <cap.icon className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] text-slate-300">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#1A2840]/50">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Knowledge Base: 4 docs indexed
          </div>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col relative bg-[url('/grid-bg.svg')] bg-center bg-cover">
        <div className="absolute inset-0 bg-[#0A1628]/95 z-0" />
        
        {/* Header */}
        <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between relative z-10 bg-[#0D1B2A]/80 backdrop-blur">
          <div className="text-sm text-slate-300 flex items-center gap-2">
            Context: <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded">Operations Dashboard</span>
            <span className="text-slate-600">|</span>
            Role: <span className="text-white font-medium">Traffic Controller</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">How can I help you manage traffic today?</h2>
                <p className="text-slate-400">I have access to real-time telemetry, historical logs, and all railway manuals.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  "Why is Train 12301 delayed by 47 minutes?",
                  "What is the SOP for signal failure at a major station?",
                  "Generate executive summary of today's operations",
                  "Which zone has the worst on-time performance today?"
                ].map((prompt, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(prompt)}
                    className="p-4 bg-[#1A2840] border border-white/10 rounded-xl text-sm text-left hover:border-[#FF6B2B]/50 hover:bg-[#1A2840]/80 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#FF6B2B] to-orange-400 flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#1A2840] border border-white/10 text-white rounded-tr-sm' 
                      : 'bg-transparent border border-white/10 backdrop-blur rounded-tl-sm'
                  }`}>
                    <div className="text-sm prose prose-invert max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    
                    {msg.sources && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                        <p className="text-xs text-slate-400 font-semibold uppercase">Sources retrieved</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.sources.map((src: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded p-2 flex items-start gap-2">
                              <FileText className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-slate-200">{src.title}</p>
                                <p className="text-[10px] text-slate-400 line-clamp-1">{src.excerpt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-[#FF6B2B] to-orange-400 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-transparent border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 h-12">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0D1B2A] border-t border-white/10 relative z-10">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RailCopilot anything about operations, delays, or SOPs..."
              className="w-full bg-[#1A2840] border border-white/10 text-white rounded-xl pl-4 pr-32 py-4 focus:outline-none focus:border-[#FF6B2B]/50 focus:ring-1 focus:ring-[#FF6B2B]/50 resize-none min-h-[60px] max-h-[200px] text-sm custom-scrollbar"
              rows={1}
            />
            <div className="absolute right-2 bottom-3 flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Mic className="h-4 w-4" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-[#FF6B2B] hover:bg-[#FF8C42] disabled:opacity-50 disabled:hover:bg-[#FF6B2B] text-white rounded-lg transition-colors ml-1"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute -top-6 right-0 text-[10px] text-slate-500">
              {input.length} chars
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
