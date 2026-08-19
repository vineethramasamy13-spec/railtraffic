"use client"

import React, { useState } from "react"
import { useAuthStore } from "@/store"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Train, Clock, Users, Activity, Download, BrainCircuit } from "lucide-react"

export default function ExecutiveDashboard() {
  const { user } = useAuthStore()
  const router = useRouter()
  
  if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    if (typeof window !== "undefined") router.push("/dashboard")
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Executive Intelligence Dashboard</h1>
          <p className="text-slate-400 mt-1">National Performance & Strategic AI Insights</p>
        </div>
        <Button className="bg-primary text-white">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Trains" value="14,253" icon={<Train />} trend={2.4} trendDirection="up" />
        <StatCard title="Network On-Time" value="84.5%" icon={<Clock />} trend={1.2} trendDirection="down" />
        <StatCard title="Passenger Volume" value="23.4M" icon={<Users />} trend={5.1} trendDirection="up" />
        <StatCard title="Delay Impact" value="₹42.5M" icon={<Activity />} trend={8.4} trendDirection="down" className="border-destructive/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 glass-card">
          <CardHeader>
            <CardTitle>90-Day Delay Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-white/5">
            <p className="text-slate-500">ECharts Instance: Multi-line trend chart showing historical delays across top 5 zones.</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>AI Strategic Recommendations</CardTitle>
            <BrainCircuit className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { text: "Allocate 2 additional rakes to Northern Railway to offset predicted weekend congestion.", impact: "High" },
              { text: "Schedule preventive maintenance on Howrah-Delhi corridor switch points within 48h.", impact: "Critical" },
              { text: "Revise layover margins at Mumbai CSMT during peak hours (17:00-20:00).", impact: "Medium" },
            ].map((rec, i) => (
              <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-sm text-slate-300">{rec.text}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-xs font-semibold ${rec.impact === 'Critical' ? 'text-destructive' : 'text-primary'}`}>
                    {rec.impact} Priority
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-white">Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Zone Performance Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center border-t border-white/5">
          <p className="text-slate-500">ECharts Instance: Heatmap of 18 zones vs KPIs (On-Time, Incidents, Utilization)</p>
        </CardContent>
      </Card>
    </div>
  )
}
