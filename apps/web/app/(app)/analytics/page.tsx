'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { BarChart3, TrendingUp, Calendar, Sparkles, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DEMO_ZONE_PERFORMANCE } from '@/lib/demo-data';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const zones = (DEMO_ZONE_PERFORMANCE || []) as any[];

  // 1. Zone Comparison Bar Chart
  const zoneChartOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
    yAxis: { type: 'category', data: zones.map(z => z.code), axisLabel: { color: '#94a3b8', fontWeight: 'bold' } },
    series: [
      {
        name: 'On-Time %',
        type: 'bar',
        data: zones.map(z => ({
          value: z.onTimePercent,
          itemStyle: {
            color: z.onTimePercent >= 80 ? '#10b981' : z.onTimePercent >= 70 ? '#facc15' : z.onTimePercent >= 60 ? '#f97316' : '#ef4444',
            borderRadius: [0, 4, 4, 0]
          }
        })),
        label: { show: true, position: 'insideRight', formatter: '{c}%', color: '#fff' }
      }
    ]
  };

  // 2. Delay Trend Line Chart
  const trendChartOptions = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['NR Zone', 'CR Zone', 'Overall Average'], textStyle: { color: '#94a3b8' }, bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: Array.from({length: 30}, (_, i) => `Day ${i+1}`), axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', name: 'Avg Delay (mins)', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
    series: [
      { name: 'NR Zone', type: 'line', smooth: true, data: Array.from({length: 30}, () => Math.floor(Math.random() * 30) + 20), itemStyle: { color: '#ef4444' } },
      { name: 'CR Zone', type: 'line', smooth: true, data: Array.from({length: 30}, () => Math.floor(Math.random() * 20) + 10), itemStyle: { color: '#3b82f6' } },
      { name: 'Overall Average', type: 'line', smooth: true, data: Array.from({length: 30}, () => Math.floor(Math.random() * 15) + 15), itemStyle: { color: '#10b981' }, lineStyle: { width: 4 } }
    ]
  };

  // 3. Train Category Performance
  const categoryChartOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['On-Time %', 'Occupancy %'], textStyle: { color: '#94a3b8' }, bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Superfast', 'Express'], axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#334155', type: 'dashed' } } },
    series: [
      { name: 'On-Time %', type: 'bar', data: [98, 92, 88, 75, 65], itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] } },
      { name: 'Occupancy %', type: 'bar', data: [95, 100, 90, 110, 120], itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } }
    ]
  };

  // 4. Hourly Heatmap
  const hours = Array.from({length: 24}, (_, i) => `${i}h`);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const heatmapData = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      heatmapData.push([j, i, Math.floor(Math.random() * 60)]);
    }
  }
  const heatmapOptions = {
    tooltip: { position: 'top' },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: hours, splitArea: { show: true }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'category', data: days, splitArea: { show: true }, axisLabel: { color: '#94a3b8' } },
    visualMap: {
      min: 0, max: 60, calculable: true, orient: 'horizontal', left: 'center', bottom: '-5%',
      inRange: { color: ['#10b981', '#facc15', '#f97316', '#ef4444'] },
      textStyle: { color: '#94a3b8' }
    },
    series: [{ name: 'Avg Delay', type: 'heatmap', data: heatmapData, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }]
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#0A1628] text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance Intelligence</h1>
          <p className="text-slate-400">Deep-dive into network metrics and AI-driven insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1A2840] border border-white/10 rounded-lg p-1">
            {['7d', '30d', '90d'].map(range => (
              <button 
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === range ? 'bg-[#FF6B2B] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Last {range}
              </button>
            ))}
          </div>
          <button className="p-2 bg-[#1A2840] hover:bg-slate-800 border border-white/10 rounded-lg text-slate-300 transition-colors">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Trains Operated', value: '14,230', trend: '+5.2%', isPositive: true },
          { title: 'Average On-Time Rate', value: '76.4%', trend: '-1.1%', isPositive: false },
          { title: 'Average Delay', value: '24.5 min', trend: '-3.2 min', isPositive: true },
          { title: 'Passengers Carried', value: '24.5M', trend: '+8.4%', isPositive: true }
        ].map((metric, i) => (
          <div key={i} className="bg-[#1A2840] border border-white/10 p-5 rounded-xl backdrop-blur">
            <h3 className="text-sm text-slate-400 font-medium mb-2">{metric.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{metric.value}</span>
              <span className={`flex items-center text-sm font-medium ${metric.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {metric.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A2840] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Zone-wise On-Time Performance</h3>
          <div className="h-[400px]">
            <ReactECharts option={zoneChartOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
        
        <div className="bg-[#1A2840] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">30-Day Rolling Delay Trend</h3>
          <div className="h-[400px]">
            <ReactECharts option={trendChartOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="bg-[#1A2840] border border-white/10 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Train Category Analysis</h3>
          <div className="h-[300px]">
            <ReactECharts option={categoryChartOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="bg-[#1A2840] border border-white/10 rounded-xl p-5 pb-8">
          <h3 className="text-lg font-semibold mb-4">Congestion Heatmap (Time vs Day)</h3>
          <div className="h-[300px]">
            <ReactECharts option={heatmapOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-[#1A2840] to-[#0A1628] border border-[#FF6B2B]/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 bg-[#FF6B2B]/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-[#FF6B2B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Predictive Insights</h2>
            <span className="text-xs bg-[#0A1628] border border-white/10 px-2 py-0.5 rounded text-slate-400">
              Powered by XGBoost + Groq
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {[
            {
              title: "Weekend Congestion Risk",
              desc: "High probability of cascading delays on the Delhi-Mumbai corridor this upcoming Saturday due to scheduled maintenance + holiday rush.",
              conf: "89%",
              action: "Deploy 2 additional standby rakes at Mathura Jn."
            },
            {
              title: "Signal Failure Pattern",
              desc: "Identified anomalous failure rates in CR Zone block sections during heavy rainfall. Component fatigue likely.",
              conf: "94%",
              action: "Pre-emptive inspection of points 4A-4D in Mumbai Div."
            },
            {
              title: "Optimization Opportunity",
              desc: "Vande Bharat turnaround time at Howrah can be reduced by 14 minutes by assigning platform 8 instead of 12.",
              conf: "76%",
              action: "Update platform allocation rules in scheduling system."
            }
          ].map((insight, i) => (
            <div key={i} className="bg-[#0A1628]/60 border border-white/10 p-4 rounded-lg hover:border-[#FF6B2B]/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white group-hover:text-[#FF6B2B] transition-colors">{insight.title}</h4>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                  {insight.conf}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4 h-16">{insight.desc}</p>
              <div className="bg-[#1A2840] border border-white/5 p-2.5 rounded text-sm text-slate-300">
                <span className="text-xs text-[#FF6B2B] font-semibold block mb-1">SUGGESTED ACTION</span>
                {insight.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
