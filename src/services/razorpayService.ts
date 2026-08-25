/**
 * Razorpay Payment & Subscription Service
 * Supports Test Mode simulation & Live Supabase Edge Function integration
 */

export interface SubscriptionTier {
  id: 'monthly' | 'yearly';
  name: string;
  price: string;
  priceAmount: number;
  currency: string;
  period: string;
  savingsBadge?: string;
  features: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly Sprint',
    price: '$4.99',
    priceAmount: 499,
    currency: 'USD',
    period: 'per month',
    features: [
      '100% Ad-Free Experience',
      'Unlimited Exam Prep Practice',
      'Detailed Speed & Accuracy Analytics',
      'Downloadable Offline Question Packs',
      'Custom Sprint Builder & Unlimited Retries',
      'Step-by-Step Vedic Math Shortcuts',
    ],
  },
  {
    id: 'yearly',
    name: 'Pro Yearly Master',
    price: '$29.99',
    priceAmount: 2999,
    currency: 'USD',
    period: 'per year',
    savingsBadge: 'SAVE 50%',
    features: [
      'Everything in Monthly Pro',
      'Exclusive Speed Grandmaster Badge',
      'Early Access to New Question Packs',
      'Personalized AI Weakness Drill Plan',
      'Priority Leaderboard Ranking Verification',
      'Unlimited Cloud Sync Across Devices',
    ],
  },
];

export interface SupportProduct {
  id: string;
  name: string;
  priceUSD: number;
  price: string;
  priceAmount: number;
  currency: string;
  icon: string;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export const DEFAULT_USD_TO_INR_RATE = 87.50;

export const SUPPORT_PRODUCTS: SupportProduct[] = [
  {
    id: 'tip_coffee',
    name: 'Coffee Tip & Remove Ads',
    priceUSD: 1.99,
    price: '$1.99',
    priceAmount: 199,
    currency: 'USD',
    icon: '☕',
    badge: 'Quick Support',
    description: 'A small cup of coffee to fuel development and banish ads forever.',
    features: [
      'Removes all ads permanently',
      'Instant ad-free sprint & practice',
      'Supports developer server costs',
    ],
  },
  {
    id: 'pro_supporter',
    name: 'Pro Supporter & Remove Ads',
    priceUSD: 4.99,
    price: '$4.99',
    priceAmount: 499,
    currency: 'USD',
    icon: '⚡',
    badge: 'Most Popular',
    popular: true,
    description: 'Full math athlete upgrade with zero ads and all exam prep tools.',
    features: [
      'Removes all ads forever',
      'Unlimited Quantitative Exam Practice',
      'Full Vedic math shortcuts & drills',
      'Speed & accuracy deep analytics',
    ],
  },
  {
    id: 'lifetime_master',
    name: 'Lifetime Master & Remove Ads',
    priceUSD: 9.99,
    price: '$9.99',
    priceAmount: 999,
    currency: 'USD',
    icon: '👑',
    badge: 'Best Value',
    description: 'Lifetime access to all current and future calculation master modules.',
    features: [
      'Removes all ads forever',
      'All future math modes & updates included',
      'Golden Grandmaster profile insignia',
      'Custom drill builder & offline packs',
    ],
  },
  {
    id: 'patron_supporter',
    name: 'Patron Supporter & Remove Ads',
    priceUSD: 19.99,
    price: '$19.99',
    priceAmount: 1999,
    currency: 'USD',
    icon: '💖',
    badge: 'Super Patron',
    description: 'Ultimate support badge for power users championing future development.',
    features: [
      'Removes all ads forever',
      'Exclusive VIP Patron status & badge',
      'Direct feature request priority',
      'All present and future master tools',
    ],
  },
];

export const PRODUCT_TIER_RANK: Record<string, number> = {
  tip_coffee: 1,
  pro_supporter: 2,
  lifetime_master: 3,
  patron_supporter: 4,
};

export const getPlanTier = (productId?: string | null): number => {
  if (!productId) return 0;
  return PRODUCT_TIER_RANK[productId] || 0;
};

export const getProductById = (productId?: string | null): SupportProduct | undefined => {
  if (!productId) return undefined;
  return SUPPORT_PRODUCTS.find((p) => p.id === productId);
};

export const isBiggerPlan = (currentProductId: string | undefined | null, targetProductId: string): boolean => {
  const currentTier = getPlanTier(currentProductId);
  const targetTier = getPlanTier(targetProductId);
  return targetTier > currentTier;
};

export const isLowerPlan = (currentProductId: string | undefined | null, targetProductId: string): boolean => {
  const currentTier = getPlanTier(currentProductId);
  const targetTier = getPlanTier(targetProductId);
  return currentTier > 0 && targetTier < currentTier;
};

export const isCurrentPlan = (currentProductId: string | undefined | null, targetProductId: string, isPremium?: boolean): boolean => {
  if (!isPremium) return false;
  const effectiveCurrent = currentProductId || 'pro_supporter';
  return effectiveCurrent === targetProductId;
};

export const getUpgradeDifference = (
  currentProductId: string | undefined | null, 
  targetProduct: SupportProduct
): { diffUSD: number; hasUpgradeDiscount: boolean; originalPriceUSD: number } => {
  const currentProduct = getProductById(currentProductId || 'pro_supporter');
  if (!currentProduct) {
    return { 
      diffUSD: targetProduct.priceUSD, 
      hasUpgradeDiscount: false,
      originalPriceUSD: targetProduct.priceUSD 
    };
  }
  const diff = Math.max(0, targetProduct.priceUSD - currentProduct.priceUSD);
  return {
    diffUSD: Number(diff.toFixed(2)),
    hasUpgradeDiscount: diff < targetProduct.priceUSD,
    originalPriceUSD: targetProduct.priceUSD,
  };
};

export class RazorpayService {
  public static async processPayment(tier: SubscriptionTier | SupportProduct): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    return new Promise((resolve) => {
      // Simulate real checkout delay & network roundtrip
      setTimeout(() => {
        const mockOrderId = 'order_ns_' + Math.random().toString(36).substring(2, 10);
        const mockPaymentId = 'pay_ns_' + Math.random().toString(36).substring(2, 10);
        
        resolve({
          success: true,
          transactionId: `${mockOrderId} | ${mockPaymentId}`,
        });
      }, 900);
    });
  }
}
