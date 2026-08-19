"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, FileSpreadsheet, FileIcon, Settings, Calendar, Clock, Sparkles, ChevronDown, CheckCircle2, Loader2, Play } from "lucide-react";

const DEMO_REPORTS = [
  { id: 1, title: "Daily Operations Report", date: "2024-08-17", format: "PDF", status: "Ready", aiSummary: "Operations normal across 85% of zones. Average delay increased by 4 mins due to weather in Northern region." },
  { id: 2, title: "Delay Analysis Q2 2024", date: "2024-07-01", format: "Excel", status: "Ready", aiSummary: "Q2 showed a 12% improvement in on-time performance compared to Q1. Track maintenance accounted for 30% of total delays." },
  { id: 3, title: "Station Performance: NR Zone", date: "2024-08-15", format: "PDF", status: "Ready", aiSummary: "New Delhi station handled peak capacity efficiently. Throughput increased by 5% week-over-week." },
  { id: 4, title: "Executive Summary August", date: "2024-08-01", format: "PDF", status: "Ready", aiSummary: "Network health score stable at 78.6. Critical infrastructure alerts reduced by 15%." },
  { id: 5, title: "Incident Report #IR-2024-156", date: "2024-08-10", format: "PDF", status: "Ready", aiSummary: "Signal failure at CSMT resolved within 45 mins. 12 trains impacted. Root cause: Power surge." },
  { id: 6, title: "Zone Comparison FY24", date: "2024-04-01", format: "Excel", status: "Ready", aiSummary: "South Western Railway (SWR) maintained the highest on-time percentage (83.2%). NFR requires operational attention." },
  { id: 7, title: "Monthly Performance July", date: "2024-07-31", format: "PDF", status: "Ready", aiSummary: "Total passenger throughput: 85 million. System-wide delays averaged 18.3 minutes per train." },
  { id: 8, title: "Custom Analytics Export", date: "2024-08-14", format: "CSV", status: "Ready", aiSummary: null },
];

