"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { Search, MapPin, Clock, Train, ArrowRight, AlertCircle, ChevronRight, Activity, Thermometer, Droplets, Wind, Sparkles, X, ActivitySquare } from "lucide-react";

export default function TrainsPage() {
  const trains = useAppStore(state => state.trains);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedTrain, setSelectedTrain] = useState<any>(null);

  const statuses = ["All Status", "On Time", "Delayed", "Running Late", "Cancelled"];
  const categories = ["All", "Rajdhani", "Shatabdi", "Vande Bharat", "Express", "Mail", "Goods", "Duronto"];

  const filteredTrains = trains.filter((t) => {
    const matchesSearch = t.trainNumber.includes(searchQuery) || t.trainName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ? true :
      statusFilter === "On Time" ? t.status === "ON_TIME" :
      statusFilter === "Delayed" ? t.status === "DELAYED" :
      statusFilter === "Running Late" ? t.status === "RUNNING_LATE" :
      statusFilter === "Cancelled" ? t.status === "CANCELLED" : true;
    const matchesCategory = categoryFilter === "All" ? true : t.category === categoryFilter.toUpperCase().replace(" ", "_");

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const onTimeCount = trains.filter(t => t.status === "ON_TIME").length;
  const delayedCount = trains.filter(t => t.status === "DELAYED").length;
  const runningLateCount = trains.filter(t => t.status === "RUNNING_LATE").length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "RAJDHANI": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "SHATABDI": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "VANDE_BHARAT": return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "EXPRESS": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "MAIL": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "DURONTO": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TIME": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "DELAYED": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "RUNNING_LATE": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A1628] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-6 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Train Operations Center</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Live Update</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-emerald-400 font-bold text-lg">{onTimeCount}</span>
                <span className="text-slate-400 text-xs">On Time</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-amber-400 font-bold text-lg">{delayedCount}</span>
                <span className="text-slate-400 text-xs">Delayed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-red-400 font-bold text-lg">{runningLateCount}</span>
                <span className="text-slate-400 text-xs">Late</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search train no. or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A2840] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FF6B2B] transition-colors text-slate-100 placeholder:text-slate-500"
              />
            </div>
            
            <div className="flex gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    statusFilter === s 
                      ? 'bg-[#FF6B2B] border-[#FF6B2B] text-white' 
                      : 'bg-[#1A2840] border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === c 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'bg-[#1A2840] border border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bg-[#1A2840]/80 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Train #</th>
                  <th className="px-6 py-4 font-medium">Name & Category</th>
                  <th className="px-6 py-4 font-medium">Route</th>
                  <th className="px-6 py-4 font-medium">Status & Delay</th>
                  <th className="px-6 py-4 font-medium">Occupancy</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredTrains.map((train) => {
                  const occPercent = Math.round((train.occupancy / train.capacity) * 100);
                  return (
                    <tr 
                      key={train.id} 
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => setSelectedTrain(train)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-white">{train.trainNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-200">{train.trainName}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded w-fit border ${getCategoryColor(train.category)}`}>
                            {train.category.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="font-medium truncate max-w-[100px]">{train.originCode}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="font-medium truncate max-w-[100px]">{train.destinationCode}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex gap-1 items-center">
                          <MapPin className="w-3 h-3" /> {train.currentStation}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStatusColor(train.status)}`}>
                            {train.status.replace("_", " ")}
                          </span>
                          <span className={`text-xs font-bold ${train.delayMinutes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {train.delayMinutes > 0 ? `+${train.delayMinutes} mins` : 'On Time'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">{train.occupancy}/{train.capacity}</span>
                            <span className={occPercent > 90 ? 'text-red-400' : occPercent > 75 ? 'text-amber-400' : 'text-emerald-400'}>{occPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${occPercent > 90 ? 'bg-red-500' : occPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${occPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="px-4 py-1.5 bg-[#FF6B2B]/10 text-[#FF6B2B] hover:bg-[#FF6B2B] hover:text-white border border-[#FF6B2B]/20 transition-all rounded-md text-xs font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrain(train);
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredTrains.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No trains found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedTrain && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrain(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#0D1B2A] border-l border-white/10 z-50 shadow-2xl flex flex-col overflow-hidden font-sans"
            >
              <div className="p-6 border-b border-white/10 bg-[#1A2840]/50 relative shrink-0">
                <button 
                  onClick={() => setSelectedTrain(null)}
                  className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-2xl font-bold text-white">{selectedTrain.trainNumber}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStatusColor(selectedTrain.status)}`}>
                    {selectedTrain.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-200 mb-4">{selectedTrain.trainName}</h2>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Delay</span>
                    <span className={`font-bold ${selectedTrain.delayMinutes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedTrain.delayMinutes} m
                    </span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Speed</span>
                    <span className="font-bold text-slate-200">84 km/h</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col gap-1 col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Next Halt</span>
                    <span className="font-bold text-slate-200 truncate">{selectedTrain.nextStation}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {selectedTrain.delayMinutes > 0 && (
                  <div className="bg-gradient-to-br from-[#1A2840] to-[#0A1628] rounded-xl border border-indigo-500/30 p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <h3 className="font-bold text-slate-100">AI Delay Analysis</h3>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        XGBoost + SHAP • 87% Conf
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">Weather (Fog)</span>
                          <span className="text-red-400 font-medium">+{Math.floor(selectedTrain.delayMinutes * 0.6)} min</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">Track Maintenance</span>
                          <span className="text-amber-400 font-medium">+{Math.floor(selectedTrain.delayMinutes * 0.3)} min</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      Primary delay caused by dense fog near {selectedTrain.currentStation} reducing visibility. Secondary impact from scheduled track maintenance block at preceding section.
                    </p>
                    
                    <div className="bg-black/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Suggested Actions</h4>
                      <ul className="text-xs text-slate-300 space-y-2">
                        <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-[#FF6B2B] mt-1.5 shrink-0" /> Alert destination station for late arrival platforming.</li>
                        <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-[#FF6B2B] mt-1.5 shrink-0" /> Coordinate with adjacent division for priority clearance.</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="bg-[#1A2840]/60 rounded-xl border border-white/5 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Weather at {selectedTrain.currentStation}</div>
                      <div className="text-sm font-semibold text-slate-200">Partly Cloudy</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-bold">28°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-bold">65%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-wider">Route Timeline</h3>
                  <div className="relative pl-4 space-y-6">
                    <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-white/10" />
                    
                    <div className="relative flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-500 z-10 flex shrink-0" />
                      <div className="-mt-1">
                        <div className="text-sm font-bold text-slate-200">{selectedTrain.origin} ({selectedTrain.originCode})</div>
                        <div className="text-xs text-slate-500">{selectedTrain.scheduledDeparture} • Departed</div>
                      </div>
                    </div>

                    <div className="relative flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-[#FF6B2B] shadow-[0_0_10px_rgba(255,107,43,0.6)] z-10 flex shrink-0 animate-pulse border-2 border-white/20" />
                      <div className="-mt-1">
                        <div className="text-sm font-bold text-[#FF6B2B]">{selectedTrain.currentStation}</div>
                        <div className="text-xs text-slate-500">Current Location</div>
                      </div>
                    </div>

                    <div className="relative flex gap-4 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-[#1A2840] border-2 border-slate-500 z-10 flex shrink-0" />
                      <div className="-mt-1">
                        <div className="text-sm font-bold text-slate-200">{selectedTrain.nextStation}</div>
                        <div className="text-xs text-slate-500">Upcoming</div>
                      </div>
                    </div>

                    <div className="relative flex gap-4 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-[#1A2840] border-2 border-slate-500 z-10 flex shrink-0" />
                      <div className="-mt-1">
                        <div className="text-sm font-bold text-slate-200">{selectedTrain.destination} ({selectedTrain.destinationCode})</div>
                        <div className="text-xs text-slate-500">{selectedTrain.scheduledArrival} • Scheduled</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
