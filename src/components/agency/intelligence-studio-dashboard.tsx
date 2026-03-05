"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Brain, 
  Search, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  Network,
  BarChart,
  Zap,
  Globe,
  Mail,
  User,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEEP_AUDIT_DATA } from "@/lib/data/intelligence";

export function IntelligenceStudioDashboard({ domain = "your-brand.com" }: { domain?: string }) {
  const [isGated, setIsGated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsGated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center space-y-8 bg-black/40 backdrop-blur-xl rounded-[48px] border border-white/5">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
           className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
         />
         <div className="text-center">
            <p className="text-xl font-black uppercase tracking-tighter text-white">Initializing Neural Link</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Connecting to Knowledge Graph Clusters...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[800px] w-full rounded-[48px] overflow-hidden bg-[#050505] border border-white/10 shadow-2xl">
      
      {/* Sidebar / Navigation */}
      <div className="absolute left-0 top-0 bottom-0 w-20 border-r border-white/5 bg-black/40 backdrop-blur-md hidden xl:flex flex-col items-center py-12 gap-8 z-30">
         <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Brain className="w-5 h-5" />
         </div>
         <div className="flex flex-col gap-6 mt-12 text-muted-foreground/40">
            <Activity className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            <Network className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            <Search className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            <BarChart className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
         </div>
         <div className="mt-auto">
            <Lock className="w-4 h-4 text-primary" />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="xl:pl-20">
         
         {/* Top Header */}
         <div className="p-8 sm:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Analysis
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">ID: PEAK-092283-NEURAL</span>
               </div>
               <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">Intelligence Studio</h1>
               <p className="text-xs text-muted-foreground mt-1 font-medium">Target Entity: <span className="text-primary">{domain}</span></p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">Neural Authority Score</p>
                  <p className="text-2xl font-black text-white">{DEEP_AUDIT_DATA.overview.neuralAuthorityScore}%</p>
               </div>
               <div className="w-[1px] h-10 bg-white/10 mx-2 hidden sm:block" />
               <Button className="rounded-xl bg-white text-black hover:bg-white/90 text-[11px] font-black uppercase tracking-widest px-6 h-12 shadow-xl">
                  Download PDF <ExternalLink className="ml-2 w-4 h-4" />
               </Button>
            </div>
         </div>

         {/* Dashboard Grid */}
         <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            
            {/* Metric Blocks */}
            <div className="lg:col-span-8 space-y-8">
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {DEEP_AUDIT_DATA.metrics.map((metric, i) => (
                    <motion.div 
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                             {i % 2 === 0 ? <Zap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </div>
                          <div className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                             metric.status === "Deficit" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                          )}>
                             {metric.status}
                          </div>
                       </div>
                       <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{metric.label}</h3>
                       <p className="text-xs text-muted-foreground leading-relaxed mb-6">{metric.description}</p>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                             <span>Efficiency</span>
                             <span className="text-white">{metric.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }} 
                                transition={{ duration: 1, delay: 0.5 }}
                                className={cn(
                                  "h-full rounded-full",
                                  metric.status === "Deficit" ? "bg-red-500" : "bg-emerald-500"
                                )} 
                             />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>

               {/* Middle Multi-Pane Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Citation Nodes */}
                  <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                     <h3 className="text-md font-black uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                        <Globe className="w-4 h-4 text-primary" /> Citation Map
                     </h3>
                     <div className="space-y-3">
                        {DEEP_AUDIT_DATA.citations.map((node, i) => (
                          <div key={node.source} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-[8px] font-black text-primary border border-primary/20">
                                   0{i + 1}
                                </div>
                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">{node.source}</p>
                             </div>
                             <span className={cn(
                               "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                               node.frequency === "High" ? "bg-emerald-500/10 text-emerald-500" : 
                               node.frequency === "Moderate" ? "bg-blue-500/10 text-blue-500" :
                               "bg-red-500/10 text-red-500"
                             )}>
                                {node.frequency}
                             </span>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Neural Weighting Logs */}
                  <div className="p-8 rounded-[40px] bg-white/2 border border-white/5">
                     <h3 className="text-md font-black uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-primary" /> Weighting Logs
                     </h3>
                     <div className="space-y-3">
                        {DEEP_AUDIT_DATA.weightingLogs.map((log) => (
                          <div key={log.factor} className="space-y-1.5">
                             <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground">{log.factor}</span>
                                <span className={cn(
                                   log.status === "Critical" ? "text-red-500" : "text-white/60"
                                )}>{log.status}</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${log.weight * 100}%` }}
                                  className="h-full bg-primary/40"
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Real-time Telemetry HUD */}
               <div className="p-8 rounded-[40px] bg-black border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                  <div className="relative z-10">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-md font-black uppercase tracking-tight text-white flex items-center gap-3">
                           <Network className="w-4 h-4 text-primary" /> Information Gain Telemetry
                        </h3>
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
                           Live Link Active
                        </div>
                     </div>
                     <div className="font-mono text-[10px] space-y-3">
                        {DEEP_AUDIT_DATA.telemetry.map((t, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-3">
                                 <span className="text-muted-foreground/30">[{t.timestamp}]</span>
                                 <span className="text-white font-bold">{t.event}</span>
                              </div>
                              <span className={cn(
                                 "px-2 py-0.5 rounded",
                                 t.result.includes("Omitted") || t.result.includes("Delayed") ? "text-red-500 bg-red-500/10" : "text-primary bg-primary/10"
                              )}>{t.result}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>

            {/* AI Advisor / Action Plan (The Protected Part) */}
            <div className="lg:col-span-4 relative">
               
               <div className={cn(
                 "p-8 sm:p-10 rounded-[48px] bg-primary/5 border border-primary/20 h-full flex flex-col transition-all duration-1000",
                 isGated ? "blur-md opacity-25" : "blur-0 opacity-100"
               )}>
                  <div className="mb-8 p-6 rounded-[32px] bg-primary/10 border border-primary/20">
                     <Brain className="w-10 h-10 text-primary mb-4" />
                     <h3 className="text-lg font-black uppercase tracking-tight text-white leading-tight">Advisor Intelligence</h3>
                     <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Based on your Neural Deficit in **Semantic Resolution**, our logic layer recommends the following defensive strategy...
                     </p>
                  </div>

                  <div className="flex-1 space-y-6">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Strategic Directives</p>
                     {[
                       "Deploy Topic Cluster nodes for Core Service #1",
                       "Augment RAG citations via GEO-optimized PR",
                       "Resolve Entity Conflict in Schema Markup",
                       "Initialize Information Gain Content Loop"
                     ].map((step, i) => (
                       <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-black text-[10px] font-black shrink-0">
                             {i + 1}
                          </div>
                          <p className="text-xs text-white/80 font-medium leading-relaxed">{step}</p>
                       </div>
                     ))}
                  </div>

                  <div className="mt-12">
                     <Button className="w-full h-16 rounded-2xl bg-primary text-black hover:bg-primary/90 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
                        Initiate Neural Defense <ChevronRight className="ml-2 w-4 h-4" />
                     </Button>
                  </div>
               </div>

               {/* The Gate */}
               <AnimatePresence>
                 {isGated && (
                   <motion.div 
                     initial={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="absolute inset-0 z-20 flex items-center justify-center p-8"
                   >
                     <div className="w-full max-w-sm p-10 rounded-[48px] bg-black/80 backdrop-blur-2xl border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.2)] text-center">
                        <div className="w-16 h-16 mx-auto mb-8 relative">
                           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                           <div className="relative w-full h-full rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                              <Lock className="w-8 h-8" />
                           </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3 leading-tight">Unlock Your High-Intensity Audit</h3>
                        <p className="text-xs text-muted-foreground mb-10 leading-relaxed">
                           Access the proprietary neural weighting logs and 12-month defensive action plan for your brand.
                        </p>

                        <form onSubmit={handleUnlock} className="space-y-4">
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                              <Input 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Full Name" 
                                className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white font-medium" 
                              />
                           </div>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                              <Input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Business Email" 
                                className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-white font-medium" 
                              />
                           </div>
                           <Button 
                             type="submit"
                             className="w-full h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 mt-4 group"
                           >
                              Claim Full Intelligence <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </form>
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-black mt-8">
                           [ Private Access Provided by PxlPeak ]
                        </p>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

            </div>

         </div>

         {/* Bottom Status Bar */}
         <div className="p-6 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <div className="w-1 h-1 rounded-full bg-primary" /> CPU: OPTIMAL
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" /> SYMBOLS: RESOLVING
               </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              Generated by PxlPeak Intelligence Engine // 2026.02.27
            </div>
         </div>

      </div>
    </div>
  );
}
