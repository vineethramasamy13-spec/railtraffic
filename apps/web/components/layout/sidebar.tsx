"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore, useUiStore } from "@/store"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  MonitorPlay, 
  Train, 
  Building2, 
  Wrench, 
  AlertTriangle,
  BarChart3, 
  FileText, 
  Bot, 
  ShieldAlert, 
  Building
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { sidebarOpen, activeAlertsCount, isDemoMode } = useUiStore()

  if (!sidebarOpen) return null;

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [{ name: "Executive", href: "/executive", icon: Building }] : []),
    { name: "Map Intelligence", href: "/map", icon: MapIcon },
    { name: "Digital Twin", href: "/digital-twin", icon: MonitorPlay },
    { name: "Trains", href: "/trains", icon: Train },
    { name: "Stations", href: "/stations", icon: Building2 },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle, badge: activeAlertsCount },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "RailCopilot", href: "/copilot", icon: Bot },
  ]

  return (
    <div className="w-64 flex-shrink-0 glass-panel flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Train className="h-6 w-6 text-orange mr-2" />
        <span className="font-bold text-lg tracking-wide text-white">RailTrack AI</span>
      </div>
      
      {isDemoMode && (
        <div className="bg-warning/20 text-warning text-xs font-semibold px-4 py-2 flex items-center justify-center border-b border-warning/20">
          HISTORICAL REPLAY MODE
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary" : "text-slate-500")} />
                {item.name}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-white/10 bg-slate-900/30">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || "Demo User"}</p>
            <p className="text-xs text-slate-500">{user?.role || "Viewer"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
