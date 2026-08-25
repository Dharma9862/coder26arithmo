/**
 * External Links Configuration
 * Replace these placeholder URLs with your actual Google Play Store, 
 * Apple App Store, or Developer Portfolio links whenever you are ready!
 */

export const APP_EXTERNAL_LINKS = {
  // Placeholder URL for Rating the App on Google Play / App Store
  RATE_THIS_APP_URL: 'https://play.google.com/store/apps/details?id=com.arithmo.speedmath',
  
  // Placeholder URL for Developer's Portfolio or More Apps catalog
  MORE_APPS_URL: 'https://play.google.com/store/apps/dev?id=7718160609568912345',

  // Feedback & Support Email
  SUPPORT_EMAIL: 'support@arithmo.app',
};

export interface FeaturedAppItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  icon: string;
  description: string;
  badge?: string;
  url: string;
}

export const MORE_APPS_CATALOG: FeaturedAppItem[] = [
  {
    id: 'vedic_math_pro',
    name: 'Vedic Math Master',
    category: 'Education & Speed Math',
    rating: 4.9,
    icon: '⚡',
    badge: 'Popular',
    description: 'Master 16 Vedic Sutras with step-by-step interactive animations and drills.',
    url: 'https://play.google.com/store/apps/details?id=com.numbersprint.vedicmaster',
  },
  {
    id: 'vocab_sprint',
    name: 'VocabSprint GRE & SSC',
    category: 'Exam Preparation',
    rating: 4.8,
    icon: '📚',
    badge: 'New',
    description: 'High-yield mnemonic flashcards and rapid-fire vocabulary sprints for exams.',
    url: 'https://play.google.com/store/apps/details?id=com.numbersprint.vocabsprint',
  },
  {
    id: 'brain_zen',
    name: 'BrainZen Focus & Memory',
    category: 'Brain Training',
    rating: 4.7,
    icon: '🧠',
    description: 'Daily cognitive speed, numerical agility, and working memory micro-workouts.',
    url: 'https://play.google.com/store/apps/details?id=com.numbersprint.brainzen',
  },
  {
    id: 'quant_master',
    name: 'QuantMaster Formula Pro',
    category: 'Quantitative Aptitude',
    rating: 4.9,
    icon: '📐',
    badge: 'Featured',
    description: 'Master 500+ quantitative shortcut formulas, DI tricks, and speed math calculations.',
    url: 'https://play.google.com/store/apps/details?id=com.numbersprint.quantmaster',
  },
];
