import React from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Zap, 
  AlertTriangle, 
  GraduationCap, 
  Award, 
  Clock, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers
} from 'lucide-react';
import { TopicConceptGuide, AptitudeCategory } from '../types';

interface TopicConceptGuideViewProps {
  guide: TopicConceptGuide;
  category: AptitudeCategory;
  totalQuestions: number;
  onStartPractice: () => void;
  onBackToAllTopics?: () => void;
}

export const TopicConceptGuideView: React.FC<TopicConceptGuideViewProps> = ({
  guide,
  category,
  totalQuestions,
  onStartPractice,
  onBackToAllTopics,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Breadcrumbs / Navigation */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {onBackToAllTopics && (
            <button
              onClick={onBackToAllTopics}
              className="text-[11px] font-black uppercase text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Topics</span>
            </button>
          )}
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-400">
            Concept Masterclass
          </span>
        </div>

        <button
          onClick={onStartPractice}
          className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span>Enter Practice ({totalQuestions} Qs)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Hero Card for Topic */}
      <div className="rounded-2xl bg-[#1E293B] border border-slate-700/70 p-4 sm:p-5 relative overflow-hidden shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                EXAM CONCEPT GUIDE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {guide.examTrends.targetExams || 'SSC CGL • Bank PO • CAT • RRB'}
              </span>
            </div>
            
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{guide.topicName}</span>
            </h2>
            
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {guide.overview}
            </p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 shrink-0 flex flex-col gap-1.5 sm:min-w-[170px]">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Exam Quick Stats
            </div>
            <div className="text-[11px] text-slate-200 flex items-center justify-between gap-2">
              <span className="text-slate-400">Questions:</span>
              <span className="font-bold text-sky-400">{totalQuestions} Solved Items</span>
            </div>
            <div className="text-[11px] text-slate-200 flex items-center justify-between gap-2">
              <span className="text-slate-400">Prelims Pace:</span>
              <span className="font-bold text-emerald-400">{guide.examTrends.recommendedTimePerQuestion.split(' ')[0]}</span>
            </div>
            <button
              onClick={onStartPractice}
              className="mt-1 w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
            >
              <span>Solve Questions</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Subtopic Chips */}
        {category.subtopics && category.subtopics.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Key Subtopics:
            </span>
            {category.subtopics.map((sub, sIdx) => (
              <span 
                key={sIdx}
                className="px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 text-[10px] font-bold border border-slate-800"
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Examination Weightage & Speed Target Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-slate-700/60 flex flex-col justify-between space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Prelims Tier Weightage</span>
          </div>
          <div className="text-xs font-bold text-white leading-snug">
            {guide.examTrends.prelimsWeightage}
          </div>
          <p className="text-[10px] text-slate-400">Focus: Direct formula application & rapid elimination</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-slate-700/60 flex flex-col justify-between space-y-1">
          <div className="flex items-center gap-2 text-purple-400">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Mains Tier Weightage</span>
          </div>
          <div className="text-xs font-bold text-white leading-snug">
            {guide.examTrends.mainsWeightage}
          </div>
          <p className="text-[10px] text-slate-400">Focus: Multi-concept amalgamation & variable models</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-slate-700/60 flex flex-col justify-between space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Target Speed Per Question</span>
          </div>
          <div className="text-xs font-bold text-white leading-snug">
            {guide.examTrends.recommendedTimePerQuestion}
          </div>
          <p className="text-[10px] text-slate-400">Benchmark time for standard cutoff qualification</p>
        </div>
      </div>

      {/* Fundamental Concepts & Theory Section (if provided or derived) */}
      {guide.fundamentalConcepts && guide.fundamentalConcepts.length > 0 && (
        <div className="rounded-2xl bg-[#1E293B] border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white">
                Core Theoretical Foundations
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Deep mathematical principles and concept breakdowns
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {guide.fundamentalConcepts.map((concept, cIdx) => (
              <div 
                key={cIdx}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center font-mono-math">
                    {cIdx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-tight">
                    {concept.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                  {concept.explanation}
                </p>
                {concept.examTakeaway && (
                  <div className="ml-7 p-2 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[10px] text-sky-300 font-medium flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Exam Takeaway:</strong> {concept.examTakeaway}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Formulas & Exam Cheatsheet */}
      <div className="rounded-2xl bg-[#1E293B] border border-slate-700/60 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white">
                High-Yield Formulas & Exam Cheatsheet
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Standard formulas, variable definitions & worked exam examples
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {guide.keyFormulas.length} Key Formulas
          </span>
        </div>

        <div className="space-y-3">
          {guide.keyFormulas.map((formula, fIdx) => (
            <div 
              key={fIdx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  <span>{formula.name}</span>
                </h4>
                <span className="text-[9px] font-black font-mono-math uppercase text-slate-500">
                  Formula #{fIdx + 1}
                </span>
              </div>

              {/* Formula Block */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 font-mono-math text-xs sm:text-sm font-bold tracking-wide select-all">
                {formula.formula}
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {formula.description}
              </p>

              {formula.example && (
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase shrink-0 mt-0.5">
                    Example
                  </span>
                  <span className="font-mono-math leading-relaxed">{formula.example}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vedic Math Speed Shortcuts & 5-Second Hacks */}
      {guide.vedicShortcuts && guide.vedicShortcuts.length > 0 && (
        <div className="rounded-2xl bg-[#1E293B] border border-slate-700/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-white">
                Vedic Speed Shortcuts & Elimination Tricks
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Save 30-45 seconds per question using mental shortcuts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {guide.vedicShortcuts.map((trick, tIdx) => (
              <div 
                key={tIdx}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-tight">
                    {trick.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    <span>Speed Advantage</span>
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {trick.technique}
                </p>

                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-[10px] text-emerald-300 font-medium">
                  <strong>Examiner Hack:</strong> {trick.speedAdvantage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Traps & Negative Marking Warnings */}
      {guide.commonTraps && guide.commonTraps.length > 0 && (
        <div className="rounded-2xl bg-[#1E293B] border border-rose-500/30 p-4 space-y-3 bg-rose-950/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-rose-300">
                Common Traps & Negative Marking Warnings
              </h3>
              <p className="text-[10px] text-rose-400/80 font-medium">
                Avoid these frequent examiner pitfalls to prevent penalty marks
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {guide.commonTraps.map((trap, trapIdx) => (
              <div 
                key={trapIdx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-900/40 text-[11px] text-rose-200/90 leading-relaxed flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span>{trap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating/Prominent CTA Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-600/20 to-indigo-600/20 border border-sky-500/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-tight">
            Ready to test your concept mastery?
          </h3>
          <p className="text-[11px] text-slate-300 font-medium">
            Solve all {totalQuestions} examination-standard questions with step-by-step solutions and instant AI derivations.
          </p>
        </div>

        <button
          onClick={onStartPractice}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all shrink-0"
        >
          <span>Enter Practice Questions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
