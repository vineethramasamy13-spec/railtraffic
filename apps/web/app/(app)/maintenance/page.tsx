"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { Wrench, AlertTriangle, ShieldCheck, Activity } from "lucide-react"
import { XAIPanel } from "@/components/ai/xai-panel"

export default function MaintenancePage() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  const handleAssetClick = () => {
    setSelectedAsset({
      value: "High Risk",
      unit: "Failure Probability: 73%",
      confidence: 0.85,
      factors: [
        { name: "Asset Age", impact: 40, direction: "negative", description: "Track section exceeds standard lifespan by 2 years" },
        { name: "Recent Faults", impact: 35, direction: "negative", description: "3 minor micro-fractures detected in last 30 days" },
        { name: "Weather Exposure", impact: 25, direction: "negative", description: "Heavy monsoons eroded track ballast" },
      ],
      suggestedActions: ["Schedule Immediate Ultrasonic Testing", "Enforce 30kmph Speed Restriction", "Dispatch Maintenance Crew"],
      modelName: "Random Forest",
      modelVersion: "2.4.1"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Predictive Maintenance</h1>
          <p className="text-slate-400 mt-1">AI-driven asset health monitoring and schedule optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assets Monitored" value="842,105" icon={<ShieldCheck />} />
        <StatCard title="High Risk Items" value="14" icon={<AlertTriangle />} className="border-destructive/50 text-destructive" />
        <StatCard title="Scheduled This Week" value="142" icon={<Wrench />} />
        <StatCard title="Avg Health Score" value="92.4%" icon={<Activity />} trend={0.5} trendDirection="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Asset Health Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "TRK-NDLS-042", type: "Track Section", location: "New Delhi - Kanpur", score: 42, status: "Critical" },
                { id: "SIG-PNBE-11", type: "Signal Block", location: "Patna Junction", score: 65, status: "Warning" },
                { id: "SWT-CSMT-09", type: "Switch Point", location: "Mumbai CSMT", score: 71, status: "Warning" },
                { id: "OHE-BPL-55", type: "Overhead Equipment", location: "Bhopal Route", score: 88, status: "Healthy" },
              ].map((asset, i) => (
                <div key={i} 
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-primary/50 cursor-pointer transition"
                  onClick={handleAssetClick}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${asset.status === 'Critical' ? 'bg-destructive/20 text-destructive' : asset.status === 'Warning' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{asset.id} <span className="text-sm font-normal text-slate-400 ml-2">{asset.type}</span></p>
                      <p className="text-sm text-slate-500">{asset.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      asset.status === 'Critical' ? 'border-destructive text-destructive' :
                      asset.status === 'Warning' ? 'border-warning text-warning' : 'border-success text-success'
                    }>{asset.status}</Badge>
                    <div className="mt-2 text-sm text-slate-400">Health: {asset.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center border-t border-white/5">
            <p className="text-slate-500">Interactive 30-day schedule view</p>
          </CardContent>
        </Card>
      </div>

      <XAIPanel 
        prediction={selectedAsset} 
        isOpen={selectedAsset !== null} 
        onClose={() => setSelectedAsset(null)} 
      />
    </div>
  )
}
