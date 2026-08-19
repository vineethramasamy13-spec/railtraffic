"use client"

import React, { useEffect, useState } from "react"
import { useAuthStore, useUiStore, useAppStore } from "@/store"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Menu, Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const { toggleSidebar, activeAlertsCount } = useUiStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  const { trains, updateTrain } = useAppStore()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated && !pathname.includes('login') && pathname !== '/') {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  useEffect(() => {
    if (!isAuthenticated || !trains.length) return;

    const interval = setInterval(() => {
      // Select 2 random trains
      const indices = [
        Math.floor(Math.random() * trains.length),
        Math.floor(Math.random() * trains.length)
      ];

      indices.forEach(idx => {
        const train = trains[idx];
        if (!train) return;

        // Shift delay randomly: -3 to +5 mins
        const delta = Math.floor(Math.random() * 9) - 3;
        const newDelay = Math.max(0, (train.delayMinutes || 0) + delta);
        
        let newStatus = train.status;
        if (newDelay === 0) {
          newStatus = 'ON_TIME';
        } else if (newDelay > 60) {
          newStatus = 'RUNNING_LATE';
        } else {
          newStatus = 'DELAYED';
        }

        updateTrain(train.id, {
          delayMinutes: newDelay,
          status: newStatus as any
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAuthenticated, trains, updateTrain]);

  if (!mounted) return null;

  if (!isAuthenticated && pathname !== '/' && !pathname.includes('login')) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 glass">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4 text-slate-400">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search trains, stations, PNR..." 
                className="pl-9 pr-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer text-slate-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-[#0D1B2A]"></span>
              )}
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-xs text-slate-400">System Normal</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
