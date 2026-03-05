/**
 * Restaurant Marketing Readiness Scorecard - Types
 * TypeScript interfaces for the scorecard tool
 */

/** Scoring values: 0=Not done, 1=Partial, 2=Fully implemented */
export type ScoreValue = 0 | 1 | 2;

/** Marketing channels that may require certain checklist items */
export type MarketingChannel =
  | 'gbp-maps'
  | 'email'
  | 'sms'
  | 'google-search-ads'
  | 'meta-ads'
  | 'tiktok-ads'
  | 'yelp-ads'
  | 'opentable'
  | 'doordash'
  | 'tripadvisor'
  | 'waze-ads'
  | 'direct-mail'
  | 'influencers';

/** All marketing channels in order */
export const ALL_CHANNELS: MarketingChannel[] = [
  'gbp-maps',
  'email',
  'sms',
  'google-search-ads',
  'meta-ads',
  'tiktok-ads',
  'yelp-ads',
  'opentable',
  'doordash',
  'tripadvisor',
  'waze-ads',
  'direct-mail',
  'influencers',
];

/** Channel mapping - 1 means this item is a prerequisite for this channel */
export type ChannelMap = Record<MarketingChannel, 0 | 1>;

/** A single checklist item with scoring and channel mappings */
export interface ChecklistItem {
  id: string;
  section: string;
  question: string;
  weight: number; // 1-2 importance
  channelMap: ChannelMap;
}

/** Section grouping for checklist items */
export interface ChecklistSection {
  id: string;
  name: string;
  items: ChecklistItem[];
}

/** Marketing channel with full metadata */
export interface ChannelInfo {
  id: MarketingChannel;
  name: string;
  bestFor: string;
  pricingModel: string;
  keyPrerequisite: string;
  whatToMeasure: string;
}

/** User's scorecard inputs */
export interface ScorecardInputs {
  restaurantName: string;
  town: string;
  monthlyBudget: number;
  scores: Record<string, ScoreValue>;
}

/** Channel fit result */
export interface ChannelFitResult {
  channel: ChannelInfo;
  fitPercentage: number;
  recommendation: 'FIX FIRST' | 'TEST' | 'SCALE';
  suggestedBudget: number;
}

/** Calculated results */
export interface ScorecardResults {
  overallReadiness: number; // 0-100
  sectionScores: Record<string, number>;
  channelFit: ChannelFitResult[];
  verdict: string;
  readinessLevel: 'leaky-bucket' | 'workable' | 'ready' | 'top-tier';
  totalWeight: number;
  totalWeightedScore: number;
}
