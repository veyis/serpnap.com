/**
 * Interactive Tools Registry
 * 
 * Central registry for all interactive tools available in documentation.
 * Add new tools here to make them available via markdown syntax.
 */

import { ToolRegistry, CalculatorConfig, ChecklistConfig } from "./types";

// ============================================================================
// Calculator Tools
// ============================================================================

const roiCalculator: CalculatorConfig = {
  id: "roi-calculator",
  type: "calculator",
  title: "ROI Calculator",
  description: "Calculate return on investment for your marketing campaigns",
  realTime: true,
  exportEnabled: true,
  fields: [
    {
      id: "revenue",
      label: "Revenue Generated",
      type: "currency",
      placeholder: "10000",
      defaultValue: 0,
      min: 0,
      helpText: "Total revenue from the campaign",
      prefix: "$",
    },
    {
      id: "cost",
      label: "Campaign Cost",
      type: "currency",
      placeholder: "5000",
      defaultValue: 0,
      min: 0,
      helpText: "Total cost of the campaign",
      prefix: "$",
    },
  ],
  results: [
    {
      id: "roi",
      label: "ROI",
      format: "percentage",
      highlight: true,
      description: "Return on investment percentage",
    },
    {
      id: "profit",
      label: "Net Profit",
      format: "currency",
      description: "Revenue minus cost",
    },
    {
      id: "roas",
      label: "ROAS",
      format: "number",
      description: "Return on ad spend (revenue/cost)",
    },
  ],
  formula: (values) => {
    const revenue = values.revenue || 0;
    const cost = values.cost || 0;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const roas = cost > 0 ? revenue / cost : 0;

    return {
      roi,
      profit,
      roas,
    };
  },
};

const budgetCalculator: CalculatorConfig = {
  id: "budget-calculator",
  type: "calculator",
  title: "Monthly Budget Calculator",
  description: "Plan your monthly advertising budget allocation",
  realTime: true,
  exportEnabled: true,
  fields: [
    {
      id: "totalBudget",
      label: "Total Monthly Budget",
      type: "currency",
      placeholder: "10000",
      defaultValue: 0,
      min: 0,
      prefix: "$",
    },
    {
      id: "googleAds",
      label: "Google Ads (%)",
      type: "percentage",
      placeholder: "40",
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
      helpText: "Percentage allocated to Google Ads",
    },
    {
      id: "metaAds",
      label: "Meta Ads (%)",
      type: "percentage",
      placeholder: "30",
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
      helpText: "Percentage allocated to Meta Ads",
    },
    {
      id: "other",
      label: "Other Channels (%)",
      type: "percentage",
      placeholder: "30",
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
      helpText: "Percentage for other marketing channels",
    },
  ],
  results: [
    {
      id: "googleAmount",
      label: "Google Ads Budget",
      format: "currency",
      description: "Monthly budget for Google Ads",
    },
    {
      id: "metaAmount",
      label: "Meta Ads Budget",
      format: "currency",
      description: "Monthly budget for Meta Ads",
    },
    {
      id: "otherAmount",
      label: "Other Channels Budget",
      format: "currency",
      description: "Monthly budget for other channels",
    },
    {
      id: "totalAllocated",
      label: "Total Allocated",
      format: "currency",
      highlight: true,
      description: "Sum of all allocations",
    },
  ],
  formula: (values) => {
    const total = values.totalBudget || 0;
    const googlePct = (values.googleAds || 0) / 100;
    const metaPct = (values.metaAds || 0) / 100;
    const otherPct = (values.other || 0) / 100;

    return {
      googleAmount: total * googlePct,
      metaAmount: total * metaPct,
      otherAmount: total * otherPct,
      totalAllocated: total * (googlePct + metaPct + otherPct),
    };
  },
};

const cpcCalculator: CalculatorConfig = {
  id: "cpc-calculator",
  type: "calculator",
  title: "CPC & CPA Calculator",
  description: "Calculate cost per click and cost per acquisition",
  realTime: true,
  exportEnabled: true,
  fields: [
    {
      id: "spend",
      label: "Total Ad Spend",
      type: "currency",
      placeholder: "5000",
      defaultValue: 0,
      min: 0,
      prefix: "$",
    },
    {
      id: "clicks",
      label: "Total Clicks",
      type: "integer",
      placeholder: "10000",
      defaultValue: 0,
      min: 0,
      helpText: "Number of clicks received",
    },
    {
      id: "conversions",
      label: "Conversions",
      type: "integer",
      placeholder: "200",
      defaultValue: 0,
      min: 0,
      helpText: "Number of conversions",
    },
  ],
  results: [
    {
      id: "cpc",
      label: "Cost Per Click (CPC)",
      format: "currency",
      highlight: true,
      description: "Average cost per click",
    },
    {
      id: "cpa",
      label: "Cost Per Acquisition (CPA)",
      format: "currency",
      highlight: true,
      description: "Average cost per conversion",
    },
    {
      id: "conversionRate",
      label: "Conversion Rate",
      format: "percentage",
      description: "Percentage of clicks that converted",
    },
  ],
  formula: (values) => {
    const spend = values.spend || 0;
    const clicks = values.clicks || 0;
    const conversions = values.conversions || 0;

    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    return {
      cpc,
      cpa,
      conversionRate,
    };
  },
};

// ============================================================================
// Checklist Tools
// ============================================================================

