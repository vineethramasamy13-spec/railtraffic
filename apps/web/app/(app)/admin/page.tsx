"use client";

import React, { useState } from "react";
import { Users, Shield, ScrollText, Activity, Search, Edit2, UserX, UserCheck, Plus, Check, ShieldAlert, ShieldCheck, Database, Server, Cpu, HardDrive, Network, AlertCircle, Play, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Pseudo role check
const DEMO_CURRENT_USER_ROLE = "SUPER_ADMIN";

const DEMO_USERS = [
  { id: 1, name: "Rajesh Kumar", email: "superadmin@railtrack.gov.in", role: "SUPER_ADMIN", station: "HQ-NDLS", active: true, lastLogin: "2 hours ago" },
  { id: 2, name: "Priya Sharma", email: "admin@railtrack.gov.in", role: "ADMIN", station: "NR-HQ", active: true, lastLogin: "4 hours ago" },
  { id: 3, name: "Arun Mehta", email: "tc@railtrack.gov.in", role: "TRAFFIC_CONTROLLER", station: "NDLS", active: true, lastLogin: "15 min ago" },
  { id: 4, name: "Deepa Singh", email: "analyst@railtrack.gov.in", role: "ANALYST", station: "CSMT", active: true, lastLogin: "1 hour ago" },
  { id: 5, name: "Vikram Rao", email: "viewer@railtrack.gov.in", role: "VIEWER", station: "SBC", active: true, lastLogin: "3 days ago" },
];

const ROLES = [
  { id: "SUPER_ADMIN", name: "Super Administrator", desc: "Full system access including MCP config and root user management.", permissions: ["view_dashboard", "view_map", "view_digital_twin", "view_trains", "view_stations", "view_maintenance", "view_alerts", "acknowledge_alerts", "resolve_alerts", "view_analytics", "generate_reports", "view_admin", "manage_users", "manage_roles", "view_audit_logs", "configure_ai", "configure_mcp"] },
  { id: "ADMIN", name: "Administrator", desc: "Regional/Zone level administration. Cannot configure AI or MCP.", permissions: ["view_dashboard", "view_map", "view_digital_twin", "view_trains", "view_stations", "view_maintenance", "view_alerts", "acknowledge_alerts", "resolve_alerts", "view_analytics", "generate_reports", "view_admin", "manage_users", "view_audit_logs"] },
  { id: "TRAFFIC_CONTROLLER", name: "Traffic Controller", desc: "Operational control for trains and signals.", permissions: ["view_dashboard", "view_map", "view_digital_twin", "view_trains", "view_stations", "view_maintenance", "view_alerts", "acknowledge_alerts", "resolve_alerts", "view_analytics", "generate_reports"] },
  { id: "ANALYST", name: "Data Analyst", desc: "Access to all data and reports, no operational control.", permissions: ["view_dashboard", "view_map", "view_trains", "view_stations", "view_maintenance", "view_analytics", "generate_reports"] },
  { id: "VIEWER", name: "Viewer", desc: "Read-only access to basic dashboards.", permissions: ["view_dashboard", "view_map", "view_trains", "view_stations"] },
];

const ALL_PERMISSIONS = ["view_dashboard", "view_map", "view_digital_twin", "view_trains", "view_stations", "view_maintenance", "view_alerts", "acknowledge_alerts", "resolve_alerts", "view_analytics", "generate_reports", "view_admin", "manage_users", "manage_roles", "view_audit_logs", "configure_ai", "configure_mcp"];

const AUDIT_LOGS = [
  { id: 1, time: "15 min ago", user: "Arun Mehta", email: "tc@railtrack.gov.in", action: "Acknowledged alert #A-2024-001", resource: "Alerts", status: "success", ip: "10.45.2.14" },
  { id: 2, time: "30 min ago", user: "Rajesh Kumar", email: "superadmin@railtrack.gov.in", action: "Updated platform assignment 12627→Platform 3", resource: "Stations", status: "success", ip: "192.168.1.100" },
  { id: 3, time: "1 hour ago", user: "Priya Sharma", email: "admin@railtrack.gov.in", action: "Generated Executive Report Q3-2024", resource: "Reports", status: "success", ip: "10.12.5.88" },
  { id: 4, time: "2 hours ago", user: "Rajesh Kumar", email: "superadmin@railtrack.gov.in", action: "System login", resource: "Auth", status: "success", ip: "192.168.1.100" },
  { id: 5, time: "4 hours ago", user: "Priya Sharma", email: "admin@railtrack.gov.in", action: "System login", resource: "Auth", status: "success", ip: "10.12.5.88" },
  { id: 6, time: "5 hours ago", user: "System", email: "system@railtrack", action: "Sent 47 WebSocket train updates", resource: "API", status: "success", ip: "127.0.0.1" },
  { id: 7, time: "5 hours ago", user: "RailCopilot", email: "ai@railtrack", action: "Generated delay explanation for 12301", resource: "AI", status: "success", ip: "10.0.0.5" },
  { id: 8, time: "6 hours ago", user: "Deepa Singh", email: "analyst@railtrack.gov.in", action: "Exported Delay Analysis CSV", resource: "Reports", status: "success", ip: "10.18.2.4" },
  { id: 9, time: "8 hours ago", user: "Unknown", email: "-", action: "Failed login attempt", resource: "Auth", status: "failure", ip: "45.22.19.102" },
  { id: 10, time: "12 hours ago", user: "Arun Mehta", email: "tc@railtrack.gov.in", action: "Resolved alert #A-2024-002", resource: "Alerts", status: "success", ip: "10.45.2.14" },
  { id: 11, time: "1 day ago", user: "Rajesh Kumar", email: "superadmin@railtrack.gov.in", action: "Modified Role: VIEWER", resource: "Admin", status: "success", ip: "192.168.1.100" },
  { id: 12, time: "1 day ago", user: "System", email: "system@railtrack", action: "Database backup completed", resource: "System", status: "success", ip: "127.0.0.1" },
  { id: 13, time: "2 days ago", user: "Priya Sharma", email: "admin@railtrack.gov.in", action: "Added user: Vikram Rao", resource: "Admin", status: "success", ip: "10.12.5.88" },
  { id: 14, time: "3 days ago", user: "Vikram Rao", email: "viewer@railtrack.gov.in", action: "System login", resource: "Auth", status: "success", ip: "10.88.3.12" },
  { id: 15, time: "3 days ago", user: "System", email: "system@railtrack", action: "Restarted Nginx service", resource: "System", status: "success", ip: "127.0.0.1" },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  // Pseudo auth guard
  if (DEMO_CURRENT_USER_ROLE !== "SUPER_ADMIN" && DEMO_CURRENT_USER_ROLE !== "ADMIN") {
    // In a real app this would be a middleware or useEffect redirect
    return <div className="p-10 text-white">Unauthorized. Redirecting...</div>;
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case "SUPER_ADMIN": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "ADMIN": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "TRAFFIC_CONTROLLER": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ANALYST": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A1628] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
            <p className="text-sm text-slate-400 mt-1">Manage users, roles, security, and system health.</p>
          </div>
          {DEMO_CURRENT_USER_ROLE === "SUPER_ADMIN" && (
            <button 
              onClick={() => router.push('/admin/mcp')}
              className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Server className="w-4 h-4" /> Configure MCP Ecosystem
            </button>
          )}
        </header>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-white/10 shrink-0 flex gap-6">
          <button 
            onClick={() => setActiveTab("users")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'border-[#FF6B2B] text-[#FF6B2B]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <button 
            onClick={() => setActiveTab("roles")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'roles' ? 'border-[#FF6B2B] text-[#FF6B2B]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Shield className="w-4 h-4" /> Roles & Permissions
          </button>
          <button 
            onClick={() => setActiveTab("audit")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'audit' ? 'border-[#FF6B2B] text-[#FF6B2B]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <ScrollText className="w-4 h-4" /> Audit Log
          </button>
          <button 
            onClick={() => setActiveTab("health")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'health' ? 'border-[#FF6B2B] text-[#FF6B2B]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Activity className="w-4 h-4" /> System Health
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Tab: Users */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search users..." className="w-full bg-[#1A2840] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-100" />
                  </div>
                  <button className="px-4 py-2 bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6B2B]/20">
                    <Plus className="w-4 h-4" /> Add User
                  </button>
                </div>

                <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Station/Zone</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Last Login</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {DEMO_USERS.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-200">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getRoleColor(user.role)}`}>
                              {user.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{user.station}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span className={user.active ? 'text-emerald-400 text-xs font-bold' : 'text-red-400 text-xs font-bold'}>
                                {user.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{user.lastLogin}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                              <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                                {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Roles */}
            {activeTab === "roles" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {ROLES.map(role => (
                    <div key={role.id} className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
                      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/10">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className={`w-6 h-6 ${role.id === 'SUPER_ADMIN' ? 'text-red-400' : 'text-blue-400'}`} />
                          <div>
                            <h3 className="font-bold text-slate-100">{role.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{role.desc}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getRoleColor(role.id)}`}>
                          {role.id.replace("_", " ")}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Permissions</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {ALL_PERMISSIONS.map(perm => {
                            const hasPerm = role.permissions.includes(perm);
                            return (
                              <div key={perm} className={`flex items-center gap-2 text-sm ${hasPerm ? 'text-slate-300' : 'text-slate-600'}`}>
                                {hasPerm ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <div className="w-4 h-4 border border-slate-600 rounded-sm shrink-0" />}
                                <span className="truncate">{perm.replace(/_/g, " ")}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Audit */}
            {activeTab === "audit" && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  <select className="bg-[#1A2840] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200">
                    <option>All Users</option>
                    <option>Rajesh Kumar</option>
                    <option>System</option>
                  </select>
                  <select className="bg-[#1A2840] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#FF6B2B] text-slate-200">
                    <option>All Resources</option>
                    <option>Auth</option>
                    <option>Alerts</option>
                    <option>Stations</option>
                  </select>
                </div>
                
                <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Timestamp</th>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                        <th className="px-6 py-4 font-medium">Resource</th>
                        <th className="px-6 py-4 font-medium">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {AUDIT_LOGS.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">{log.time}</td>
                          <td className="px-6 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-200">{log.user}</span>
                              <span className="text-[10px] text-slate-500">{log.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              {log.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                              <span className="text-slate-300">{log.action}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-bold text-slate-400">
                              {log.resource}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Health */}
            {activeTab === "health" && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#1A2840]/60 p-4 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider"><Cpu className="w-4 h-4" /> CPU Usage</div>
                    <div className="text-2xl font-bold text-emerald-400">34%</div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-500 rounded-full w-[34%]" /></div>
                  </div>
                  <div className="bg-[#1A2840]/60 p-4 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider"><Server className="w-4 h-4" /> Memory</div>
                    <div className="text-2xl font-bold text-amber-400">62%</div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-1"><div className="h-full bg-amber-500 rounded-full w-[62%]" /></div>
                  </div>
                  <div className="bg-[#1A2840]/60 p-4 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider"><HardDrive className="w-4 h-4" /> Disk</div>
                    <div className="text-2xl font-bold text-emerald-400">28%</div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-500 rounded-full w-[28%]" /></div>
                  </div>
                  <div className="bg-[#1A2840]/60 p-4 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider"><Network className="w-4 h-4" /> Net I/O</div>
                    <div className="text-2xl font-bold text-blue-400">1.2 GB/s</div>
                    <div className="text-xs text-slate-500 mt-1">Rx: 800 MB/s • Tx: 400 MB/s</div>
                  </div>
                </div>

                <div className="bg-[#1A2840]/60 backdrop-blur rounded-xl border border-white/10 p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-slate-100 mb-6">Service Status</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "NestJS API", status: "OK", latency: "42ms", uptime: "99.99%" },
                      { name: "FastAPI AI", status: "OK", latency: "115ms", uptime: "99.95%" },
                      { name: "PostgreSQL", status: "OK", latency: "12ms", uptime: "99.99%" },
                      { name: "Redis Cache", status: "OK", latency: "2ms", uptime: "100%" },
                      { name: "ChromaDB", status: "OK", latency: "45ms", uptime: "99.9%" },
                      { name: "Nginx", status: "OK", latency: "1ms", uptime: "100%" },
                      { name: "Prometheus", status: "WARN", latency: "850ms", uptime: "99.0%" },
                      { name: "Grafana", status: "OK", latency: "35ms", uptime: "99.9%" },
                    ].map(svc => (
                      <div key={svc.name} className="bg-black/20 p-4 rounded-lg border border-white/5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{svc.name}</span>
                          <div className={`w-2.5 h-2.5 rounded-full ${svc.status === 'OK' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'}`} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Latency: <span className={svc.status === 'OK' ? 'text-slate-300' : 'text-amber-400'}>{svc.latency}</span></span>
                          <span className="text-slate-500">Uptime: <span className="text-slate-300">{svc.uptime}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
