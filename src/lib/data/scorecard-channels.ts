/**
 * Restaurant Marketing Readiness Scorecard - Channel Data
 * 13 marketing channels with metadata
 */

import type { ChannelInfo, MarketingChannel } from './scorecard-types';

/** All 13 marketing channels with their details */
export const MARKETING_CHANNELS: ChannelInfo[] = [
  {
    id: 'gbp-maps',
    name: 'GBP/Maps',
    bestFor: 'Local pack conversion; organic visibility',
    pricingModel: 'Free (time + ops)',
    keyPrerequisite: 'Photos + reviews + replies + accurate info',
    whatToMeasure: 'Calls, direction clicks, reservations',
  },
  {
    id: 'email',
    name: 'Email',
    bestFor: 'Return visits; slow-night fill; events',
    pricingModel: 'ESP cost (monthly)',
    keyPrerequisite: 'List capture + welcome/win-back flows',
    whatToMeasure: 'Redemptions, repeat lift, revenue/subscriber',
  },
  {
    id: 'sms',
    name: 'SMS',
    bestFor: 'Urgency offers; birthdays; waitlist comms',
    pricingModel: 'Per-message cost',
    keyPrerequisite: 'Consent + low frequency + strong offers',
    whatToMeasure: 'Redemption %, churn/unsub, repeat lift',
  },
  {
    id: 'google-search-ads',
    name: 'Google Search Ads',
    bestFor: "High-intent 'near me' demand capture",
    pricingModel: 'CPC auction',
    keyPrerequisite: 'Strong reviews/photos + track calls/reservations',
    whatToMeasure: 'CPA per reservation/visit proxy',
  },
  {
    id: 'meta-ads',
    name: 'Meta (IG/FB) Ads',
    bestFor: 'Awareness + retargeting + slow-night offers',
    pricingModel: 'CPM/CPC',
    keyPrerequisite: 'Creative volume + offer clarity + retargeting pixel',
    whatToMeasure: 'Offer redemptions, incremental lift by day',
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    bestFor: 'Discovery for visually strong brands',
    pricingModel: 'CPM/CPC',
    keyPrerequisite: 'Consistent short-form creative production',
    whatToMeasure: 'Hold rate, clicks, tracked redemptions',
  },
  {
    id: 'yelp-ads',
    name: 'Yelp Ads',
    bestFor: 'High-intent local comparisons',
    pricingModel: 'CPC auction',
    keyPrerequisite: 'Optimized Yelp page + photo proof + review mgmt',
    whatToMeasure: 'Calls, map clicks, CPA',
  },
  {
    id: 'opentable',
    name: 'OpenTable Promoted',
    bestFor: 'Bookings from undecided diners',
    pricingModel: 'OpenTable in-network promo',
    keyPrerequisite: 'OpenTable listing + inventory mgmt + photos',
    whatToMeasure: 'Cost per cover, bookings by shift',
  },
  {
    id: 'doordash',
    name: 'DoorDash Sponsored',
    bestFor: 'In-app visibility for delivery/pickup',
    pricingModel: 'Sponsored listings (in-app)',
    keyPrerequisite: 'Margin control + travel-ready menu + direct-order plan',
    whatToMeasure: 'Contribution margin/order, incremental orders',
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor Ads',
    bestFor: 'Tourist & visitor discovery',
    pricingModel: 'Performance ads (pay per click)',
    keyPrerequisite: 'Compelling listing + photos + reviews',
    whatToMeasure: 'Clicks, calls, bookings where possible',
  },
  {
    id: 'waze-ads',
    name: 'Waze Ads',
    bestFor: 'Driver capture near exits/arterials',
    pricingModel: 'Location-based ads',
    keyPrerequisite: 'Clear offer + easy parking + accurate pin',
    whatToMeasure: 'Navigation clicks, offer code use',
  },
  {
    id: 'direct-mail',
    name: 'Direct Mail',
    bestFor: 'Neighborhood dominance in tight radius',
    pricingModel: 'Printing + postage',
    keyPrerequisite: 'Trackable codes + repeatable offer',
    whatToMeasure: 'Redemptions by ZIP, repeat rate',
  },
  {
    id: 'influencers',
    name: 'Creators/Influencers',
    bestFor: 'Social proof + discovery',
    pricingModel: 'Fee or comped',
    keyPrerequisite: 'Trackable code + content rights + retargeting',
    whatToMeasure: 'Code redemptions, content reuse ROI',
  },
];

/** Get channel by ID */
export function getChannelById(id: MarketingChannel): ChannelInfo | undefined {
  return MARKETING_CHANNELS.find((ch) => ch.id === id);
}

/** Get channel display name */
export function getChannelName(id: MarketingChannel): string {
  return getChannelById(id)?.name ?? id;
}
