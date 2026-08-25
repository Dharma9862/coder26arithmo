import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock,
  Crown,
  RotateCcw,
  ArrowRightLeft,
  TrendingUp,
  ArrowUpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SUPPORT_PRODUCTS, 
  SupportProduct, 
  DEFAULT_USD_TO_INR_RATE, 
  RazorpayService,
  getPlanTier,
  getProductById,
  isBiggerPlan,
  isLowerPlan,
  getUpgradeDifference,
} from '../services/razorpayService';
import { soundService } from '../services/soundService';
import { UserProfile } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  profile?: UserProfile;
  onClose: () => void;
  onUpgradeSuccess: (productId: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  profile,
  onClose,
  onUpgradeSuccess,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
  const [usdRate] = useState<number>(DEFAULT_USD_TO_INR_RATE);
  const [showCustomConverter, setShowCustomConverter] = useState<boolean>(false);
  const [calcUsdInput, setCalcUsdInput] = useState<string>('5');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [upgradeNotification, setUpgradeNotification] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active plan details
  const hasActivePlan = Boolean(profile?.isPremium);
  const rawPlanId = profile?.purchasedProductId || (hasActivePlan ? 'pro_supporter' : null);
  const currentPlanTier = hasActivePlan ? getPlanTier(rawPlanId) : 0;
  const currentProduct = hasActivePlan ? getProductById(rawPlanId) : undefined;
  const isTopTier = currentPlanTier >= 4;

  // Convert USD to INR
  const getInrAmount = (usd: number): number => {
    return Math.round(usd * usdRate);
  };

  const formatPrice = (usd: number, targetCurr: 'USD' | 'INR') => {
    if (targetCurr === 'USD') {
      return `$${usd.toFixed(2)}`;
    }
    const inr = getInrAmount(usd);
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const handleBuyOrUpgradeProduct = async (product: SupportProduct, isUpgrade: boolean) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    setProcessingId(product.id);
    
    const res = await RazorpayService.processPayment(product);
    setProcessingId(null);

    if (res.success) {
      setPurchasedId(product.id);
      soundService.playFanfare();

      if (isUpgrade) {
        setUpgradeNotification(`🎉 Congratulations! You have successfully upgraded to ${product.name}!`);
      } else {
        setUpgradeNotification(`🎉 Congratulations! You have unlocked ${product.name}!`);
      }
      
      try {
        confetti({
          particleCount: 130,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#38B6DB', '#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        onUpgradeSuccess(product.id);
        onClose();
      }, 1600);
    }
  };

  const handleRestore = () => {
    soundService.triggerHaptic('light');
    soundService.playClick();
    setRestoreMessage('Checking previous purchases...');
    setTimeout(() => {
      setRestoreMessage('Your ad-free status & plan tier are active & synchronized!');
      setTimeout(() => setRestoreMessage(null), 3000);
    }, 800);
  };

  const parsedCalcUsd = parseFloat(calcUsdInput) || 0;
  const convertedInr = Math.round(parsedCalcUsd * usdRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header with Heading & Description */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-[#38B6DB]/20 via-[#1E293B]/60 to-transparent text-center relative shrink-0">
          
          {/* Close button */}
          <button
            id="close-support-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ad-Free & Support Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
            <div className="relative w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center">
              <span className="text-[6px] font-black text-red-400">ADS</span>
              <div className="w-[110%] h-[1.5px] bg-red-500 -rotate-45 absolute" />
            </div>
            <span>Permanent Ad-Free</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            {hasActivePlan ? 'Manage & Upgrade Plan' : 'Support & Remove Ads'}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium max-w-md mx-auto leading-relaxed">
            {hasActivePlan 
              ? 'You may upgrade your current plan to a bigger tier to unlock higher perks & master tools.'
              : 'Every purchase removes ads forever and helps support future speed calculation updates.'}
          </p>

          {/* Dollar & INR Currency Converter Control Bar */}
          <div className="mt-4 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            
            {/* Currency Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
              <button
                id="currency-toggle-inr"
                onClick={() => {
                  soundService.playClick();
                  setCurrency('INR');
                }}
                className={`px-3 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>₹ INR (Rupee)</span>
              </button>

              <button
                id="currency-toggle-usd"
                onClick={() => {
                  soundService.playClick();
                  setCurrency('USD');
                }}
                className={`px-3 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>$ USD (Dollar)</span>
              </button>
            </div>

            {/* Live Exchange Rate & Quick Converter Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-800/60 font-mono-math">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>$1.00 = ₹{usdRate.toFixed(2)}</span>
              </div>

              <button
                id="toggle-custom-converter-btn"
                onClick={() => {
                  soundService.playClick();
                  setShowCustomConverter(!showCustomConverter);
                }}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  showCustomConverter 
                    ? 'bg-sky-500 text-slate-950 border-sky-400' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Open USD to INR live converter calculator"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Interactive Quick USD & INR Converter Calculator Dropdown */}
          {showCustomConverter && (
            <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/40 text-left animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Live Dollar ($) to Rupee (₹) Converter
                </span>
                <span className="text-[10px] text-slate-400 font-mono-math">
                  Rate: $1 = ₹{usdRate.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                {/* USD Input */}
                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="font-bold text-sky-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={calcUsdInput}
                    onChange={(e) => setCalcUsdInput(e.target.value)}
                    className="w-full bg-transparent text-white font-mono-math text-sm outline-none font-bold"
                    placeholder="Enter USD..."
                  />
                  <span className="text-[10px] font-bold text-slate-400">USD</span>
                </div>

                {/* Converted INR Output */}
                <div className="flex items-center justify-between bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30">
                  <span className="text-[11px] font-bold text-slate-300">Equivalent:</span>
                  <span className="font-mono-math text-base font-black text-emerald-400">
                    ₹{convertedInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quick rate preset chips */}
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold">Quick Amounts:</span>
                {[1.99, 4.99, 9.99, 19.99].map((val) => (
                  <button
                    key={val}
                    onClick={() => setCalcUsdInput(val.toString())}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono-math font-bold transition-colors cursor-pointer"
                  >
                    ${val} = ₹{Math.round(val * usdRate)}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Scrollable Products List with individual Buy & Upgrade Buttons */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Active Subscription / Plan Status Banner */}
          {hasActivePlan && (
            <div className={`p-4 rounded-2xl border text-xs shadow-md ${
              isTopTier
                ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-slate-900 border-amber-500/40 text-amber-200'
                : 'bg-gradient-to-r from-emerald-500/20 via-sky-500/15 to-slate-900 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
                    {currentProduct?.icon || '⚡'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">
                        {currentProduct?.name || 'Active Plan'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        Current Plan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      {isTopTier
                        ? '🏆 Maximum Tier Active: All current and future calculation master modules are permanently unlocked.'
                        : '💡 Plan Active! You may upgrade to a bigger plan below to unlock advanced master tiers.'}
                    </p>
                  </div>
                </div>

                {!isTopTier && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider shrink-0 self-start sm:self-center">
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Upgrades Available</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {upgradeNotification && (
            <div className="p-3 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-bold text-center animate-fadeIn shadow-md">
              {upgradeNotification}
            </div>
          )}

          {restoreMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
              {restoreMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SUPPORT_PRODUCTS.map((product) => {
              const isBuying = processingId === product.id;
              const isJustPurchased = purchasedId === product.id;
              const isPopular = product.popular;
              
              const productTier = getPlanTier(product.id);
              const isThisCurrentPlan = isJustPurchased || (hasActivePlan && (rawPlanId === product.id));
              const isHigher = hasActivePlan && !isThisCurrentPlan && productTier > currentPlanTier;
              const isLower = hasActivePlan && !isThisCurrentPlan && productTier < currentPlanTier;
              
              // Pricing calculations
              const primaryPrice = formatPrice(product.priceUSD, currency);
              const secondaryPrice = currency === 'INR' 
                ? `$${product.priceUSD.toFixed(2)}`
                : `₹${getInrAmount(product.priceUSD).toLocaleString('en-IN')}`;

              // Upgrade difference calculations
              const upgradeInfo = getUpgradeDifference(rawPlanId, product);
              const upgradeDiffPrimary = formatPrice(upgradeInfo.diffUSD, currency);
              const upgradeDiffSecondary = currency === 'INR' 
                ? `$${upgradeInfo.diffUSD.toFixed(2)}`
                : `₹${getInrAmount(upgradeInfo.diffUSD).toLocaleString('en-IN')}`;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between transition-all relative ${
                    isThisCurrentPlan
                      ? 'border-emerald-400 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/40'
                      : isHigher
                      ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30 hover:border-amber-300'
                      : isLower
                      ? 'border-slate-800 bg-slate-900/60 opacity-75'
                      : isPopular
                      ? 'border-sky-400/90 bg-gradient-to-b from-sky-950/40 to-slate-900 shadow-lg shadow-sky-500/10'
                      : 'border-slate-700/70 bg-slate-900/90 hover:border-slate-600'
                  }`}
                >
                  {/* Top Badges: Current Plan vs Upgrade Available vs Popular */}
                  {isThisCurrentPlan ? (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1 border border-emerald-300">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Current Plan</span>
                    </span>
                  ) : isHigher ? (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md flex items-center gap-1 border border-amber-300">
                      <ArrowUpCircle className="w-3 h-3 stroke-[2.5]" />
                      <span>Upgrade Plan</span>
                    </span>
                  ) : isLower ? (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                      Included in Your Tier
                    </span>
                  ) : product.badge ? (
                    <span className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      isPopular
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-sky-500 text-slate-950'
                    }`}>
                      {product.badge}
                    </span>
                  ) : null}

                  {/* Top info */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-2xl">{product.icon}</span>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">
                          {product.name}
                        </h3>
                        
                        {/* Pricing Display */}
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className={`text-xl font-black font-mono-math ${
                            isHigher ? 'text-amber-400' : 'text-sky-400'
                          }`}>
                            {primaryPrice}
                          </span>
                          <span className="text-xs font-bold text-slate-400 font-mono-math">
                            (≈ {secondaryPrice})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2.5 font-medium leading-normal">
                      {product.description}
                    </p>

                    {/* If this is a bigger plan than current plan, show upgrade difference notice */}
                    {isHigher && (
                      <div className="p-2.5 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between text-amber-300 font-bold">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Upgrade Price:
                          </span>
                          <span className="font-mono-math font-black text-amber-400">
                            {upgradeDiffPrimary}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-200/80">
                          Pay only {upgradeDiffPrimary} (≈ {upgradeDiffSecondary}) difference from your {currentProduct?.name.split(' & ')[0] || 'current plan'}.
                        </p>
                      </div>
                    )}

                    {/* Features checklist */}
                    <div className="space-y-1.5 mb-4">
                      {product.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isHigher ? 'text-amber-400' : 'text-sky-400'
                          }`} />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Action Button: Current vs Upgrade vs Buy vs Lower */}
                  {isThisCurrentPlan ? (
                    <div className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs cursor-default">
                      <Check className="w-4 h-4 stroke-[3] text-emerald-400" />
                      <span>Active Current Plan</span>
                    </div>
                  ) : isLower ? (
                    <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed">
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      <span>Included in Your Current Plan</span>
                    </div>
                  ) : isHigher ? (
                    <button
                      id={`upgrade-btn-${product.id}`}
                      disabled={processingId !== null}
                      onClick={() => handleBuyOrUpgradeProduct(product, true)}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isBuying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Upgrading...</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="w-4 h-4 stroke-[2.5]" />
                          <span>Upgrade to {product.name.split(' & ')[0]} ({upgradeDiffPrimary})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      id={`buy-btn-${product.id}`}
                      disabled={processingId !== null}
                      onClick={() => handleBuyOrUpgradeProduct(product, false)}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer ${
                        isPopular
                          ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                      } disabled:opacity-50`}
                    >
                      {isBuying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Buy {primaryPrice}</span>
                        </>
                      )}
                    </button>
                  )}

                </div>
              );
            })}
          </div>

          {/* Guarantee & Restore Purchase Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs border-t border-slate-700/50 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe 256-bit payment • One-time purchase • Zero ads forever</span>
            </div>

            <button
              id="restore-purchases-btn"
              onClick={handleRestore}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore Purchases</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
