import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  GraduationCap, 
  Lightbulb, 
  Layers, 
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { AptitudeCategory, AptitudeQuestion } from '../types';
import { soundService } from '../services/soundService';

interface ExamPrepScreenProps {
  categories: AptitudeCategory[];
  questions: AptitudeQuestion[];
  onToggleBookmark: (questionId: string) => void;
  onQuestionSolved?: (questionId: string, isCorrect: boolean) => void;
}

export const ExamPrepScreen: React.FC<ExamPrepScreenProps> = ({
  categories,
  questions,
  onToggleBookmark,
  onQuestionSolved,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  
  // Practice view state
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userSelections, setUserSelections] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [reportModalQuestion, setReportModalQuestion] = useState<AptitudeQuestion | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Filter questions based on category, search, and difficulty
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategoryId && q.categoryId !== selectedCategoryId) return false;
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesCat = q.categoryName.toLowerCase().includes(query);
        const matchesTag = q.examTags.some(t => t.toLowerCase().includes(query));
        if (!matchesText && !matchesCat && !matchesTag) return false;
      }
      return true;
    });
  }, [questions, selectedCategoryId, difficultyFilter, searchQuery]);

  const activeQuestion = filteredQuestions[activeQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (optionIndex: number) => {
    if (!activeQuestion) return;
    if (userSelections[activeQuestion.id] !== undefined) return; // already answered

    const isCorrect = optionIndex === activeQuestion.correctAnswerIndex;
    setUserSelections((prev) => ({ ...prev, [activeQuestion.id]: optionIndex }));
    setRevealedSolutions((prev) => ({ ...prev, [activeQuestion.id]: true }));

    if (isCorrect) {
      soundService.playCorrect(1);
    } else {
      soundService.playWrong();
    }

    if (onQuestionSolved) {
      onQuestionSolved(activeQuestion.id, isCorrect);
    }
  };

  const handleReportQuestion = () => {
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalQuestion(null);
      setReportReason('');
    }, 1500);
  };

  // If no category selected, show 16 Categories Grid
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-sky-500/20 text-sky-400 border border-sky-500/30">
                EXAM PREP ARENA
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">CAT • GMAT • SSC • BANKING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
              Quantitative Aptitude & Reasoning
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
              Authentic topic-wise practice questions with detailed step-by-step mathematical derivations and speed shortcuts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCategoryId && (
              <button
                id="all-categories-btn"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setActiveQuestionIndex(0);
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>All Topics</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="exam-search-input"
            type="text"
            placeholder="Search questions, formulas, or exam tags (e.g. CAT, Profit, Trains)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveQuestionIndex(0);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1E293B] border border-slate-700/60 text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/60 p-1.5 rounded-2xl">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              id={`diff-filter-${diff.toLowerCase()}`}
              onClick={() => {
                setDifficultyFilter(diff);
                setActiveQuestionIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                difficultyFilter === diff
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Category Grid OR Active Question Practice */}
      {!selectedCategoryId && !searchQuery ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Select Practice Topic ({categories.length} Categories)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {categories.map((cat) => {
              const catQuestions = questions.filter((q) => q.categoryId === cat.id);
              return (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setActiveQuestionIndex(0);
                  }}
                  className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 hover:border-sky-500/60 hover:bg-slate-800/80 cursor-pointer transition-all duration-200 group relative flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-black text-slate-400 font-mono-math">
                        {catQuestions.length} Qs
                      </span>
                    </div>

                    <h3 className="font-black text-sm uppercase tracking-tight text-white group-hover:text-sky-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="truncate max-w-[120px]">{cat.subtopics[0]}</span>
                    <span className="font-black text-sky-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Practice <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Question Practice View */
        <div className="space-y-4">
          
          {/* Active Question Top Bar */}
          {filteredQuestions.length > 0 && activeQuestion ? (
            <div className="space-y-4">
              
              {/* Question Navigation Header */}
              <div className="flex items-center justify-between bg-[#1E293B] border border-slate-700/60 p-3.5 rounded-3xl shadow-md">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-400 text-xs font-black font-mono-math border border-sky-500/25">
                    Q {activeQuestionIndex + 1} / {filteredQuestions.length}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200 hidden sm:inline">
                    {activeQuestion.categoryName}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                    activeQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {activeQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  <button
                    id="bookmark-question-btn"
                    onClick={() => onToggleBookmark(activeQuestion.id)}
                    className={`p-2.5 rounded-2xl border transition-colors ${
                      activeQuestion.isBookmarked
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={activeQuestion.isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  >
                    {activeQuestion.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {/* Report Button */}
                  <button
                    id="report-question-btn"
                    onClick={() => setReportModalQuestion(activeQuestion)}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Report Issue"
                  >
                    <Flag className="w-4 h-4" />
                  </button>

                  {/* Previous / Next buttons */}
                  <button
                    id="prev-question-btn"
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="next-question-btn"
                    disabled={activeQuestionIndex === filteredQuestions.length - 1}
                    onClick={() => setActiveQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Question Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-xl space-y-6">
                
                {/* Exam Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeQuestion.examTags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-700/50">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Question Statement */}
                <div className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line">
                  {activeQuestion.questionText}
                </div>

                {/* Optional Image */}
                {activeQuestion.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2 max-w-md mx-auto">
                    <img 
                      src={activeQuestion.imageUrl} 
                      alt="Question diagram" 
                      className="w-full h-auto object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-3">
                  {activeQuestion.options.map((option, optIdx) => {
                    const isSelected = userSelections[activeQuestion.id] === optIdx;
                    const isAnswered = userSelections[activeQuestion.id] !== undefined;
                    const isCorrect = activeQuestion.correctAnswerIndex === optIdx;

                    let optClass = 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-sky-500/50';
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected) {
                        optClass = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                      } else {
                        optClass = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        id={`prep-opt-${optIdx}`}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-3 text-sm sm:text-base ${optClass}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                            isAnswered && isCorrect ? 'bg-emerald-500 text-slate-950' :
                            isAnswered && isSelected ? 'bg-rose-500 text-white' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug font-medium pt-0.5">{option}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Expandable Explanation & Shortcut Formula */}
                {revealedSolutions[activeQuestion.id] && (
                  <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/70 space-y-4 animate-in fade-in duration-300">
                    
                    {/* Shortcut formula banner if present */}
                    {activeQuestion.formulaShortcut && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-black uppercase text-amber-400 block tracking-widest">
                            Speed Exam Shortcut
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-mono-math font-bold">
                            {activeQuestion.formulaShortcut}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] font-black uppercase text-sky-400 block tracking-widest mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Step-by-Step Derivation
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                        {activeQuestion.explanation}
                      </p>
                    </div>

                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-3">
              <p className="text-slate-400 text-sm">No questions found matching your search and filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* Report Modal */}
      {reportModalQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-400" />
              Report Question Issue
            </h3>
            <p className="text-xs text-slate-300">
              Found a typo, incorrect answer, or ambiguous statement in this question? Let us know:
            </p>

            <textarea
              id="report-reason-input"
              rows={3}
              placeholder="Describe the issue..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                id="cancel-report-btn"
                onClick={() => setReportModalQuestion(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                id="submit-report-btn"
                onClick={handleReportQuestion}
                disabled={reportSuccess}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/20"
              >
                {reportSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Reported!
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
