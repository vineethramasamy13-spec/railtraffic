'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Info, 
  ShieldAlert,
  ChevronDown,
  Sparkles,
  Search
} from 'lucide-react';
import { DEMO_ALERTS } from '@/lib/demo-data';

export default function AlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const alerts = (DEMO_ALERTS || []) as any[];

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'All' && alert.severity !== filterSeverity) return false;
    if (filterCategory !== 'All' && alert.category !== filterCategory) return false;
    if (filterStatus !== 'All' && alert.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => {
    const severityScore: any = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'INFO': 1 };
    return (severityScore[b.severity] || 0) - (severityScore[a.severity] || 0);
  });

  const getSeverityStyle = (severity: string) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50', bar: 'bg-red-500' };
      case 'HIGH': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', bar: 'bg-orange-500' };
      case 'MEDIUM': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/50', bar: 'bg-amber-500' };
      default: return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50', bar: 'bg-blue-500' };
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'Active').length;
  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen bg-[#0A1628] text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Management Center</h1>
          <p className="text-slate-400">Prioritized operational incidents and automated intelligence</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: activeCount, color: 'text-blue-400' },
          { label: 'Critical / High', value: criticalCount, color: 'text-red-500' },
          { label: 'Acknowledged', value: alerts.filter(a => a.status === 'Acknowledged').length, color: 'text-amber-500' },
          { label: 'Resolved Today', value: resolvedCount, color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#1A2840] border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-sm text-slate-400">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1A2840] border border-white/10 p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <Filter className="h-4 w-4" /> <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select 
          className="bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#FF6B2B]"
          value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="All">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="INFO">Info</option>
        </select>

        <select 
          className="bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#FF6B2B]"
          value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Delay">Delay</option>
          <option value="Safety">Safety</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Weather">Weather</option>
          <option value="Operational">Operational</option>
        </select>

        <select 
          className="bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#FF6B2B]"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-[#1A2840] border border-white/10 rounded-xl">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">No alerts found</h3>
              <p className="text-slate-400 text-sm">You're all caught up with the selected filters.</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, i) => {
              const styles = getSeverityStyle(alert.severity);
              const isExpanded = expandedAlert === alert.id;

              return (
                <motion.div 
                  key={alert.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#1A2840] border border-white/10 rounded-xl overflow-hidden relative ${isExpanded ? 'ring-1 ring-[#FF6B2B]/50' : ''}`}
                >
                  {/* Left color bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.bar}`} />
                  
                  <div className="p-5 pl-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${styles.bg} ${styles.color} border-${styles.color.split('-')[1]}-500/30`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                            {alert.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {alert.timeAgo || 'Recent'}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <p className="text-sm text-slate-300">{alert.description}</p>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                        {alert.status === 'Active' && (
                          <button className="px-4 py-1.5 bg-[#FF6B2B] hover:bg-[#FF8C42] text-white text-sm font-medium rounded-lg transition-colors w-full">
                            Acknowledge
                          </button>
                        )}
                        <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-white/10 transition-colors w-full">
                          Resolve
                        </button>
                      </div>
                    </div>

                    {/* AI Section Toggle */}
                    {alert.aiRootCause && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                          className="flex items-center gap-2 text-sm text-[#FF6B2B] hover:text-[#FF8C42] font-medium transition-colors"
                        >
                          <Sparkles className="h-4 w-4" />
                          {isExpanded ? 'Hide AI Analysis' : 'View AI Analysis & Recommendations'}
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 p-4 bg-[#0A1628]/50 border border-orange-500/20 rounded-lg space-y-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Predicted Root Cause</h4>
                                  <p className="text-sm text-slate-200">{alert.aiRootCause}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommended Action</h4>
                                  <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm text-slate-200">{alert.recommendedAction}</p>
                                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition-colors whitespace-nowrap">
                                      Execute
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
