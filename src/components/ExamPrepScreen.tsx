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
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Zap,
  Award,
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';
import { AptitudeCategory, AptitudeQuestion, ExamLevel } from '../types';
import { TOPIC_CONCEPT_GUIDES } from '../data/aptitudeTopics';
import { soundService } from '../services/soundService';

interface ExamPrepScreenProps {
  categories: AptitudeCategory[];
  questions: AptitudeQuestion[];
  isGuest?: boolean;
  onToggleBookmark: (questionId: string) => void;
  onQuestionSolved?: (questionId: string, isCorrect: boolean) => void;
  onRequireAuth?: (reason?: string) => void;
}

export const ExamPrepScreen: React.FC<ExamPrepScreenProps> = ({
  categories,
  questions,
  isGuest = false,
  onToggleBookmark,
  onQuestionSolved,
  onRequireAuth,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [examLevelFilter, setExamLevelFilter] = useState<'All' | 'Prelims' | 'Mains'>('All');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('All');
  
  // Practice view state
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userSelections, setUserSelections] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [reportModalQuestion, setReportModalQuestion] = useState<AptitudeQuestion | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [activeConceptGuideId, setActiveConceptGuideId] = useState<string | null>(null);

  // Active category object
  const activeCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Filter questions based on category, search, difficulty, exam level, and subtopic
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategoryId && q.categoryId !== selectedCategoryId) return false;
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
      if (examLevelFilter !== 'All' && q.examLevel && q.examLevel !== examLevelFilter) return false;
      if (selectedSubtopic !== 'All' && q.subtopic && q.subtopic !== selectedSubtopic) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesCat = q.categoryName.toLowerCase().includes(query);
        const matchesTag = q.examTags.some(t => t.toLowerCase().includes(query));
        const matchesSub = q.subtopic ? q.subtopic.toLowerCase().includes(query) : false;
        if (!matchesText && !matchesCat && !matchesTag && !matchesSub) return false;
      }
      return true;
    });
  }, [questions, selectedCategoryId, difficultyFilter, examLevelFilter, selectedSubtopic, searchQuery]);

  const activeQuestion = filteredQuestions[activeQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (optionIndex: number) => {
    if (isGuest) {
      soundService.playWrong();
      onRequireAuth?.("Please sign in or create an account to answer exam questions, view AI derivations, and track your progress.");
      return;
    }

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

  const handleBookmarkClick = (questionId: string) => {
    if (isGuest) {
      soundService.playWrong();
      onRequireAuth?.("Sign in or create an account to save bookmarks and review high-yield questions.");
      return;
    }
    onToggleBookmark(questionId);
  };

  const handleStartCategoryPractice = (catId: string) => {
    if (isGuest) {
      soundService.playWrong();
      onRequireAuth?.("Sign in or create an account to practice topic questions.");
      return;
    }
    setSelectedCategoryId(catId);
    setSelectedSubtopic('All');
    setActiveQuestionIndex(0);
  };

  const handleResetCurrentCategory = () => {
    if (!selectedCategoryId) return;
    const categoryQuestionIds = questions
      .filter(q => q.categoryId === selectedCategoryId)
      .map(q => q.id);

    setUserSelections(prev => {
      const next = { ...prev };
      categoryQuestionIds.forEach(id => delete next[id]);
      return next;
    });

    setRevealedSolutions(prev => {
      const next = { ...prev };
      categoryQuestionIds.forEach(id => delete next[id]);
      return next;
    });
    setActiveQuestionIndex(0);
  };

  const handleReportQuestion = () => {
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalQuestion(null);
      setReportReason('');
    }, 1500);
  };

  const conceptGuide = activeConceptGuideId ? TOPIC_CONCEPT_GUIDES[activeConceptGuideId] : null;

  return (
    <div className="w-full px-3 sm:px-4 py-3 sm:py-4 space-y-3.5 pb-28 animate-in fade-in duration-200">
      
      {/* Guest Warning Banner if unauthenticated */}
      {isGuest && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 text-amber-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Sign in to unlock interactive question answering & save bookmarks</span>
          </div>
          <button
            onClick={() => onRequireAuth?.("Sign in or create an account to practice exam questions.")}
            className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0 hover:bg-amber-400 active:scale-95 transition-all"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 p-4 sm:p-5 relative overflow-hidden shadow-md">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-400 border border-sky-500/30">
                EXAM PREP
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {questions.length} Questions
              </span>
            </div>

            {selectedCategoryId && (
              <button
                id="all-categories-btn"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedSubtopic('All');
                  setActiveQuestionIndex(0);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 text-[11px] font-black uppercase tracking-wider border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Topics</span>
              </button>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-black italic uppercase tracking-tight text-white leading-tight">
            Quantitative Aptitude & Reasoning
          </h1>
          <p className="text-[11px] text-slate-300 font-medium leading-normal">
            Prelims & Mains standards for SSC CGL, Bank PO, CAT & RRB with instant AI breakdowns.
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="exam-search-input"
            type="text"
            placeholder="Search topics, formulas, or tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveQuestionIndex(0);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700/60 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {/* Exam Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/60 p-1 rounded-xl shrink-0">
            {(['All', 'Prelims', 'Mains'] as const).map((level) => (
              <button
                key={level}
                id={`exam-level-${level.toLowerCase()}`}
                onClick={() => {
                  setExamLevelFilter(level);
                  setActiveQuestionIndex(0);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                  examLevelFilter === level
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/60 p-1 rounded-xl shrink-0">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                id={`diff-filter-${diff.toLowerCase()}`}
                onClick={() => {
                  setDifficultyFilter(diff);
                  setActiveQuestionIndex(0);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Subtopics row if in Category Practice view */}
        {activeCategory && activeCategory.subtopics && activeCategory.subtopics.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              Subtopics:
            </span>
            <button
              id="subtopic-all"
              onClick={() => {
                setSelectedSubtopic('All');
                setActiveQuestionIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                selectedSubtopic === 'All'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'bg-[#1E293B] text-slate-400 border border-slate-800'
              }`}
            >
              All
            </button>
            {activeCategory.subtopics.map((sub, sIdx) => (
              <button
                key={sIdx}
                id={`subtopic-${sIdx}`}
                onClick={() => {
                  setSelectedSubtopic(sub);
                  setActiveQuestionIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                  selectedSubtopic === sub
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'bg-[#1E293B] text-slate-400 border border-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content: Category Grid OR Active Question Practice */}
      {!selectedCategoryId && !searchQuery ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              All 20 Topics
            </h2>
            <span className="text-[10px] text-sky-400 font-bold">
              {categories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {categories.map((cat, catIndex) => {
              const catQuestions = questions.filter((q) => q.categoryId === cat.id);
              const answeredCount = catQuestions.filter(q => userSelections[q.id] !== undefined).length;
              const hasGuide = !!TOPIC_CONCEPT_GUIDES[cat.id];

              return (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  className="p-3.5 rounded-2xl bg-[#1E293B] border border-slate-700/60 hover:border-sky-500/60 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm mt-0.5`}>
                        <span className="text-[11px] font-black font-mono-math">
                          #{catIndex + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 
                            onClick={() => handleStartCategoryPractice(cat.id)}
                            className="font-black text-xs sm:text-sm uppercase tracking-tight text-white truncate cursor-pointer hover:text-sky-400 transition-colors"
                          >
                            {cat.name}
                          </h3>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-black text-sky-400 font-mono-math shrink-0">
                            {catQuestions.length} Qs
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 font-medium mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {hasGuide ? (
                      <button
                        onClick={() => setActiveConceptGuideId(cat.id)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px]"
                      >
                        <BookOpen className="w-3 h-3" /> Formula Guide
                      </button>
                    ) : (
                      <span className="text-slate-500">{cat.subtopics?.[0] || 'Core Drills'}</span>
                    )}

                    <button
                      onClick={() => handleStartCategoryPractice(cat.id)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center gap-1 text-[10px] transition-all active:scale-95"
                    >
                      {answeredCount > 0 ? `${answeredCount}/${catQuestions.length} Done` : 'Practice'}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Practice Session View - MOBILE OPTIMIZED */
        <div className="space-y-3">
          
          {filteredQuestions.length > 0 && activeQuestion ? (
            <div className="space-y-3">
              
              {/* Question Navigation Bar & Actions */}
              <div className="bg-[#1E293B] border border-slate-700/60 p-3 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 text-[11px] font-black font-mono-math border border-sky-500/25 shrink-0">
                      Q {activeQuestionIndex + 1}/{filteredQuestions.length}
                    </span>
                    
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-200 truncate max-w-[130px]">
                      {activeQuestion.categoryName}
                    </span>

                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ${
                      activeQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                      activeQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {activeQuestion.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Reset button */}
                    {selectedCategoryId && (
                      <button
                        id="reset-topic-answers-btn"
                        onClick={handleResetCurrentCategory}
                        className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Reset Answers"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Bookmark button */}
                    <button
                      id="bookmark-question-btn"
                      onClick={() => handleBookmarkClick(activeQuestion.id)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        activeQuestion.isBookmarked
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={activeQuestion.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    >
                      {activeQuestion.isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Prev / Next */}
                    <button
                      id="prev-question-btn"
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id="next-question-btn"
                      disabled={activeQuestionIndex === filteredQuestions.length - 1}
                      onClick={() => setActiveQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                      className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Index Strip */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                  {filteredQuestions.map((q, idx) => {
                    const isAns = userSelections[q.id] !== undefined;
                    const isCorr = isAns && userSelections[q.id] === q.correctAnswerIndex;
                    const isCurrent = idx === activeQuestionIndex;

                    let dotClass = 'bg-slate-900 text-slate-400 border border-slate-800';
                    if (isAns) {
                      dotClass = isCorr ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-white font-black';
                    }
                    if (isCurrent) {
                      dotClass += ' ring-2 ring-sky-400 text-sky-400';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-mono-math flex items-center justify-center shrink-0 transition-all ${dotClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Question Card - Responsive Design */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1E293B] border border-slate-700/60 shadow-md space-y-3.5">
                
                {/* Subtopic & Formula Tag */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap border-b border-slate-700/60 pb-2.5">
                  {activeQuestion.subtopic ? (
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                      {activeQuestion.subtopic}
                    </span>
                  ) : null}

                  {activeQuestion.formulaShortcut ? (
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Shortcut Formula
                    </span>
                  ) : null}
                </div>

                {/* Question Statement */}
                <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed whitespace-pre-line">
                  {activeQuestion.questionText}
                </div>

                {/* Diagram if available */}
                {activeQuestion.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 max-w-xs mx-auto">
                    <img 
                      src={activeQuestion.imageUrl} 
                      alt="Question diagram" 
                      className="w-full h-auto object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {activeQuestion.options.map((option, optIdx) => {
                    const isSelected = userSelections[activeQuestion.id] === optIdx;
                    const isAnswered = userSelections[activeQuestion.id] !== undefined;
                    const isCorrect = activeQuestion.correctAnswerIndex === optIdx;

                    let optClass = 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-sky-500/50';
                    
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
                        className={`w-full min-h-[44px] p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 text-xs sm:text-sm ${optClass}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isAnswered && isCorrect ? 'bg-emerald-500 text-slate-950' :
                            isAnswered && isSelected ? 'bg-rose-500 text-white' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug font-medium break-words flex-1">{option}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Show/Hide Solution & Next Question Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                  {!revealedSolutions[activeQuestion.id] ? (
                    <button
                      onClick={() => {
                        if (isGuest) {
                          onRequireAuth?.("Please sign in or create an account to view AI solutions & shortcuts.");
                          return;
                        }
                        setRevealedSolutions(prev => ({ ...prev, [activeQuestion.id]: true }));
                      }}
                      className="text-[11px] font-black uppercase text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 py-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> View AI Solution
                    </button>
                  ) : (
                    <button
                      onClick={() => setRevealedSolutions(prev => ({ ...prev, [activeQuestion.id]: false }))}
                      className="text-[11px] font-black uppercase text-slate-400 hover:text-slate-300 transition-colors py-1"
                    >
                      Hide Solution
                    </button>
                  )}

                  {activeQuestionIndex < filteredQuestions.length - 1 && (
                    <button
                      onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* AI Solution & Derivation Expander */}
                {revealedSolutions[activeQuestion.id] && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/70 space-y-2.5 animate-in fade-in duration-200">
                    {/* Shortcut formula banner */}
                    {activeQuestion.formulaShortcut && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                            Exam Shortcut
                          </span>
                          <p className="text-xs text-slate-200 font-mono-math font-bold">
                            {activeQuestion.formulaShortcut}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-black uppercase text-sky-400 block tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Step-by-Step Derivation
                      </span>
                      <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                        {activeQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#1E293B] border border-slate-700/60 space-y-2.5">
              <p className="text-slate-400 text-xs">No questions match your filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('All');
                  setExamLevelFilter('All');
                  setSelectedSubtopic('All');
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* Concept Guide Modal */}
      {conceptGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-3.5 border-b border-slate-700/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-400 block tracking-widest">
                    FORMULA GUIDE
                  </span>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-white truncate max-w-[220px]">
                    {conceptGuide.topicName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveConceptGuideId(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-slate-200 text-xs leading-relaxed flex-1">
              <div>
                <h4 className="text-[10px] font-black uppercase text-sky-400 mb-1">
                  Concept Overview
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {conceptGuide.overview}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase text-amber-400 mb-1">
                  Speed Formulas
                </h4>
                <div className="space-y-2">
                  {conceptGuide.keyFormulas.map((kf, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-white uppercase">{kf.name}</span>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-math text-[11px] font-bold">
                        {kf.formula}
                      </div>
                      <p className="text-slate-400 text-[10px]">{kf.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-700/80 bg-slate-900/60 flex items-center justify-end">
              <button
                onClick={() => {
                  setSelectedCategoryId(conceptGuide.categoryId);
                  setActiveConceptGuideId(null);
                  setActiveQuestionIndex(0);
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider"
              >
                Practice Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Question Modal */}
      {reportModalQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 max-w-xs w-full space-y-3 shadow-xl">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-rose-400" />
              Report Issue
            </h3>
            <textarea
              rows={3}
              placeholder="Describe typo or issue..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReportModalQuestion(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReportQuestion}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-black uppercase"
              >
                {reportSuccess ? 'Sent!' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
