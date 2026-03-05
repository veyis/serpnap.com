/**
 * Technical Audit Report Types
 *
 * Data model for the SERPNAP "Technical Audit Report" -
 * a clinical diagnostic tool designed to close high-ticket dental clients.
 *
 * This looks like an MRI of their business failures, not marketing material.
 */

// Status indicators for the diagnostic
export type StatusLevel = 'red' | 'yellow' | 'green';

export interface StatusIndicator {
  label: string;
  status: StatusLevel;
  description?: string;
}

// Page 1: Executive Summary
export interface ExecutiveSummary {
  practiceName: string;
  estimatedLostRevenue: number;
  speedLatencyStatus: StatusLevel;
  leadResponseStatus: StatusLevel;
  conversionArchitectureStatus: StatusLevel;
  reportDate: string;
}

// Page 2: LCP/Performance Analysis
export interface PerformanceAnalysis {
  mobileScore: number;
  desktopScore: number;
  lcpTime: number; // seconds
  fid: number; // milliseconds
  cls: number; // cumulative layout shift score
  ttfb: number; // time to first byte in milliseconds
  speedIndex: number; // speed index score
  bounceRate: number; // estimated bounce rate percentage
  technicalTax: number; // percentage of ad spend wasted
}

// Page 3: Ghost Lead Analysis
export interface LeadTimelineEvent {
  time: string; // e.g., "10:05 AM"
  event: string;
  status: 'success' | 'warning' | 'failure';
}

export interface GhostLeadAnalysis {
  city: string;
  leadHalfLife: number; // minutes
  timeline: LeadTimelineEvent[];
  currentResponseSystem: string;
  averageResponseTime: number; // minutes
}

// Page 4: Competitive Gap
export interface CompetitorProfile {
  name: string;
  reviewCount: number;
  averageRating: number;
  hasAIResponses: boolean;
  lsaOptimized: boolean;
  monthlyPosts: number;
}

export interface CompetitiveAnalysis {
  clientProfile: CompetitorProfile;
  topCompetitor: CompetitorProfile;
  marketShare: number; // percentage
  rankingPosition: number;
}

// Page 5: SERPNAP Solution
export interface SolutionBlueprint {
  phase1: {
    title: string;
    description: string;
    impact: string;
  };
  phase2: {
    title: string;
    description: string;
    impact: string;
  };
  phase3: {
    title: string;
    description: string;
    impact: string;
  };
  projectedImprovement: {
    leadIncrease: number; // percentage
    responseTimeReduction: number; // percentage
    revenueRecovery: number; // dollar amount
  };
}

// Complete Audit Report Data
export interface TechnicalAuditData {
  // Client Information
  practiceName: string;
  practiceUrl: string;
  contactName: string;
  city: string;
  state: string;
  industry: 'dental' | 'medical' | 'contractor' | 'legal' | 'restaurant' | 'other';

  // Page 1: Executive Summary
  estimatedLostRevenue: number;
  speedLatencyStatus: StatusLevel;
  leadResponseStatus: StatusLevel;
  conversionArchitectureStatus: StatusLevel;

  // Page 2: Performance Data
  performance: PerformanceAnalysis;

  // Page 3: Lead Response Analysis
  leadAnalysis: GhostLeadAnalysis;

  // Page 4: Competitive Data
  competition: CompetitiveAnalysis;

  // Page 5: Solution (auto-generated based on findings)
  solution?: SolutionBlueprint;

  // Metadata
  reportDate: string;
  preparedBy: string;
}

// Default values for quick setup
export const defaultAuditData: Partial<TechnicalAuditData> = {
  industry: 'dental',
  speedLatencyStatus: 'red',
  leadResponseStatus: 'red',
  conversionArchitectureStatus: 'yellow',
  performance: {
    mobileScore: 42,
    desktopScore: 67,
    lcpTime: 3.4,
    fid: 180,
    cls: 0.25,
    ttfb: 1200,
    speedIndex: 4500,
    bounceRate: 40,
    technicalTax: 40,
  },
  leadAnalysis: {
    city: '',
    leadHalfLife: 7,
    timeline: [
      { time: '10:05 AM', event: 'Lead Submitted via Website', status: 'success' },
      { time: '10:35 AM', event: 'No SMS received. (Lead Cold)', status: 'warning' },
      { time: '11:05 AM', event: 'No Phone call. (Lead Lost to Competitor)', status: 'failure' },
    ],
    currentResponseSystem: 'Manual Processing',
    averageResponseTime: 60,
  },
  preparedBy: 'SERPNAP Technical Analysis Team',
};

// Industry-specific copy variations
export const industryVariations: Record<TechnicalAuditData['industry'], {
  leadType: string;
  customerType: string;
  revenueMetric: string;
  competitorType: string;
}> = {
  dental: {
    leadType: 'patient inquiry',
    customerType: 'patients',
    revenueMetric: 'case acceptance rate',
    competitorType: 'practice',
  },
  medical: {
    leadType: 'appointment request',
    customerType: 'patients',
    revenueMetric: 'patient acquisition rate',
    competitorType: 'practice',
  },
  contractor: {
    leadType: 'quote request',
    customerType: 'homeowners',
    revenueMetric: 'close rate',
    competitorType: 'contractor',
  },
  legal: {
    leadType: 'case inquiry',
    customerType: 'clients',
    revenueMetric: 'client conversion rate',
    competitorType: 'firm',
  },
  restaurant: {
    leadType: 'reservation/catering inquiry',
    customerType: 'guests',
    revenueMetric: 'booking conversion rate',
    competitorType: 'restaurant',
  },
  other: {
    leadType: 'lead',
    customerType: 'customers',
    revenueMetric: 'conversion rate',
    competitorType: 'competitor',
  },
};
