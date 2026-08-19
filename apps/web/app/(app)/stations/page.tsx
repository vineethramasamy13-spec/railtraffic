"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_STATIONS, DEMO_TRAINS } from "@/lib/demo-data";
import { Search, MapPin, Wifi, Activity, Train, ShieldCheck, Thermometer, Droplets, Cloud, Sparkles, X, GitMerge, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function StationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All Zones");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const zones = ["All Zones", ...Array.from(new Set(DEMO_STATIONS.map(s => s.zone))).sort()];
  const categories = ["All Categories", "A1", "A", "B", "C", "D"];

  const filteredStations = DEMO_STATIONS.filter((s) => {
    const matchesSearch = s.code.includes(searchQuery.toUpperCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === "All Zones" ? true : s.zone === zoneFilter;
    const matchesCategory = categoryFilter === "All Categories" ? true : s.category === categoryFilter;

    return matchesSearch && matchesZone && matchesCategory;
  });

  const getHealthColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getHealthDotColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const pseudoRandomHealth = (id: string) => {
    const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return 65 + (hash % 35); // 65 to 100
  };

  const pseudoRandomTrains = (id: string) => {
    const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return hash % 5; // 0 to 4
  };

  return (
    <div className="flex h-screen w-full bg-[#0A1628] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Station Intelligence Network</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Activity className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-medium text-blue-400 tracking-wide uppercase">Monitoring {DEMO_STATIONS.length} Stations</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search station code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A2840] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FF6B2B] transition-colors text-slate-100 placeholder:text-slate-500"
              />
            </div>
            
            <select 
              className="bg-[#1A2840] border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-100 appearance-none min-w-[140px]"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>

            <div className="flex gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    categoryFilter === c 
                      ? 'bg-[#FF6B2B] border-[#FF6B2B] text-white' 
                      : 'bg-[#1A2840] border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => {
              const health = pseudoRandomHealth(station.id);
              const activeTrains = pseudoRandomTrains(station.id);
              
              return (
                <div 
                  key={station.id}
                  onClick={() => setSelectedStation({ ...station, health, activeTrains })}
                  className="bg-[#1A2840]/60 hover:bg-[#1A2840] backdrop-blur border border-white/10 hover:border-white/20 transition-all rounded-xl p-5 cursor-pointer group flex flex-col relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="bg-[#0A1628] border border-white/10 rounded-lg w-12 h-12 flex items-center justify-center font-mono font-bold text-lg text-slate-100 shadow-inner">
                        {station.code}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-lg group-hover:text-[#FF6B2B] transition-colors">{station.name}</h3>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {station.city}, {station.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
                      {station.zone}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase">
                      Cat {station.category}
                    </span>
                    {station.isJunction && (
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                        <GitMerge className="w-3 h-3" /> Junction
                      </span>
                    )}
                    {station.hasWifi && (
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> WiFi
                      </span>
                    )}
                  </div>

                  <div className="mt-auto grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Platforms</span>
                      <span className="font-medium text-slate-200">{station.totalPlatforms}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Trains</span>
                      <div className="flex items-center gap-1.5">
                        <Train className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-200">{activeTrains}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Health</span>
                      <div className={`px-2 py-0.5 rounded-full border ${getHealthColor(health)} text-xs font-bold flex items-center gap-1.5 mt-0.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getHealthDotColor(health)}`} />
                        {health}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredStations.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-[#1A2840]/30 rounded-xl border border-white/5">
                No stations found matching the current filters.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Drawer */}
      <AnimatePresence>
        {selectedStation && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStation(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[600px] bg-[#0D1B2A] border-l border-white/10 z-50 shadow-2xl flex flex-col overflow-hidden font-sans"
            >
              <div className="p-6 border-b border-white/10 bg-[#1A2840]/50 relative shrink-0">
                <button 
                  onClick={() => setSelectedStation(null)}
                  className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex gap-4 items-center mb-4">
                  <div className="bg-[#0A1628] border border-white/20 rounded-xl w-16 h-16 flex items-center justify-center font-mono font-bold text-2xl text-slate-100 shadow-inner">
                    {selectedStation.code}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{selectedStation.name}</h2>
                    <h3 className="text-sm font-medium text-slate-400">{selectedStation.nameHindi}</h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                  <div><span className="text-slate-500">Zone:</span> <span className="font-medium text-slate-100">{selectedStation.zone}</span></div>
                  <div><span className="text-slate-500">Division:</span> <span className="font-medium text-slate-100">{selectedStation.division}</span></div>
                  <div><span className="text-slate-500">Category:</span> <span className="font-medium text-slate-100">{selectedStation.category}</span></div>
                  <div><span className="text-slate-500">Coordinates:</span> <span className="font-medium text-slate-100">{selectedStation.latitude.toFixed(2)}°, {selectedStation.longitude.toFixed(2)}°</span></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Health Status Panel */}
                <div className="bg-[#1A2840]/60 rounded-xl border border-white/10 p-5">
                  <h3 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Infrastructure Health
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Signals', status: 'OK', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
                      { name: 'Power', status: 'OK', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
                      { name: 'Comm Network', status: 'DEGRADED', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
                      { name: 'Track Circuits', status: 'OK', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
                    ].map((sys, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-sm text-slate-300">{sys.name}</span>
                        <div className="flex items-center gap-2">
                          {sys.icon}
                          <span className={`text-xs font-bold ${sys.status === 'OK' ? 'text-emerald-400' : 'text-amber-400'}`}>{sys.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Assessment Card */}
                <div className="bg-gradient-to-br from-[#1A2840] to-[#0A1628] rounded-xl border border-indigo-500/30 p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-slate-100">AI Station Assessment</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Station operations are normal. Minor degradation in secondary communication network detected in sector 4. Passenger density at platforms 1 and 2 is within safe limits for current time.
                  </p>
                  <div className="bg-black/30 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Recommendations</h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> Dispatch telecom team to inspect sector 4 distribution box.</li>
                      <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> Prepare for incoming Vande Bharat Express at Platform 1 in 45 mins.</li>
                    </ul>
                  </div>
                </div>

                {/* Platform Occupancy Grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-wider">Platform Occupancy</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: selectedStation.totalPlatforms }).map((_, idx) => {
                      // Pseudo random status
                      const pfNum = idx + 1;
                      const rand = (selectedStation.id.charCodeAt(0) + pfNum * 7) % 10;
                      let status = "AVAILABLE";
                      let train = "";
                      let colorClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                      
                      if (rand < 3) {
                        status = "OCCUPIED";
                        train = DEMO_TRAINS[rand % DEMO_TRAINS.length].trainNumber;
                        colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400";
                      } else if (rand === 9) {
                        status = "BLOCKED";
                        colorClass = "bg-red-500/10 border-red-500/30 text-red-400";
                      }

                      return (
                        <div key={idx} className={`p-3 rounded-lg border ${colorClass} flex flex-col justify-between h-20`}>
                          <div className="flex justify-between items-start">
                            <span className="font-mono font-bold text-lg text-slate-200">PF-{pfNum}</span>
                            {status === "BLOCKED" && <XCircle className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block">{status}</span>
                            {train && <span className="text-xs text-slate-200 block truncate">Train {train}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weather */}
                <div className="bg-[#1A2840]/60 rounded-xl border border-white/5 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Current Weather</div>
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

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
