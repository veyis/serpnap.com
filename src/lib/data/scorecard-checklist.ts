/**
 * Restaurant Marketing Readiness Scorecard - Checklist Data
 * 28 items across 8 sections with channel prerequisite mappings
 */

import type { ChecklistItem, ChecklistSection, ChannelMap } from './scorecard-types';

/** Helper to create channel map from array */
function createChannelMap(channels: (0 | 1)[]): ChannelMap {
  return {
    'gbp-maps': channels[0],
    'email': channels[1],
    'sms': channels[2],
    'google-search-ads': channels[3],
    'meta-ads': channels[4],
    'tiktok-ads': channels[5],
    'yelp-ads': channels[6],
    'opentable': channels[7],
    'doordash': channels[8],
    'tripadvisor': channels[9],
    'waze-ads': channels[10],
    'direct-mail': channels[11],
    'influencers': channels[12],
  };
}

/** All 28 checklist items organized by section */
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Maps/Reviews (5 items)
  {
    id: 'maps-1',
    section: 'Maps/Reviews',
    question: 'Google Business Profile complete (hours, menu, reservations/order link, attributes)',
    weight: 2,
    channelMap: createChannelMap([1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0]),
  },
  {
    id: 'maps-2',
    section: 'Maps/Reviews',
    question: '40+ real photos (food/interior/exterior/team); refreshed monthly',
    weight: 2,
    channelMap: createChannelMap([1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]),
  },
  {
    id: 'maps-3',
    section: 'Maps/Reviews',
    question: 'Weekly GBP posts (specials/events/seasonal) + accurate holiday hours',
    weight: 1,
    channelMap: createChannelMap([1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1]),
  },
  {
    id: 'maps-4',
    section: 'Maps/Reviews',
    question: 'Review response SOP: reply to ALL reviews within 24-48h',
    weight: 2,
    channelMap: createChannelMap([1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1]),
  },
  {
    id: 'maps-5',
    section: 'Maps/Reviews',
    question: 'Review acquisition system (QR/receipt/server script) + steady velocity',
    weight: 2,
    channelMap: createChannelMap([1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1]),
  },

  // Website (4 items)
  {
    id: 'website-1',
    section: 'Website',
    question: 'Fast mobile site + clear CTA above the fold (Reserve/Call/Order)',
    weight: 2,
    channelMap: createChannelMap([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1]),
  },
  {
    id: 'website-2',
    section: 'Website',
    question: 'Menu is readable (not tiny PDF) and updated; top dishes visible',
    weight: 1,
    channelMap: createChannelMap([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1]),
  },
  {
    id: 'website-3',
    section: 'Website',
    question: 'Local trust cues: address, parking notes, landmarks, FAQs, reviews embedded',
    weight: 1,
    channelMap: createChannelMap([1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1]),
  },
  {
    id: 'website-4',
    section: 'Website',
    question: 'Tracking basics: UTMs + call clicks + reservation/order clicks tracked',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
  },

  // Offers (3 items)
  {
    id: 'offers-1',
    section: 'Offers',
    question: 'One repeatable slow-night offer (Mon-Thu) with clear redemption rules',
    weight: 2,
    channelMap: createChannelMap([1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1]),
  },
  {
    id: 'offers-2',
    section: 'Offers',
    question: 'Event engine: 1-2 monthly events + 10-14 day promo cadence',
    weight: 1,
    channelMap: createChannelMap([1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1]),
  },
  {
    id: 'offers-3',
    section: 'Offers',
    question: 'Catering/private events offer with landing page + lead capture (if applicable)',
    weight: 1,
    channelMap: createChannelMap([0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]),
  },

  // Retention (6 items)
  {
    id: 'retention-1',
    section: 'Retention',
    question: 'Email capture in-store + online (WiFi/QR/receipt/reservations)',
    weight: 2,
    channelMap: createChannelMap([0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1]),
  },
  {
    id: 'retention-2',
    section: 'Retention',
    question: 'SMS capture with consent + clear value proposition (no spam)',
    weight: 1,
    channelMap: createChannelMap([0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1]),
  },
  {
    id: 'retention-3',
    section: 'Retention',
    question: 'Welcome flow (new signup -> reason to visit within 7 days)',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    id: 'retention-4',
    section: 'Retention',
    question: 'Birthday offer automation',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    id: 'retention-5',
    section: 'Retention',
    question: 'Win-back automation (no visit in 30-45 days)',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    id: 'retention-6',
    section: 'Retention',
    question: 'Bounce-back offer on every check (10-14 day window) + tracking',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]),
  },

  // Creative (3 items)
  {
    id: 'creative-1',
    section: 'Creative',
    question: '10-20 short videos (dishes + vibe + staff); reusable across platforms',
    weight: 1,
    channelMap: createChannelMap([0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1]),
  },
  {
    id: 'creative-2',
    section: 'Creative',
    question: "UGC flywheel: ask, repost weekly, in-restaurant 'share trigger'",
    weight: 1,
    channelMap: createChannelMap([1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1]),
  },
  {
    id: 'creative-3',
    section: 'Creative',
    question: 'Offer creative: 3-5 tested creatives per offer (not one post boosted)',
    weight: 1,
    channelMap: createChannelMap([0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1]),
  },

  // Operations (3 items)
  {
    id: 'operations-1',
    section: 'Operations',
    question: 'Service timing standards: greet <30s, drinks <2m, check before asked',
    weight: 2,
    channelMap: createChannelMap([1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1]),
  },
  {
    id: 'operations-2',
    section: 'Operations',
    question: 'Waitlist/reservations UX: online booking + text waitlist updates',
    weight: 1,
    channelMap: createChannelMap([1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]),
  },
  {
    id: 'operations-3',
    section: 'Operations',
    question: 'Recovery playbook for complaints (fast fix + follow-up)',
    weight: 2,
    channelMap: createChannelMap([1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1]),
  },

  // Off-Premise (2 items)
  {
    id: 'offpremise-1',
    section: 'Off-Premise',
    question: 'Delivery menu engineered for travel + packaging quality control',
    weight: 1,
    channelMap: createChannelMap([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]),
  },
  {
    id: 'offpremise-2',
    section: 'Off-Premise',
    question: 'Direct-order strategy (insert, SMS/email capture, bounce-back) to protect margin',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]),
  },

  // Local Reach (2 items)
  {
    id: 'local-1',
    section: 'Local Reach',
    question: 'Neighborhood targeting plan: radius, dayparts, weather triggers',
    weight: 1,
    channelMap: createChannelMap([0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
  },
  {
    id: 'local-2',
    section: 'Local Reach',
    question: 'Unique promo codes by channel (so you can tell what\'s working)',
    weight: 2,
    channelMap: createChannelMap([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
  },
];

/** Group items by section */
export function getChecklistSections(): ChecklistSection[] {
  const sectionMap = new Map<string, ChecklistItem[]>();

  for (const item of CHECKLIST_ITEMS) {
    const existing = sectionMap.get(item.section) || [];
    existing.push(item);
    sectionMap.set(item.section, existing);
  }

  const sections: ChecklistSection[] = [];
  const sectionOrder = [
    'Maps/Reviews',
    'Website',
    'Offers',
    'Retention',
    'Creative',
    'Operations',
    'Off-Premise',
    'Local Reach',
  ];

  for (const name of sectionOrder) {
    const items = sectionMap.get(name);
    if (items) {
      sections.push({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        items,
      });
    }
  }

  return sections;
}

/** Get all items flat */
export function getAllChecklistItems(): ChecklistItem[] {
  return CHECKLIST_ITEMS;
}

/** Get total possible weighted score (max score = 2 * sum of weights) */
export function getTotalMaxWeightedScore(): number {
  return CHECKLIST_ITEMS.reduce((sum, item) => sum + item.weight * 2, 0);
}
