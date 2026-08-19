'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function RailCopilotFab() {
  const [isOpen, setIsOpen] = useState(false);
  const activeAlerts = 2; // Mock badge count

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#FF8C42] shadow-[0_4px_20px_rgba(255,107,43,0.4)] flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-6 w-6 text-white" />
        
        {activeAlerts > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-[#0A1628] rounded-full text-[10px] font-bold text-white flex items-center justify-center"
          >
            {activeAlerts}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-[#0D1B2A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#1A2840] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#FF6B2B] to-[#FF8C42] flex items-center justify-center shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">RailCopilot</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Context Alert (Mock) */}
            <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-200">
                Context: You have 2 critical alerts pending review.
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-[#FF6B2B] to-[#FF8C42] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="bg-[#1A2840] border border-white/10 text-slate-200 text-sm p-3 rounded-2xl rounded-tl-sm shadow-sm">
                  Hi! I'm monitoring the network. How can I assist you with the current alerts or operations?
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pl-9">
                <button className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors">
                  Summarize active alerts
                </button>
                <button className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors">
                  Check NR zone delays
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#1A2840] border-t border-white/10">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask RailCopilot..."
                  className="w-full bg-[#0A1628] border border-white/10 text-white rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#FF6B2B]/50"
                />
                <button className="absolute right-1 top-1 bottom-1 p-1.5 bg-[#FF6B2B] hover:bg-[#FF8C42] text-white rounded-md transition-colors flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <Link 
                  href="/ai-assistant" 
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] text-slate-400 hover:text-[#FF6B2B] transition-colors"
                >
                  Open full assistant &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
