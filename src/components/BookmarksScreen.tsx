import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Sparkles, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AptitudeQuestion } from '../types';

interface BookmarksScreenProps {
  bookmarkedQuestions: AptitudeQuestion[];
  onToggleBookmark: (id: string) => void;
  onOpenPractice: (categoryId: string) => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  bookmarkedQuestions,
  onToggleBookmark,
  onOpenPractice,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-sky-500/20 text-sky-400 border border-sky-500/30">
              REVISION VAULT
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{bookmarkedQuestions.length} Questions Saved</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            Saved & Challenging Problems
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
            Revisit your marked exam questions, review shortcuts, and reinforce weak concepts before tests.
          </p>
        </div>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-3 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/60 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-white">No Bookmarked Questions Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
            While practicing questions in the Exam Prep section, tap the bookmark icon to save challenging problems here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id}
                className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/60 hover:border-slate-600 transition-all space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {q.categoryName}
                      </span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {q.questionText}
                    </h3>
                  </div>

                  <button
                    id={`remove-bookmark-${q.id}`}
                    onClick={() => onToggleBookmark(q.id)}
                    className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors shrink-0 border border-transparent hover:border-rose-500/30"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    return (
                      <div 
                        key={oIdx} 
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                          isExpanded && isCorrect 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' 
                            : 'bg-slate-900 border-slate-700/50 text-slate-300'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black shrink-0 text-white">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="truncate font-medium">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Shortcut Formula Banner if present */}
                {q.formulaShortcut && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <span className="font-black text-[10px] uppercase block tracking-wider text-amber-400">Shortcut Trick</span>
                      <span className="font-mono-math font-bold">{q.formulaShortcut}</span>
                    </div>
                  </div>
                )}

                {/* Solution Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                  <button
                    id={`toggle-sol-${q.id}`}
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="text-sky-400 hover:text-sky-300 font-black uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide Solution' : 'Reveal Complete Solution'}</span>
                  </button>

                  <button
                    onClick={() => onOpenPractice(q.categoryId)}
                    className="text-slate-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Practice Topic</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/50 text-xs text-slate-200 whitespace-pre-line leading-relaxed animate-in fade-in font-medium">
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
