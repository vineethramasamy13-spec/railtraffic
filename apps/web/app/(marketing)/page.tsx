import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Train, 
  Map as MapIcon, 
  Activity, 
  ShieldAlert, 
  Database,
  BrainCircuit,
  Bot,
  Zap,
  Server,
  CloudCog,
  Wrench,
  Search,
  CheckCircle2,
  LineChart,
  Network,
  BarChart3,
  FileText,
  AlertTriangle,
  MonitorPlay
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-[#FF6B2B]" />
            <span className="font-bold text-xl tracking-tight text-white">RailTrack AI</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full">SIH25022</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#ai-copilot" className="hover:text-white transition">Copilot</Link>
            <Link href="#architecture" className="hover:text-white transition">Architecture</Link>
            <Link href="#demo" className="hover:text-white transition">Demo Flow</Link>
          </div>
          <Link href="/login">
            <Button className="bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white shadow-lg shadow-[#FF6B2B]/20">
              Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B2B]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#1B3A6B]/40 rounded-full blur-[150px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge className="mb-6 bg-[#1B3A6B] text-blue-100 hover:bg-[#1B3A6B]/80 px-4 py-1.5 text-sm">
            Ministry of Railways • Official Partner
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            AI-Powered Railway <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2B] to-[#F5A623]">
              Traffic Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Next-generation traffic management platform leveraging predictive AI, Digital Twins, and autonomous Copilots to optimize the world's 4th largest railway network.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
            <Link href="/login">
              <Button size="lg" className="bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-xl shadow-[#FF6B2B]/20">
                Deploy Environment
              </Button>
            </Link>
            <Link href="#architecture">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                View Architecture
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Track Network", value: "68,000+ km" },
              { label: "Daily Trains", value: "13,000+" },
              { label: "Daily Passengers", value: "23 Million" },
              { label: "Prediction Accuracy", value: "94.2%" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Copilot Section */}
      <section id="ai-copilot" className="py-24 px-6 relative bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">RailCopilot — AI Operations Copilot</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">An intelligent assistant embedded into operations, providing contextual insights, root cause analysis, and conversational intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Dashboard KPI Analysis", desc: "Instantly interprets shifts in punctuality rates and network utilization.", icon: BarChart3, badge: "Groq Llama-3" },
              { title: "Delay Prediction Explanations", desc: "Explains precisely why a train is predicted to be delayed using SHAP values.", icon: Activity, badge: "XGBoost + SHAP" },
              { title: "Policy Q&A", desc: "Ask questions about operating manuals and safety protocols.", icon: Bot, badge: "RAG + LlamaIndex" },
              { title: "Executive Reports", desc: "Auto-generates daily or weekly performance summaries for zone administrators.", icon: FileText, badge: "Groq Llama-3" },
              { title: "Incident Root Cause Analysis", desc: "Analyzes historical logs to determine the true source of cascading delays.", icon: AlertTriangle, badge: "BERT" },
              { title: "Route Optimization", desc: "Suggests alternative routing during major blockages or maintenance.", icon: Network, badge: "A* + OR-Tools" },
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 transition duration-300">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{feature.desc}</p>
                  <Badge variant="outline" className="text-xs text-slate-500 border-slate-700">{feature.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Ecosystem Section */}
      <section id="architecture" className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-slate-800 text-slate-300 mb-4 hover:bg-slate-700">Model Context Protocol</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">MCP-Powered AI Architecture</h2>
          <p className="text-slate-400 max-w-3xl mx-auto mb-16">
            Our AI Copilot is built on the Model Context Protocol, enabling it to securely interface with real-time enterprise tools, databases, and APIs without hallucinating data.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "PostgreSQL MCP", icon: Database },
              { name: "Filesystem MCP", icon: Server },
              { name: "GitHub MCP", icon: CloudCog },
              { name: "Docker MCP", icon: Zap },
              { name: "Kubernetes MCP", icon: Network },
              { name: "Playwright MCP", icon: MonitorPlay },
              { name: "Weather MCP", icon: CloudCog },
              { name: "Maps MCP", icon: MapIcon },
              { name: "Documentation MCP", icon: FileText },
              { name: "OpenAPI MCP", icon: BrainCircuit },
            ].map((mcp, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 glass-card rounded-xl hover:border-primary/50 transition">
                <mcp.icon className="h-8 w-8 text-slate-300 mb-3" />
                <span className="text-sm font-medium text-slate-200">{mcp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Flow Section */}
      <section id="demo" className="py-24 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-slate-400">The 5-Step Evaluation Journey</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {[
              { title: "Executive Overview", desc: "Start at the Executive Dashboard. Review national KPIs, on-time performance heatmaps, and AI-generated insights." },
              { title: "Traffic Anomalies", desc: "Notice a critical alert regarding delay cascades in the Northern Railway zone. Navigate to the Interactive Map." },
              { title: "Digital Twin Drill-down", desc: "Open the Digital Twin for New Delhi station. Observe platform occupancy and simulated signal flows." },
              { title: "Predictive Maintenance", desc: "Identify a track section flagged by the Random Forest model. Open the XAI panel to see factors (Age, Wear)." },
              { title: "RailCopilot Resolution", desc: "Ask the Copilot to summarize the impact of taking the track offline. It queries the RAG system for SOPs and suggests a reroute plan." }
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0D1B2A] bg-primary text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-primary/20 z-10">
                  {i + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 glass-card rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Train className="h-5 w-5" />
            <span className="font-semibold text-slate-300">RailTrack AI</span>
          </div>
          <p>© {new Date().getFullYear()} SIH25022 Project Team. For evaluation purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
