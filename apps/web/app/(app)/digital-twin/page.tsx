"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, FastForward, Settings, Activity, Train, ShieldAlert } from "lucide-react"

export default function DigitalTwinPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)

  // Demo representation of NDLS platforms
  const platforms = [
    { id: 1, status: "OCCUPIED", train: "12002", color: "bg-amber-500", signal: "red" },
    { id: 2, status: "AVAILABLE", train: null, color: "bg-emerald-500", signal: "green" },
    { id: 3, status: "BLOCKED", train: null, color: "bg-red-500", signal: "red" },
    { id: 4, status: "OCCUPIED", train: "12951", color: "bg-amber-500", signal: "red" },
    { id: 5, status: "AVAILABLE", train: null, color: "bg-emerald-500", signal: "green" },
    { id: 6, status: "MAINTENANCE", train: null, color: "bg-slate-500", signal: "red" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Control Bar */}
      <div className="h-14 flex items-center justify-between px-4 glass-card mb-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary border-primary">Historical Replay</Badge>
          <span className="text-sm font-medium text-slate-300">New Delhi (NDLS) - Zone: NR</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400 font-mono">2026-08-18 14:30:00</span>
          <div className="flex bg-slate-800 rounded-md overflow-hidden border border-slate-700">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-300 hover:text-white" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-300 hover:text-white" onClick={() => setSpeed(speed === 1 ? 2 : 1)}>
              <FastForward className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* Left Panel - Stations */}
        <Card className="w-64 glass-card overflow-y-auto">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold uppercase text-slate-400">Track Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-2">
            {["New Delhi (NDLS)", "Kanpur Central (CNB)", "Prayagraj (PRYJ)", "Varanasi (BSB)"].map((st, i) => (
              <div key={i} className={`px-3 py-2 rounded-md text-sm cursor-pointer transition ${i === 0 ? 'bg-primary/20 text-white border border-primary/30' : 'text-slate-400 hover:bg-slate-800'}`}>
                {st}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Digital Twin Canvas */}
        <div className="flex-1 glass-card relative overflow-hidden rounded-lg border border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-semibold text-slate-200">Live Infrastructure Map</h3>
            <div className="flex space-x-4 text-xs">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Available</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Occupied</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Blocked</span>
            </div>
          </div>
          
          <div className="flex-1 bg-[#0a111a] p-8 relative flex items-center justify-center">
            {/* Very simplified SVG digital twin representation */}
            <svg width="100%" height="100%" viewBox="0 0 800 400" className="max-w-full max-h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Draw tracks */}
              {[50, 100, 150, 200, 250, 300].map((y, i) => (
                <g key={`track-${i}`}>
                  <line x1="0" y1={y} x2="800" y2={y} stroke="#334155" strokeWidth="4" />
                  {/* Platform rectangles */}
                  <rect x="200" y={y-15} width="400" height="30" rx="4" fill="rgba(30, 41, 59, 0.8)" stroke="#475569" />
                  <text x="210" y={y+5} fill="#94a3b8" fontSize="12" fontWeight="bold">PF {i+1}</text>
                  
                  {/* Signal circles */}
                  <circle cx="150" cy={y} r="6" fill={platforms[i].signal === 'green' ? '#10b981' : '#ef4444'} />
                  <circle cx="650" cy={y} r="6" fill={platforms[i].signal === 'green' ? '#10b981' : '#ef4444'} />
                  
                  {/* Trains on occupied platforms */}
                  {platforms[i].status === 'OCCUPIED' && (
                    <g transform={`translate(${250 + (isPlaying ? (Date.now() % 2000)/200 : 0)}, ${y-10})`}>
                      <rect width="150" height="20" rx="4" fill="#FF6B2B" />
                      <text x="10" y="14" fill="white" fontSize="10" fontWeight="bold">Train {platforms[i].train}</text>
                    </g>
                  )}
                  {platforms[i].status === 'BLOCKED' && (
                    <rect x="350" y={y-10} width="40" height="20" fill="url(#stripes)" />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Panel - AI Recommendations */}
        <Card className="w-80 glass-card flex flex-col">
          <CardHeader className="py-4 border-b border-slate-700/50">
            <CardTitle className="text-sm font-bold flex items-center text-primary">
              <Activity className="h-4 w-4 mr-2" />
              Intelligence Context
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Station Metrics</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                  <p className="text-xs text-slate-400">Throughput</p>
                  <p className="text-lg font-bold text-white">42/hr</p>
                </div>
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                  <p className="text-xs text-slate-400">Congestion</p>
                  <p className="text-lg font-bold text-warning">85%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase">Copilot Insights</h4>
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg space-y-2">
                <div className="flex items-start">
                  <ShieldAlert className="h-4 w-4 text-primary mt-0.5 mr-2 shrink-0" />
                  <p className="text-sm text-slate-200">Platform 3 is blocked due to unexpected track circuit failure.</p>
                </div>
                <Button size="sm" className="w-full bg-primary/20 text-primary hover:bg-primary/30 h-7 text-xs">
                  Generate Reroute Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
