import type { EventType, EventVibe, EventDetails } from '../types/event';

export interface EventTypeOption {
  type: EventType;
  label: string;
  icon: string;
  desc: string;
}

export interface EventVibeOption {
  vibe: EventVibe;
  label: string;
  emoji: string;
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { type: 'wedding', label: 'Wedding', icon: '🏰', desc: 'Sangeet, Ceremony, Banquet, multi-day coordination' },
  { type: 'birthday', label: 'Milestone Birthday', icon: '🎂', desc: '1st, 18th, 50th Golden, custom cake & entertainment' },
  { type: 'community', label: 'Community Festival', icon: '🌱', desc: 'Charity carnival, cultural fest, volunteer roles' },
  { type: 'anniversary', label: 'Anniversary', icon: '🥂', desc: 'Silver/Golden jubilee, intimate dining & memory video' },
  { type: 'corporate', label: 'Corporate Gala', icon: '💼', desc: 'Annual summit, awards ceremony, keynote staging' },
];

export const EVENT_VIBE_OPTIONS: EventVibeOption[] = [
  { vibe: 'traditional', label: 'Traditional / Heritage', emoji: '🪔' },
  { vibe: 'luxury', label: 'Grand Luxury & Glamour', emoji: '✨' },
  { vibe: 'rustic', label: 'Rustic & Bohemian', emoji: '🌿' },
  { vibe: 'modern-chic', label: 'Modern Chic & Sleek', emoji: '🍸' },
  { vibe: 'minimalist', label: 'Minimalist & Eco-friendly', emoji: '🍃' },
  { vibe: 'festive', label: 'Vibrant & Festive Carnival', emoji: '🎉' },
];

export const DIETARY_OPTIONS: string[] = [
  'Vegetarian Counters',
  'Jain Available',
  'Vegan Specialties',
  'Gluten-Free Section',
  'Halal Certified',
  'Live Chaat & Dessert Bar',
];

export function getInitialEventDetails(): EventDetails {
  const defaultTargetDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return {
    id: `event-${Date.now()}`,
    title: '',
    type: 'wedding',
    vibe: 'traditional',
    targetDate: defaultTargetDate,
    guestCount: 150,
    currency: 'INR',
    totalBudget: 1200000,
    location: 'Banquets & Lawns, Mumbai',
    specialNeeds: 'Wheelchair access ramp at main entrance; quiet zone for elders.',
    dietaryPreferences: ['Vegetarian Counters', 'Jain Available'],
    priorities: {
      venue: 4,
      catering: 5,
      photography: 4,
      decor: 3,
      entertainment: 3,
    },
  };
}
