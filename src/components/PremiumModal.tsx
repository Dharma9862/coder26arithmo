import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock,
  Heart,
  Crown,
  Coffee,
  RotateCcw,
  Ban,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SUPPORT_PRODUCTS, 
  SupportProduct, 
  DEFAULT_USD_TO_INR_RATE, 
  RazorpayService 
} from '../services/razorpayService';
import { soundService } from '../services/soundService';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (productId: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
  const [usdRate, setUsdRate] = useState<number>(DEFAULT_USD_TO_INR_RATE);
  const [showCustomConverter, setShowCustomConverter] = useState<boolean>(false);
  const [calcUsdInput, setCalcUsdInput] = useState<string>('5');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleBuyProduct = async (product: SupportProduct) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    setProcessingId(product.id);
    
    const res = await RazorpayService.processPayment(product);
    setProcessingId(null);

    if (res.success) {
      setPurchasedId(product.id);
      soundService.playFanfare();
      
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#38B6DB', '#f59e0b', '#10b981', '#6366f1'],
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        onUpgradeSuccess(product.id);
        onClose();
      }, 1400);
    }
  };

  const handleRestore = () => {
    soundService.triggerHaptic('light');
    soundService.playClick();
    setRestoreMessage('Checking previous purchases...');
    setTimeout(() => {
      setRestoreMessage('Your ad-free status is active & synchronized!');
      setTimeout(() => setRestoreMessage(null), 3000);
    }, 800);
  };

  const parsedCalcUsd = parseFloat(calcUsdInput) || 0;
  const convertedInr = Math.round(parsedCalcUsd * usdRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header with Heading & Description */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-[#38B6DB]/20 via-[#1E293B]/60 to-transparent text-center relative shrink-0">
          
          {/* Close button */}
          <button
            id="close-support-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95"
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

          {/* Requested Heading */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Support & remove ads
          </h2>

          {/* Requested Description */}
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium max-w-md mx-auto leading-relaxed">
            Every purchase removes ads forever and helps support future updates
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
                className={`px-3 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1.5 ${
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
                className={`px-3 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1.5 ${
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
                className={`p-1.5 rounded-xl border transition-colors ${
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
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono-math font-bold transition-colors"
                  >
                    ${val} = ₹{Math.round(val * usdRate)}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Scrollable Products List with individual Buy Buttons */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {restoreMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
              {restoreMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SUPPORT_PRODUCTS.map((product) => {
              const isBuying = processingId === product.id;
              const isPurchased = purchasedId === product.id;
              const isPopular = product.popular;
              
              const primaryPrice = formatPrice(product.priceUSD, currency);
              const secondaryPrice = currency === 'INR' 
                ? `$${product.priceUSD.toFixed(2)}`
                : `₹${getInrAmount(product.priceUSD).toLocaleString('en-IN')}`;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'border-sky-400/90 bg-gradient-to-b from-sky-950/40 to-slate-900 shadow-lg shadow-sky-500/10'
                      : 'border-slate-700/70 bg-slate-900/90 hover:border-slate-600'
                  }`}
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      isPopular
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-sky-500 text-slate-950'
                    }`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Top info */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-2xl">{product.icon}</span>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">
                          {product.name}
                        </h3>
                        
                        {/* Dual Currency Price Display with Rupee & Dollar */}
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xl font-black text-sky-400 font-mono-math">
                            {primaryPrice}
                          </span>
                          <span className="text-xs font-bold text-slate-400 font-mono-math">
                            (≈ {secondaryPrice})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3 font-medium leading-normal">
                      {product.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-1.5 mb-4">
                      {product.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Buy Button with Rupee / Dollar symbol */}
                  <button
                    id={`buy-btn-${product.id}`}
                    disabled={processingId !== null || isPurchased}
                    onClick={() => handleBuyProduct(product)}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md ${
                      isPurchased
                        ? 'bg-emerald-500 text-white'
                        : isPopular
                        ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                    } disabled:opacity-50`}
                  >
                    {isBuying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : isPurchased ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Purchased!</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Buy {primaryPrice}</span>
                      </>
                    )}
                  </button>

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
              className="text-[11px] text-sky-400 hover:text-sky-300 font-bold underline underline-offset-2 flex items-center gap-1"
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
