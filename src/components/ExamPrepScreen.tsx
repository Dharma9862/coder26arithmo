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
  X
} from 'lucide-react';
import { AptitudeCategory, AptitudeQuestion, ExamLevel } from '../types';
import { TOPIC_CONCEPT_GUIDES } from '../data/aptitudeTopics';
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-28 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-sky-500/20 text-sky-400 border border-sky-500/30">
                EXAM PREP ARENA
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                20 TOPICS • 520+ HIGH-YIELD QUESTIONS • AI DERIVATIONS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
              Quantitative Aptitude & Reasoning
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl font-medium leading-relaxed">
              Master Prelims & Mains difficulty standards for SSC CGL, IBPS PO, SBI PO, CAT, CDS, and RRB NTPC with instant AI concept breakdowns and speed shortcuts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {selectedCategoryId ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="view-concept-guide-btn"
                  onClick={() => setActiveConceptGuideId(selectedCategoryId)}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider border border-amber-500/40 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Topic Formula Cheatsheet</span>
                </button>
                <button
                  id="all-categories-btn"
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSelectedSubtopic('All');
                    setActiveQuestionIndex(0);
                  }}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] sm:text-xs font-black uppercase tracking-wider border border-slate-700 transition-colors flex items-center gap-1.5 sm:gap-2"
                >
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>All 20 Topics</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="exam-search-input"
              type="text"
              placeholder="Search topics, questions, formulas, or exam tags (e.g. Unit Digit, Mains, Alligation)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveQuestionIndex(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-[#1E293B] border border-slate-700/60 text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Exam Level Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/60 p-1 sm:p-1.5 rounded-2xl">
              {(['All', 'Prelims', 'Mains'] as const).map((level) => (
                <button
                  key={level}
                  id={`exam-level-${level.toLowerCase()}`}
                  onClick={() => {
                    setExamLevelFilter(level);
                    setActiveQuestionIndex(0);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                    examLevelFilter === level
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Difficulty Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/60 p-1 sm:p-1.5 rounded-2xl">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  id={`diff-filter-${diff.toLowerCase()}`}
                  onClick={() => {
                    setDifficultyFilter(diff);
                    setActiveQuestionIndex(0);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
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
        </div>

        {/* Subtopics row if in Category Practice view */}
        {activeCategory && activeCategory.subtopics && activeCategory.subtopics.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              Subtopics:
            </span>
            <button
              id="subtopic-all"
              onClick={() => {
                setSelectedSubtopic('All');
                setActiveQuestionIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedSubtopic === 'All'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'bg-[#1E293B] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Subtopics
            </button>
            {activeCategory.subtopics.map((sub, sIdx) => (
              <button
                key={sIdx}
                id={`subtopic-${sIdx}`}
                onClick={() => {
                  setSelectedSubtopic(sub);
                  setActiveQuestionIndex(0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedSubtopic === sub
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'bg-[#1E293B] text-slate-400 border border-slate-800 hover:text-slate-200'
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 flex-wrap">
              <span>All 20 Quantitative Aptitude & Reasoning Topics</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 text-[10px]">
                {questions.length} Questions Loaded
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {categories.map((cat, catIndex) => {
              const catQuestions = questions.filter((q) => q.categoryId === cat.id);
              const answeredCount = catQuestions.filter(q => userSelections[q.id] !== undefined).length;
              const hasGuide = !!TOPIC_CONCEPT_GUIDES[cat.id];

              return (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  className="p-4.5 sm:p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 hover:border-sky-500/60 hover:bg-slate-800/90 transition-all duration-200 group relative flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                        <span className="text-xs font-black font-mono-math">
                          #{catIndex + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasGuide && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveConceptGuideId(cat.id);
                            }}
                            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700 transition-colors"
                            title="Open Formula Cheatsheet"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-black text-sky-400 font-mono-math">
                          {catQuestions.length} Qs
                        </span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setSelectedSubtopic('All');
                        setActiveQuestionIndex(0);
                      }}
                      className="font-black text-sm uppercase tracking-tight text-white group-hover:text-sky-400 cursor-pointer transition-colors"
                    >
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    {answeredCount > 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px] sm:text-xs">
                        <CheckCircle2 className="w-3 h-3" /> {answeredCount}/{catQuestions.length} Done
                      </span>
                    ) : (
                      <span className="truncate max-w-[120px] text-slate-500 text-[10px] sm:text-xs">{cat.subtopics?.[0] || 'Core Theory'}</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setSelectedSubtopic('All');
                        setActiveQuestionIndex(0);
                      }}
                      className="font-black text-sky-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-xs"
                    >
                      Practice <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Practice Session View */
        <div className="space-y-4">
          
          {filteredQuestions.length > 0 && activeQuestion ? (
            <div className="space-y-4">
              
              {/* Question Navigation Bar & Quick Jumper */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1E293B] border border-slate-700/60 p-4 rounded-3xl gap-3 shadow-md">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-400 text-xs font-black font-mono-math border border-sky-500/25">
                    Q {activeQuestionIndex + 1} / {filteredQuestions.length}
                  </span>
                  
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    {activeQuestion.categoryName}
                  </span>

                  {activeQuestion.examLevel && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      activeQuestion.examLevel === 'Mains'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {activeQuestion.examLevel} Level
                    </span>
                  )}

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                    activeQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {activeQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Reset button */}
                  {selectedCategoryId && (
                    <button
                      id="reset-topic-answers-btn"
                      onClick={handleResetCurrentCategory}
                      className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Reset practice session answers for this topic"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  {/* Bookmark button */}
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

                  {/* Prev / Next */}
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

              {/* Question Index Dots / Quick Jumper */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {filteredQuestions.map((q, idx) => {
                  const isAns = userSelections[q.id] !== undefined;
                  const isCorr = isAns && userSelections[q.id] === q.correctAnswerIndex;
                  const isCurrent = idx === activeQuestionIndex;

                  let dotClass = 'bg-slate-800 text-slate-400 border border-slate-700';
                  if (isAns) {
                    dotClass = isCorr ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-white font-black';
                  }
                  if (isCurrent) {
                    dotClass += ' ring-2 ring-sky-400';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-xl text-[11px] font-mono-math flex items-center justify-center shrink-0 transition-all ${dotClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Main Question Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-xl space-y-6">
                
                {/* Subtopic & Exam Tags Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeQuestion.subtopic && (
                      <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
                        {activeQuestion.subtopic}
                      </span>
                    )}
                    {activeQuestion.examTags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-700/50">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {activeQuestion.formulaShortcut && (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Formula Shortcut Included
                    </span>
                  )}
                </div>

                {/* Question Statement */}
                <div className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line">
                  {activeQuestion.questionText}
                </div>

                {/* Diagram if available */}
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

                {/* Show/Hide Solution Trigger if not automatically answered */}
                <div className="flex items-center justify-between pt-2">
                  {!revealedSolutions[activeQuestion.id] ? (
                    <button
                      onClick={() => setRevealedSolutions(prev => ({ ...prev, [activeQuestion.id]: true }))}
                      className="text-xs font-black uppercase text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> View AI Solution & Shortcut
                    </button>
                  ) : (
                    <button
                      onClick={() => setRevealedSolutions(prev => ({ ...prev, [activeQuestion.id]: false }))}
                      className="text-xs font-black uppercase text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Hide Solution
                    </button>
                  )}

                  {activeQuestionIndex < filteredQuestions.length - 1 && (
                    <button
                      onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Expandable Explanation & Shortcut Formula */}
                {revealedSolutions[activeQuestion.id] && (
                  <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/70 space-y-4 animate-in fade-in duration-300">
                    
                    {/* Shortcut formula banner */}
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
                        AI Step-by-Step Derivation & Concept Explanation
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
                  setExamLevelFilter('All');
                  setSelectedSubtopic('All');
                }}
                className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* Concept Guide / Cheatsheet Modal */}
      {conceptGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-700/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 block">
                    TOPIC CONCEPT GUIDE & AI CHEATSHEET
                  </span>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                    {conceptGuide.topicName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveConceptGuideId(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
              
              {/* Exam Trends & Weights */}
              {conceptGuide.examTrends && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25">
                    <span className="text-[10px] font-black uppercase text-blue-400 block tracking-wider">Prelims Weightage</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5 block">{conceptGuide.examTrends.prelimsWeightage}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25">
                    <span className="text-[10px] font-black uppercase text-purple-400 block tracking-wider">Mains Weightage</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5 block">{conceptGuide.examTrends.mainsWeightage}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">Target Speed</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5 block">{conceptGuide.examTrends.recommendedTimePerQuestion}</span>
                  </div>
                </div>
              )}

              {/* Overview */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Concept Overview & Theoretical Foundations
                </h4>
                <p className="text-slate-300 font-medium leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  {conceptGuide.overview}
                </p>
              </div>

              {/* Key Formulas */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Essential Speed Formulas & Core Equations
                </h4>
                <div className="space-y-3">
                  {conceptGuide.keyFormulas.map((kf, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{kf.name}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-math text-xs font-bold">
                        {kf.formula}
                      </div>
                      <p className="text-slate-400 text-xs">{kf.description}</p>
                      {kf.example && (
                        <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-sky-400 font-bold">Example: </span>{kf.example}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vedic & Speed Shortcuts */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Vedic Math & Speed Exam Shortcuts
                </h4>
                <div className="space-y-3">
                  {conceptGuide.vedicShortcuts.map((vs, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300">{vs.title}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">
                          {vs.speedAdvantage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{vs.technique}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Traps */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Common Traps & Negative-Marking Hazards
                </h4>
                <ul className="space-y-2 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/25">
                  {conceptGuide.commonTraps.map((trap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-rose-200 text-xs">
                      <span className="text-rose-400 shrink-0 mt-0.5">⚠️</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-700/80 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Ready to practice questions on this topic?
              </span>
              <button
                onClick={() => {
                  setSelectedCategoryId(conceptGuide.categoryId);
                  setActiveConceptGuideId(null);
                  setActiveQuestionIndex(0);
                }}
                className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-colors shadow-md"
              >
                Start Practice Questions
              </button>
            </div>

          </div>
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
