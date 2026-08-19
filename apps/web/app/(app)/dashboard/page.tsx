'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { 
  Train, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquareWarning,
  AlertCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { DEMO_ALERTS, DEMO_ZONE_PERFORMANCE } from '@/lib/demo-data';
import { useAppStore } from '@/store';

export default function DashboardPage() {
  const alerts = (DEMO_ALERTS || []) as any[];
  const trains = useAppStore(state => state.trains);
  const zones = (DEMO_ZONE_PERFORMANCE || []) as any[];

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const activeAlerts = alerts.filter(a => a.status === 'Active' || a.status !== 'Resolved').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  } as const;

  const delayDonutOptions = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center', textStyle: { color: '#94a3b8' } },
    series: [
      {
        name: 'Delay Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1A2840',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: '20', fontWeight: 'bold', color: '#f8fafc' }
        },
        labelLine: { show: false },
        data: [
          { value: 65, name: 'On-Time', itemStyle: { color: '#10b981' } },
          { value: 20, name: 'Slight (<15m)', itemStyle: { color: '#facc15' } },
          { value: 10, name: 'Moderate (15-45m)', itemStyle: { color: '#f97316' } },
          { value: 5, name: 'Severe (>45m)', itemStyle: { color: '#ef4444' } }
        ]
      }
    ]
  };

  const throughputLineOptions = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Trains', 'On-Time Rate'], textStyle: { color: '#94a3b8' }, bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({length: 24}, (_, i) => `${i}:00`),
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: [
      { type: 'value', name: 'Trains', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
      { type: 'value', name: 'Rate (%)', max: 100, axisLabel: { color: '#94a3b8' }, splitLine: { show: false } }
    ],
    series: [
      {
        name: 'Trains',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210, 250, 280, 290, 310, 305, 290, 280, 310, 320, 340, 350, 310, 280, 240, 200, 160, 140],
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59, 130, 246, 0.5)' }, { offset: 1, color: 'rgba(59, 130, 246, 0)' }]
          }
        }
      },
      {
        name: 'On-Time Rate',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [85, 86, 88, 85, 84, 80, 75, 70, 68, 72, 75, 78, 80, 82, 79, 75, 72, 68, 70, 75, 80, 82, 85, 86],
        itemStyle: { color: '#10b981' }
      }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'ON TIME': return 'bg-emerald-500/20 text-emerald-500';
      case 'DELAYED': return 'bg-red-500/20 text-red-500';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <motion.div 
      initial="hidden" animate="show" variants={containerVariants}
      className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0A1628] text-slate-100"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Command Center</h1>
          <p className="text-slate-400">Real-time railway intelligence — Historical Replay Mode</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#1A2840] border border-white/10 rounded-lg backdrop-blur flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
          <div className="px-4 py-2 bg-[#1A2840] border border-white/10 rounded-lg backdrop-blur">
            <span className="text-sm text-slate-400">Time: </span>
            <span className="text-sm font-medium">{new Date().toLocaleTimeString('en-IN', { hour12: false })}</span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalAlerts > 0 && (
        <motion.div variants={itemVariants} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">{criticalAlerts} Critical Alerts Require Immediate Attention</span>
          </div>
          <Link href="/alerts" className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
            View All
          </Link>
        </motion.div>
      )}

      {/* KPI Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Trains Running', value: '213', icon: Train, color: 'text-blue-500', trend: '+12' },
          { title: 'On-Time %', value: '71.4%', icon: Activity, color: 'text-emerald-500', trend: '+2.1%', up: true },
          { title: 'Avg Delay', value: '18.3 m', icon: Clock, color: 'text-amber-500', trend: '-1.2m', up: true },
          { title: 'Active Alerts', value: activeAlerts.toString(), badge: criticalAlerts.toString(), icon: AlertCircle, color: 'text-orange-500' },
          { title: 'Network Health', value: '78.6%', icon: CheckCircle2, color: 'text-indigo-500', progress: 78.6 }
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-[#1A2840] border border-white/10 p-5 rounded-xl backdrop-blur relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`h-16 w-16 ${stat.color}`} />
            </div>
            <p className="text-sm text-slate-400 font-medium mb-1">{stat.title}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              {stat.badge && <span className="mb-1 px-2 py-0.5 rounded bg-red-500 text-white text-xs font-bold">{stat.badge} CRIT</span>}
              {stat.trend && (
                <span className={`mb-1 flex items-center text-sm font-medium ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </span>
              )}
            </div>
            {stat.progress && (
              <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stat.progress}%` }} />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-[#1A2840] border border-white/10 rounded-xl p-5 backdrop-blur">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-slate-400" /> Delay Distribution
          </h3>
          <div className="h-[300px]">
            <ReactECharts option={delayDonutOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-[#1A2840] border border-white/10 rounded-xl p-5 backdrop-blur">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-400" /> Hourly Traffic Flow
          </h3>
          <div className="h-[300px]">
            <ReactECharts option={throughputLineOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </motion.div>
      </div>

      {/* 3 Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Panel */}
        <motion.div variants={itemVariants} className="bg-[#1A2840] border border-white/10 rounded-xl flex flex-col backdrop-blur h-[450px]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-orange-500" /> Active Alerts
            </h3>
            <span className="bg-slate-700/50 text-xs px-2 py-1 rounded text-slate-300">{activeAlerts} Total</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {alerts.slice(0, 5).map((alert, i) => (
              <div key={i} className="bg-[#0A1628]/50 border border-white/5 p-3 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-400">{alert.timeAgo || 'Just now'}</span>
                </div>
                <h4 className="text-sm font-medium line-clamp-2">{alert.title}</h4>
                <button className="text-xs text-[#FF6B2B] hover:text-[#FF8C42] text-left font-medium mt-1">
                  Acknowledge &rarr;
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Trains Panel */}
        <motion.div variants={itemVariants} className="bg-[#1A2840] border border-white/10 rounded-xl flex flex-col backdrop-blur h-[450px]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <Train className="h-4 w-4 text-blue-500" /> Live Train Status
            </h3>
            <Link href="/trains" className="text-xs text-[#FF6B2B] hover:underline">View Map</Link>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 rounded-tl-lg">Train</th>
                  <th className="px-3 py-2">Route</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right rounded-tr-lg">Delay</th>
                </tr>
              </thead>
              <tbody>
                {trains.slice(0, 10).map((train, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="font-bold text-white">{train.trainNumber}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[80px]" title={train.trainName}>{train.trainName}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-300">
                      {train.origin} &rarr; {train.destination}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded font-medium ${getStatusColor(train.status)}`}>
                        {train.status}
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${train.delayMinutes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {train.delayMinutes > 0 ? `+${train.delayMinutes}m` : 'On Time'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Summary Panel */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#1A2840] to-[#0A1628] border border-orange-500/20 rounded-xl flex flex-col backdrop-blur h-[450px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
          <div className="p-4 border-b border-white/10 flex justify-between items-center relative z-10">
            <h3 className="font-semibold flex items-center gap-2 text-[#FF6B2B]">
              <Sparkles className="h-4 w-4" /> RailCopilot Daily Briefing
            </h3>
            <span className="text-[10px] bg-[#0A1628] border border-white/10 px-2 py-0.5 rounded text-slate-400">
              Groq llama-3.3-70b
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto">
            <p className="text-sm text-slate-300 leading-relaxed">
              Overall network health is stable at 78.6%, though Northern region is experiencing cascading delays due to a track circuit failure near NDLS. Southern routes are operating at 92% on-time performance.
            </p>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommendations</h4>
              <ul className="space-y-2">
                {[
                  "Divert Train 12301 via alternate loop line to bypass NDLS congestion.",
                  "Issue advisory for platform change at Kanpur Central to manage crowd.",
                  "Deploy emergency maintenance crew to Sector 4B signal point."
                ].map((rec, i) => (
                  <li key={i} className="text-sm flex gap-2 items-start">
                    <ChevronRight className="h-4 w-4 text-[#FF6B2B] shrink-0 mt-0.5" />
                    <span className="text-slate-200">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-4">
              <Link href="/ai-assistant" className="w-full py-2.5 bg-[#FF6B2B] hover:bg-[#FF8C42] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-[0_0_15px_rgba(255,107,43,0.3)]">
                Ask RailCopilot <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Zone Performance */}
      <motion.div variants={itemVariants} className="bg-[#1A2840] border border-white/10 rounded-xl p-5 backdrop-blur">
        <h3 className="text-lg font-semibold mb-4">Zone Performance Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.slice(0, 9).map((zone, i) => (
            <div key={i} className="bg-[#0A1628]/50 border border-white/5 p-4 rounded-lg flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-white/10 shrink-0">
                {zone.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">{zone.name}</span>
                  <span className={`text-xs font-bold ${zone.onTimePercent > 80 ? 'text-emerald-500' : zone.onTimePercent > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {zone.onTimePercent}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${zone.onTimePercent > 80 ? 'bg-emerald-500' : zone.onTimePercent > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${zone.onTimePercent}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
