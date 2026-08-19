"use client";

import React, { useState } from "react";
import { Server, Database, Folder, GitBranch, Box, Settings, Play, Cloud, Map, BookOpen, Code, Activity, RefreshCw, ChevronLeft, ShieldAlert, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const DEMO_MCP_SERVERS = [
  { id: 1, name: "PostgreSQL MCP", desc: "Database query interface for live operational data.", icon: Database, connected: true, testing: false, enabled: true, usage: 127 },
  { id: 2, name: "Filesystem MCP", desc: "Railway document access for manuals and procedures.", icon: Folder, connected: true, testing: false, enabled: true, usage: 45 },
  { id: 3, name: "GitHub MCP", desc: "Code & deployment context for system diagnostics.", icon: GitBranch, connected: false, testing: false, enabled: false, usage: 0 },
  { id: 4, name: "Docker MCP", desc: "Container diagnostics and restart capabilities.", icon: Box, connected: true, testing: false, enabled: true, usage: 12 },
  { id: 5, name: "Kubernetes MCP", desc: "Cluster management and pod scaling via AI.", icon: Server, connected: false, testing: false, enabled: false, usage: 0 },
  { id: 6, name: "Playwright MCP", desc: "Browser automation & testing for external portals.", icon: Play, connected: true, testing: true, enabled: true, usage: 8 },
  { id: 7, name: "Weather MCP", desc: "Open-Meteo integration for localized delay prediction.", icon: Cloud, connected: true, testing: false, enabled: true, usage: 342 },
  { id: 8, name: "Maps/GIS MCP", desc: "Railway network geodata and geospatial queries.", icon: Map, connected: true, testing: false, enabled: true, usage: 89 },
  { id: 9, name: "Documentation MCP", desc: "Railway manuals RAG for policy adherence.", icon: BookOpen, connected: true, testing: false, enabled: true, usage: 156 },
  { id: 10, name: "OpenAPI MCP", desc: "API schema introspection for Ministry endpoints.", icon: Code, connected: true, testing: false, enabled: true, usage: 24 },
];

export default function MCPConfigPage() {
  const router = useRouter();
  const [servers, setServers] = useState(DEMO_MCP_SERVERS);

  const toggleEnabled = (id: number) => {
    setServers(servers.map(s => s.id === id ? { ...s, enabled: !s.enabled, connected: !s.enabled ? s.connected : false } : s));
  };

  const testConnection = (id: number) => {
    setServers(servers.map(s => s.id === id ? { ...s, testing: true } : s));
    setTimeout(() => {
      setServers(servers => servers.map(s => s.id === id ? { ...s, testing: false, connected: true, enabled: true } : s));
    }, 2000);
  };

  const totalQueries = servers.reduce((acc, curr) => acc + curr.usage, 0);

  return (
    <div className="flex h-screen w-full bg-[#0A1628] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur shrink-0 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MCP Ecosystem Configuration</h1>
            <p className="text-sm text-slate-400 mt-1">Model Context Protocol server management for RailCopilot AI</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Queries Today</span>
              <span className="text-lg font-bold text-indigo-400">{totalQueries}</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Avg Response</span>
              <span className="text-lg font-bold text-emerald-400">124ms</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => {
                const Icon = server.icon;
                return (
                  <div key={server.id} className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors shadow-lg">
                    {/* Status indicator bar */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${server.connected && !server.testing ? 'bg-emerald-500' : server.testing ? 'bg-amber-500' : 'bg-slate-600'}`} />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${server.enabled ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100">{server.name}</h3>
                          <div className="text-xs text-slate-400 mt-0.5">{server.usage} queries today</div>
                        </div>
                      </div>
                      
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="sr-only" checked={server.enabled} onChange={() => toggleEnabled(server.id)} />
                          <div className={`w-9 h-5 rounded-full transition-colors ${server.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                          <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform ${server.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </label>
                    </div>

                    <p className="text-sm text-slate-300 mb-6 flex-1">{server.desc}</p>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                      <div className="flex items-center gap-2">
                        {server.testing ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Testing...
                          </span>
                        ) : server.connected ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Disconnected
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => testConnection(server.id)}
                          disabled={server.testing}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                          title="Test Connection"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                          title="Configure"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Architecture Diagram */}
            <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
              <h2 className="text-lg font-bold text-slate-100 mb-6">Agentic Architecture Flow</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-black/20 rounded-xl border border-white/5">
                
                {/* LLM */}
                <div className="flex flex-col items-center gap-3 w-40 text-center relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">RailCopilot AI</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Claude 3.5 Sonnet</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-emerald-500/0" />
                  <div className="w-3 h-3 rounded-full bg-indigo-400 absolute shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-pulse" />
                </div>

                {/* Protocol */}
                <div className="flex flex-col items-center gap-3 w-40 text-center relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#0A1628] border-2 border-indigo-500 flex items-center justify-center shadow-lg">
                    <Activity className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">MCP Manager</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Context Router</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-indigo-500/0 via-emerald-500 to-emerald-500/0" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 absolute shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                </div>

                {/* Servers */}
                <div className="grid grid-cols-2 gap-2 w-48 relative z-10">
                  {[Database, Folder, Cloud, Code].map((Icon, i) => (
                    <div key={i} className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex flex-col items-center justify-center gap-1">
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <span className="text-[9px] text-emerald-300 uppercase font-bold tracking-wider">Server {i+1}</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">Security Notice</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All MCP connections operate over secure local IPC/WebSocket channels. Tools executing state-changing operations (like database writes or Kubernetes pod scaling) require explicit "human-in-the-loop" approval prompts before execution. Ensure proper network isolation when configuring remote MCP endpoints.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}