const seoChecklist: ChecklistConfig = {
  id: "seo-checklist",
  type: "checklist",
  title: "SEO Optimization Checklist",
  description: "Complete checklist for optimizing your website for search engines",
  showProgress: true,
  showCategories: true,
  allowPartialSave: true,
  exportEnabled: true,
  items: [
    {
      id: "meta-title",
      label: "Optimize meta titles (50-60 characters)",
      description: "Include target keywords and compelling copy",
      category: "On-Page SEO",
      required: true,
    },
    {
      id: "meta-description",
      label: "Write meta descriptions (150-160 characters)",
      description: "Create compelling descriptions with CTAs",
      category: "On-Page SEO",
      required: true,
    },
    {
      id: "heading-structure",
      label: "Proper heading hierarchy (H1-H6)",
      description: "Use semantic HTML heading structure",
      category: "On-Page SEO",
      required: true,
    },
    {
      id: "alt-text",
      label: "Add alt text to all images",
      description: "Descriptive alt text for accessibility and SEO",
      category: "On-Page SEO",
    },
    {
      id: "internal-links",
      label: "Add internal linking structure",
      description: "Link related pages with descriptive anchor text",
      category: "On-Page SEO",
    },
    {
      id: "mobile-responsive",
      label: "Ensure mobile responsiveness",
      description: "Test on multiple devices and screen sizes",
      category: "Technical SEO",
      required: true,
    },
    {
      id: "page-speed",
      label: "Optimize page load speed",
      description: "Target Core Web Vitals scores",
      category: "Technical SEO",
      required: true,
    },
    {
      id: "ssl-certificate",
      label: "Install SSL certificate (HTTPS)",
      description: "Secure site with valid SSL certificate",
      category: "Technical SEO",
      required: true,
    },
    {
      id: "xml-sitemap",
      label: "Create and submit XML sitemap",
      description: "Submit to Google Search Console",
      category: "Technical SEO",
    },
    {
      id: "robots-txt",
      label: "Configure robots.txt",
      description: "Control crawler access",
      category: "Technical SEO",
    },
    {
      id: "structured-data",
      label: "Implement structured data (Schema.org)",
      description: "Add JSON-LD markup for rich results",
      category: "Advanced SEO",
    },
    {
      id: "google-search-console",
      label: "Set up Google Search Console",
      description: "Monitor search performance and issues",
      category: "Advanced SEO",
      required: true,
    },
    {
      id: "analytics",
      label: "Install Google Analytics 4",
      description: "Track website traffic and user behavior",
      category: "Advanced SEO",
      required: true,
    },
  ],
};

const campaignSetupChecklist: ChecklistConfig = {
  id: "campaign-setup-checklist",
  type: "checklist",
  title: "Google Ads Campaign Setup Checklist",
  description: "Step-by-step checklist for setting up a new Google Ads campaign",
  showProgress: true,
  showCategories: true,
  exportEnabled: true,
  items: [
    {
      id: "account-structure",
      label: "Plan account structure (campaigns, ad groups)",
      description: "Organize campaigns by product/service",
      category: "Planning",
      required: true,
    },
    {
      id: "keyword-research",
      label: "Conduct keyword research",
      description: "Use Google Keyword Planner and competitor analysis",
      category: "Planning",
      required: true,
    },
    {
      id: "landing-pages",
      label: "Prepare landing pages",
      description: "Ensure pages are optimized and mobile-friendly",
      category: "Planning",
      required: true,
    },
    {
      id: "conversion-tracking",
      label: "Set up conversion tracking",
      description: "Install Google Ads conversion tag or use GA4",
      category: "Setup",
      required: true,
    },
    {
      id: "campaign-creation",
      label: "Create campaign with correct objective",
      description: "Choose Search, Display, Shopping, or Performance Max",
      category: "Setup",
      required: true,
    },
    {
      id: "ad-groups",
      label: "Create ad groups with targeted keywords",
      description: "Group related keywords together",
      category: "Setup",
      required: true,
    },
    {
      id: "ad-copy",
      label: "Write responsive search ads (RSAs)",
      description: "Create multiple headlines and descriptions",
      category: "Setup",
      required: true,
    },
    {
      id: "extensions",
      label: "Add ad extensions",
      description: "Sitelinks, callouts, structured snippets",
      category: "Setup",
    },
    {
      id: "bidding-strategy",
      label: "Set bidding strategy",
      description: "Choose manual CPC or smart bidding",
      category: "Setup",
      required: true,
    },
    {
      id: "budget",
      label: "Set daily budget",
      description: "Start conservative and scale based on performance",
      category: "Setup",
      required: true,
    },
    {
      id: "review",
      label: "Review campaign settings",
      description: "Double-check targeting, schedule, and locations",
      category: "Launch",
      required: true,
    },
    {
      id: "launch",
      label: "Launch campaign",
      description: "Activate and monitor initial performance",
      category: "Launch",
      required: true,
    },
  ],
};

// ============================================================================
// Registry Export
// ============================================================================

export const toolRegistry: ToolRegistry = {
  // Calculators
  "roi-calculator": roiCalculator,
  "budget-calculator": budgetCalculator,
  "cpc-calculator": cpcCalculator,

  // Checklists
  "seo-checklist": seoChecklist,
  "campaign-setup-checklist": campaignSetupChecklist,
};
