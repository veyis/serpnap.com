"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

/**
 * FAQ Section component with accordion behavior
 * Designed to work with FAQPage schema for rich snippets
 *
 * Usage in MDX:
 * <FAQ items={[
 *   { question: "What is SEO?", answer: "SEO stands for..." },
 *   { question: "How long does SEO take?", answer: "Typically 3-6 months..." }
 * ]} />
 */
export function FAQSection({
  items,
  title = "Frequently Asked Questions",
  className,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section
      className={cn("my-12", className)}
      aria-labelledby="faq-heading"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5">
          <HelpCircle className="h-5 w-5 text-foreground/60" />
        </div>
        <h2
          id="faq-heading"
          className="text-2xl font-semibold text-foreground"
        >
          {title}
        </h2>
      </div>

      {/* FAQ items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-colors duration-200",
        isOpen
          ? "border-foreground/20 bg-foreground/5"
          : "border-border/40 hover:border-border/60"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-foreground/40 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-[height,opacity] duration-300",
          isOpen ? "max-h-[1000px]" : "max-h-0"
        )}
      >
        <div className="px-5 pb-5 text-foreground/70 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

/**
 * Generate FAQPage schema for structured data
 * This should be added to the page's head for rich snippets
 */
export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * FAQ Schema component that renders the JSON-LD
 */
export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = generateFAQSchema(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Combined FAQ component that includes both the UI and schema
 */
export function FAQ({
  items,
  title,
  className,
  includeSchema = true,
}: FAQSectionProps & { includeSchema?: boolean }) {
  return (
    <>
      {includeSchema && <FAQSchema items={items} />}
      <FAQSection items={items} title={title} className={className} />
    </>
  );
}