const SCHEDULED_REPORTS = [
  { id: 1, title: "Daily Executive Summary", frequency: "Daily at 08:00", nextRun: "Tomorrow, 08:00 AM", format: "PDF" },
  { id: 2, title: "Weekly Delay Analysis", frequency: "Weekly (Monday)", nextRun: "Monday, 09:00 AM", format: "Excel" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  const [reportType, setReportType] = useState("Daily Operations");
  const [format, setFormat] = useState("PDF");
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerationSuccess(false);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenerationSuccess(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);
  };

  const getFormatIcon = (fmt: string) => {
    switch(fmt) {
      case "PDF": return <FileText className="w-4 h-4 text-red-400" />;
      case "Excel": return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case "CSV": return <FileIcon className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A1628] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur shrink-0">
          <h1 className="text-2xl font-bold tracking-tight">Report Center</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            
            {/* LEFT: Report Builder */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#FF6B2B]" />
                  Generate Report
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Report Type</label>
                    <select 
                      className="w-full bg-[#0A1628] border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option>Daily Operations</option>
                      <option>Delay Analysis</option>
                      <option>Station Performance</option>
                      <option>Incident Report</option>
                      <option>Executive Summary</option>
                      <option>Custom Analytics</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="date" className="w-full bg-[#0A1628] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200 custom-date-input" defaultValue="2024-08-01" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="date" className="w-full bg-[#0A1628] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200 custom-date-input" defaultValue="2024-08-17" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zone / Station</label>
                    <select className="w-full bg-[#0A1628] border border-white/10 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200">
                      <option>All Zones (System-wide)</option>
                      <option>Northern Railway (NR)</option>
                      <option>Western Railway (WR)</option>
                      <option>Central Railway (CR)</option>
                      <option>Southern Railway (SR)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Format</label>
                    <div className="flex gap-2">
                      {["PDF", "Excel", "CSV"].map(f => (
                        <button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${
                            format === f 
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                              : 'bg-[#0A1628] border-white/10 text-slate-400 hover:border-white/30'
                          }`}
                        >
                          {getFormatIcon(f)} {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="sr-only" checked={aiSummaryEnabled} onChange={(e) => setAiSummaryEnabled(e.target.checked)} />
                        <div className={`w-10 h-5 rounded-full transition-colors ${aiSummaryEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform ${aiSummaryEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white flex items-center gap-2">
                        Include AI Executive Summary <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group mb-3">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="sr-only" checked={isScheduled} onChange={(e) => setIsScheduled(e.target.checked)} />
                        <div className={`w-10 h-5 rounded-full transition-colors ${isScheduled ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                        <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform ${isScheduled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">Schedule Report</span>
                    </label>
                    
                    {isScheduled && (
                      <div className="grid grid-cols-2 gap-3 pl-13 animate-in fade-in slide-in-from-top-2">
                        <select className="bg-[#0A1628] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                        <input type="time" defaultValue="08:00" className="bg-[#0A1628] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 text-slate-200 custom-time-input" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    {!generating && !generationSuccess && (
                      <button 
                        onClick={handleGenerate}
                        className="w-full bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-[#FF6B2B]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> {isScheduled ? 'Save Schedule' : 'Generate Report'}
                      </button>
                    )}
                    
                    {generating && (
                      <div className="w-full bg-[#0A1628] border border-white/10 py-3 rounded-lg flex flex-col items-center justify-center gap-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-[#FF6B2B] font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" /> Compiling Data...
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF6B2B] transition-all duration-300 ease-out" style={{ width: `${generationProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {generationSuccess && !isScheduled && (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/30 py-3 rounded-lg flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                          <CheckCircle2 className="w-5 h-5" /> Report Ready
                        </div>
                        <button 
                          onClick={() => setGenerationSuccess(false)}
                          className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3 h-3" /> Download {format}
                        </button>
                      </div>
                    )}

                    {generationSuccess && isScheduled && (
                      <div className="w-full bg-blue-500/10 border border-blue-500/30 py-3 rounded-lg flex items-center justify-center gap-2 text-sm text-blue-400 font-bold">
                        <CheckCircle2 className="w-5 h-5" /> Schedule Saved
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: History */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Reports
                </h2>

                <div className="space-y-3">
                  {DEMO_REPORTS.map((report) => (
                    <div key={report.id} className="bg-[#0A1628] border border-white/5 rounded-lg overflow-hidden group hover:border-white/10 transition-colors">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            {getFormatIcon(report.format)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-200">{report.title}</h3>
                            <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                              <span>{report.date}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold">{report.format}</span>
                              <span className="text-emerald-500 font-medium">{report.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {report.aiSummary && (
                            <button 
                              onClick={() => setExpandedSummaryId(expandedSummaryId === report.id ? null : report.id)}
                              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1.5 rounded transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              AI Summary
                              <ChevronDown className={`w-3 h-3 transition-transform ${expandedSummaryId === report.id ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* AI Summary Expansion */}
                      <AnimatePresence>
                        {expandedSummaryId === report.id && report.aiSummary && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-white/5">
                              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3 text-sm text-slate-300 leading-relaxed relative">
                                <Sparkles className="w-4 h-4 text-indigo-500/30 absolute right-3 top-3" />
                                {report.aiSummary}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Scheduled Reports
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SCHEDULED_REPORTS.map((schedule) => (
                    <div key={schedule.id} className="bg-[#0A1628] border border-white/5 rounded-lg p-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-200 text-sm mb-1">{schedule.title}</h3>
                        <div className="text-xs text-slate-400 space-y-1">
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {schedule.frequency}</div>
                          <div className="flex items-center gap-1 text-emerald-500/80"><Play className="w-3 h-3" /> Next: {schedule.nextRun}</div>
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold text-slate-400">
                        {schedule.format}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-date-input::-webkit-calendar-picker-indicator,
        .custom-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
