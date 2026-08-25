import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ExternalLink, 
  Check, 
  MessageSquare, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { APP_EXTERNAL_LINKS } from '../config/appLinks';
import { soundService } from '../services/soundService';

interface RateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RateAppModal: React.FC<RateAppModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return '🌟 Outstanding! Love it!';
      case 4: return '👍 Great App! Really helpful';
      case 3: return '🙂 Good, but could be better';
      case 2: return '😐 Needs improvement';
      case 1: return '😞 Not satisfied';
      default: return 'Rate your experience';
    }
  };

  const handleStarClick = (score: number) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    setRating(score);
  };

  const handleSubmitRating = () => {
    soundService.triggerHaptic('heavy');
    soundService.playFanfare();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38B6DB', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // Confetti fallback
    }

    // If 4 or 5 stars, also offer to open the store link
    if (rating >= 4) {
      setTimeout(() => {
        // User can click to open or close
      }, 500);
    }
  };

  const handleOpenStore = () => {
    soundService.playClick();
    window.open(APP_EXTERNAL_LINKS.RATE_THIS_APP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-[#38B6DB]/20 via-[#1E293B]/60 to-transparent text-center relative shrink-0">
          
          <button
            id="close-rate-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
            <Heart className="w-7 h-7 fill-amber-400" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Enjoying Arithmo?
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Your rating and feedback helps us build faster calculation drills and features!
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {!submitted ? (
            <>
              {/* Interactive Stars */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      id={`rate-star-${star}`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-slate-600 hover:scale-125 active:scale-95 transition-transform"
                      title={`${star} Stars`}
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= currentDisplayRating
                            ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-amber-300 font-mono-math">
                  {getRatingLabel(currentDisplayRating)}
                </p>
              </div>

              {/* Optional Feedback Input */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-sky-400" />
                  <span>Feedback or Feature Request (Optional)</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you love or what math mode you'd like next..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-200 text-xs focus:outline-none focus:border-sky-500 resize-none font-medium"
                />
              </div>

              {/* Submit & Store Link Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="submit-rating-btn"
                  onClick={handleSubmitRating}
                  className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Rating ({rating} ★)</span>
                </button>

                <button
                  id="open-store-rating-btn"
                  onClick={handleOpenStore}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors border border-slate-700/60 flex items-center justify-center gap-1.5"
                  title="Open App Store / Play Store Link"
                >
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rate on App Store / Play Store</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Notice that link can be updated */}
              <p className="text-[10px] text-center text-slate-500">
                Link configured in <code className="text-slate-400">src/config/appLinks.ts</code>
              </p>
            </>
          ) : (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Thank You for Supporting Us!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                  Your review directly helps us improve calculation tools and add more aptitude exams.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleOpenStore}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Post Review to Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
