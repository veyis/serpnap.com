/**
 * Tool: Meta Tag Generator
 * Path: /tools/meta-tag-generator
 * Premium tool for generating SEO-optimized meta tags.
 */
"use client";

import { useState } from "react";
import { Copy, Check, Info, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { cn } from "@/lib/utils";

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");

  const handleCopy = () => {
    const text = `<title>${title}</title>\n<meta name="description" content="${description}" />`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Character counts
  const titleCount = title.length;
  const descCount = description.length;

  const isTitleOk = titleCount > 30 && titleCount < 60;
  const isDescOk = descCount > 120 && descCount < 160;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="pt-32 pb-16 container-padding">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
                <Sparkles className="w-4 h-4" />
                SEO CTR Optimizer
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                Meta Tag <br />
                <span className="text-primary italic">Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                Optimize your search appearance. Generate perfect title tags and meta descriptions that drive 20% more clicks.
            </p>
        </div>
      </section>

      {/* Interface */}
      <section className="pb-32 container-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            
            {/* Input Panel */}
            <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-[40px] p-8 md:p-12">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-black uppercase text-secondary-foreground tracking-widest">Page Title</label>
                            <span className={cn("text-[10px] font-bold", isTitleOk ? "text-emerald-500" : "text-muted-foreground")}>
                                {titleCount} / 60 characters
                            </span>
                        </div>
                        <input 
                            type="text" 
                            className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-primary outline-none transition-shadow duration-300"
                            placeholder="e.g. SEO Services in Miami | Growth Marketing Agency"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-black uppercase text-secondary-foreground tracking-widest">Meta Description</label>
                            <span className={cn("text-[10px] font-bold", isDescOk ? "text-emerald-500" : "text-muted-foreground")}>
                                {descCount} / 160 characters
                            </span>
                        </div>
                        <textarea 
                            className="w-full h-32 bg-white dark:bg-zinc-800 border-none rounded-2xl p-6 font-medium focus:ring-2 focus:ring-primary outline-none resize-none transition-shadow duration-300 leading-relaxed"
                            placeholder="e.g. Boost your business with our premium SEO services. We help you rank #1 in Google and drive high-intent leads that convert into revenue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-[32px] flex gap-4">
                        <Info className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pro-tip: Include your primary keyword in the first 60 characters of your description to ensure it isn't truncated in search results.
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="relative">
                <div className="sticky top-32 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-zinc-200 dark:border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <Search className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Google Search Preview</span>
                            </div>
                            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <button 
                                    onClick={() => setActiveTab("desktop")}
                                    className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", activeTab === "desktop" ? "bg-white dark:bg-zinc-700 shadow-sm" : "opacity-50")}
                                >
                                    Desktop
                                </button>
                                <button 
                                    onClick={() => setActiveTab("mobile")}
                                    className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", activeTab === "mobile" ? "bg-white dark:bg-zinc-700 shadow-sm" : "opacity-50")}
                                >
                                    Mobile
                                </button>
                            </div>
                        </div>

                        <div className={cn("space-y-1 mx-auto transition-all duration-500", activeTab === "mobile" ? "max-w-[360px]" : "max-w-none")}>
                            <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl font-medium hover:underline cursor-pointer truncate">
                                {title || "Enter a page title..."}
                            </p>
                            <p className="text-[#006621] dark:text-[#34a853] text-sm mb-1 truncate">
                                https://serpnap.com/your-page-url
                            </p>
                            <p className="text-[#4d5156] dark:text-[#bdc1c6] text-sm leading-relaxed line-clamp-2">
                                {description || "Enter a meta description to see how it looks in Google search results..."}
                            </p>
                        </div>
                    </div>

                    <Button 
                        onClick={handleCopy}
                        className="w-full h-16 rounded-[24px] bg-primary text-primary-foreground font-black text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "COPIED TO CLIPBOARD" : "COPY META TAGS"}
                    </Button>
                </div>
            </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
