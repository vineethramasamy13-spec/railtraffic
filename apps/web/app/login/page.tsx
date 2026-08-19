"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Train, ShieldCheck, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleDemoLogin = (role: "SuperAdmin" | "Admin" | "Traffic Controller" | "Analyst" | "Viewer") => {
    setIsLoading(true)
    setTimeout(() => {
      const roleMap: Record<string, "SUPER_ADMIN" | "ADMIN" | "TRAFFIC_CONTROLLER" | "ANALYST" | "VIEWER"> = {
        "SuperAdmin": "SUPER_ADMIN",
        "Admin": "ADMIN",
        "Traffic Controller": "TRAFFIC_CONTROLLER",
        "Analyst": "ANALYST",
        "Viewer": "VIEWER"
      }
      const mappedRole = roleMap[role] || "VIEWER"
      login({
        id: `demo-${role.toLowerCase().replace(' ', '-')}`,
        name: `Demo ${role}`,
        email: `${role.toLowerCase().replace(' ', '')}@railtrack.gov.in`,
        role: mappedRole,
        zoneId: "NR"
      }, "mock-jwt-access-token-12345", "mock-jwt-refresh-token-12345")
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex">
      {/* Left side branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1B3A6B] overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] to-[#1B3A6B] opacity-90 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0"></div>
        
        <div className="relative z-10 text-center px-12 animate-slide-up">
          <Train className="h-24 w-24 text-[#FF6B2B] mx-auto mb-8 animate-pulse-glow" />
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">RailTrack AI</h1>
          <p className="text-blue-200 text-lg max-w-md mx-auto">
            Secure Command Center Authentication. Access predictive insights and network-wide traffic controls.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-2xl relative">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">System Login</h2>
            <p className="text-sm text-slate-400 mt-2">Historical Replay Mode Enabled</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="admin@railtrack.gov.in" defaultValue="admin@railtrack.gov.in" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="••••••••" disabled />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <Label className="text-xs text-slate-400 uppercase tracking-wider mb-4 block text-center">Select Role to Continue</Label>
            <div className="grid grid-cols-1 gap-3">
              {(["SuperAdmin", "Admin", "Traffic Controller", "Analyst"] as const).map((role) => (
                <Button 
                  key={role}
                  variant="outline" 
                  className="w-full justify-start border-slate-700 hover:bg-primary/20 hover:text-white hover:border-primary/50 text-slate-300 transition-all h-12"
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-3 h-4 w-4" />}
                  Login as {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
