/**
 * Tool: Schema Markup Generator
 * Path: /tools/schema-generator
 * Premium tool for generating JSON-LD schema for SEO.
 */
"use client";

import { useState } from "react";
import { Code2, Copy, Check, Info, FileJson } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { cn } from "@/lib/utils";

type SchemaType = "LocalBusiness" | "FAQPage" | "Service" | "Review";

interface FAQ {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  url: string;
  address: string;
  phone: string;
  faqs: FAQ[];
}

export default function SchemaGeneratorPage() {
  const [activeType, setActiveType] = useState<SchemaType>("LocalBusiness");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    address: "",
    phone: "",
    faqs: [{ question: "", answer: "" }],
  });

  const handleCopy = () => {
    const code = generateSchema();
    navigator.clipboard.writeText(JSON.stringify(code, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSchema = () => {
    switch (activeType) {
      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": formData.name || "Your Business Name",
          "url": formData.url || "https://example.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": formData.address || "123 Main St",
          },
          "telephone": formData.phone || "555-0123"
        };
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": formData.faqs.filter((f: FAQ) => f.question).map((f: FAQ) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        };
      default:
        return {};
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="pt-32 pb-16 container-padding">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
                <FileJson className="w-4 h-4" />
                SEO Power Tool
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                Schema Markup <br />
                <span className="text-primary italic">Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                Generate valid JSON-LD schema for your website in seconds. Improve your click-through rate with rich results.
            </p>
        </div>
      </section>

      {/* Tool Interface */}
      <section className="pb-32 container-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            
            {/* Input Panel */}
            <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-[40px] p-8 md:p-12">
                <div className="flex gap-4 p-1 bg-zinc-200/50 dark:bg-zinc-800 rounded-2xl overflow-hidden mb-8">
                    {(["LocalBusiness", "FAQPage"] as SchemaType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={cn("flex-1 py-3 px-6 rounded-xl text-xs font-bold transition-all", 
                                activeType === type ? "bg-white dark:bg-zinc-700 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {activeType === "LocalBusiness" && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2">Business Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Harmony Dental"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2">Website URL</label>
                                    <input 
                                        type="text" 
                                        className="w-full h-14 bg-white dark:bg-zinc-800 border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="https://serpnap.com"
                                        value={formData.url}
                                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                                    />
                                </div>
                            </>
                        )}

                        {activeType === "FAQPage" && (
                            <div className="space-y-8">
                                {formData.faqs.map((faq: FAQ, i: number) => (
                                    <div key={i} className="p-6 bg-white dark:bg-zinc-800 rounded-[32px] space-y-4">
                                        <input 
                                            placeholder="Question" 
                                            className="w-full bg-transparent font-bold text-lg outline-none" 
                                            value={faq.question}
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[i].question = e.target.value;
                                                setFormData({...formData, faqs: newFaqs});
                                            }}
                                        />
                                        <textarea 
                                            placeholder="Answer" 
                                            className="w-full bg-transparent text-sm text-muted-foreground outline-none resize-none h-20"
                                            value={faq.answer}
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[i].answer = e.target.value;
                                                setFormData({...formData, faqs: newFaqs});
                                            }}
                                        />
                                    </div>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="w-full h-14 rounded-2xl border-dashed"
                                    onClick={() => setFormData({...formData, faqs: [...formData.faqs, { question: "", answer: "" }]})}
                                >
                                    + Add Question
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Output Panel */}
            <div className="relative">
                <div className="sticky top-32 space-y-6">
                    <div className="bg-zinc-950 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/5 overflow-hidden group">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Code2 className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">JSON-LD Output</span>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-black text-white"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copied ? "COPIED" : "COPY CODE"}
                            </button>
                        </div>
                        <pre className="text-zinc-400 text-sm font-mono overflow-x-auto max-h-[500px] scrollbar-hide select-all">
                            {JSON.stringify(generateSchema(), null, 2)}
                        </pre>
                    </div>

                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] flex gap-6">
                        <Info className="w-6 h-6 text-primary shrink-0" />
                        <div>
                            <h4 className="font-bold mb-1 text-sm">Where do I put this?</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">Copy this code and paste it into the <code>{"<head>"}</code> of your page, or use a tool like Google Tag Manager to inject it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
