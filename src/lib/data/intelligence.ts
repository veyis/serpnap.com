/**
 * Intelligence Studio Data Model
 * Defines the deep metrics for the Neural Audit reports.
 */

export interface NeuralMetric {
  label: string;
  value: number;
  status: "Deficit" | "Stable" | " Dominant";
  description: string;
}

export interface CitationNode {
  source: string;
  relevance: number;
  frequency: string;
}

export const DEEP_AUDIT_DATA = {
  overview: {
    neuralAuthorityScore: 34,
    informationGainIndex: 12,
    citationHealth: "Critical",
    globalRank: "Tier 4 (Invisible)",
  },
  metrics: [
    { 
      label: "Semantic Resolution", 
      value: 28, 
      status: "Deficit",
      description: "How clearly LLMs identify your brand as the primary authority for specific industry intents."
    },
    { 
      label: "Knowledge Graph Density", 
      value: 41, 
      status: "Stable",
      description: "The volume of verified entity relationships connecting your brand to key industry nodes."
    },
    { 
      label: "RAG Citation Rate", 
      value: 8, 
      status: "Deficit",
      description: "The frequency at which GPT-4o and Gemini 1.5 cite your content in generative answers."
    },
    { 
      label: "GEO Authority Rank", 
      value: 15, 
      status: "Deficit",
      description: "Your brand's competitive positioning within Generative Engine search results."
    }
  ],
  citations: [
    { source: "Reddit / Community", relevance: 88, frequency: "High" },
    { source: "Industry News / PR", relevance: 45, frequency: "Low" },
    { source: "Technical Docs", relevance: 12, frequency: "None" },
    { source: "Partner Ecosystem", relevance: 30, frequency: "Moderate" }
  ],
  telemetry: [
    { event: "Gemini 1.5 Ultra Crawl", result: "Entity Match 42%", timestamp: "2m ago" },
    { event: "Claude 3.5 Sonnet RAG Loop", result: "Source Omitted", timestamp: "5m ago" },
    { event: "GPT-4o Citation Extraction", result: "Competitor Prioritized", timestamp: "12m ago" },
    { event: "Wait-and-See Indexing", result: "Delayed", timestamp: "18m ago" },
  ],
  weightingLogs: [
    { factor: "Domain Authority", weight: 0.15, status: "Diminishing" },
    { factor: "Information Gain", weight: 0.45, status: "Critical" },
    { factor: "Entity Proximity", weight: 0.25, status: "Negligible" },
    { factor: "Sentiment Polarity", weight: 0.15, status: "Neutral" },
  ]
};
