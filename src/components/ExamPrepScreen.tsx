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
import { AIDailyService } from '../services/aiDailyService';
import { TopicConceptGuideView } from './TopicConceptGuideView';

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
  const [activeTopicTab, setActiveTopicTab] = useState<'concept' | 'practice'>('concept');
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
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [isLoadingAiExplanation, setIsLoadingAiExplanation] = useState<Record<string, boolean>>({});

  const handleRequestAiExplanation = async (question: AptitudeQuestion) => {
    if (isLoadingAiExplanation[question.id] || aiExplanations[question.id]) return;
    setIsLoadingAiExplanation(prev => ({ ...prev, [question.id]: true }));
    soundService.triggerHaptic('light');
    soundService.playClick();
    const explanation = await AIDailyService.explainQuestionWithAI(question);
    setAiExplanations(prev => ({ ...prev, [question.id]: explanation }));
    setIsLoadingAiExplanation(prev => ({ ...prev, [question.id]: false }));
  };

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

  const handleSelectCategory = (catId: string, initialTab: 'concept' | 'practice' = 'concept') => {
    if (isGuest) {
      soundService.playWrong();
      onRequireAuth?.("Sign in or create an account to access topic theory and practice questions.");
      return;
    }
    setSelectedCategoryId(catId);
    setActiveTopicTab(initialTab);
    setSelectedSubtopic('All');
    setActiveQuestionIndex(0);
  };

  const handleStartCategoryPractice = (catId: string) => {
    handleSelectCategory(catId, 'practice');
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

  const prelimsCount = questions.filter(q => q.examLevel === 'Prelims').length;
  const mainsCount = questions.filter(q => q.examLevel === 'Mains').length;

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
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-400 border border-sky-500/30">
                EXAM PREP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Prelims Tier
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mains Tier
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
            Quantitative Aptitude Mastery
          </h1>
          <p className="text-[11px] text-slate-300 font-medium leading-normal">
            Prelims & Mains standards for SSC CGL, SBI/IBPS PO, CAT & RRB with instant formula shortcuts.
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
            {[
              { id: 'All', label: `All (${questions.length})` },
              { id: 'Prelims', label: `Prelims (${prelimsCount})` },
              { id: 'Mains', label: `Mains (${mainsCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`exam-level-${tab.id.toLowerCase()}`}
                onClick={() => {
                  setExamLevelFilter(tab.id as any);
                  setActiveQuestionIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                  examLevelFilter === tab.id
                    ? tab.id === 'Mains'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : tab.id === 'Prelims'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
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

      {/* Main Content: Category Grid OR Active Topic (Concept Guide / Practice) */}
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
                            onClick={() => handleSelectCategory(cat.id, 'concept')}
                            className="font-black text-xs sm:text-sm uppercase tracking-tight text-white truncate cursor-pointer hover:text-sky-400 transition-colors"
                          >
                            {cat.name}
                          </h3>
                        </div>
                        <p 
                          onClick={() => handleSelectCategory(cat.id, 'concept')}
                          className="text-[11px] text-slate-400 line-clamp-1 font-medium mt-0.5 cursor-pointer hover:text-slate-300"
                        >
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <button
                      onClick={() => handleSelectCategory(cat.id, 'concept')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20"
                    >
                      <BookOpen className="w-3 h-3" /> Study Concept
                    </button>

                    <button
                      onClick={() => handleSelectCategory(cat.id, 'practice')}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center gap-1 text-[10px] transition-all active:scale-95 shadow-sm"
                    >
                      <span>Practice ({catQuestions.length} Qs)</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : selectedCategoryId && !searchQuery && activeTopicTab === 'concept' && activeCategory && TOPIC_CONCEPT_GUIDES[selectedCategoryId] ? (
        /* In-Depth Topic Concept Masterclass View */
        <div className="space-y-3">
          {/* Topic Switcher Bar */}
          <div className="bg-[#1E293B] border border-slate-700/60 p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
            <button
              onClick={() => setActiveTopicTab('concept')}
              className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 shadow-sm transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Concept & Exam Theory</span>
            </button>
            <button
              onClick={() => setActiveTopicTab('practice')}
              className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>2. Practice Questions ({filteredQuestions.length})</span>
            </button>
          </div>

          {/* Full In-Depth Masterclass Component */}
          <TopicConceptGuideView
            guide={TOPIC_CONCEPT_GUIDES[selectedCategoryId]}
            category={activeCategory}
            totalQuestions={filteredQuestions.length}
            onStartPractice={() => setActiveTopicTab('practice')}
            onBackToAllTopics={() => setSelectedCategoryId(null)}
          />
        </div>
      ) : (
        /* Practice Session View - MOBILE OPTIMIZED */
        <div className="space-y-3">
          
          {/* If inside a selected topic, show the 2-Tab Switcher at the top of practice mode */}
          {selectedCategoryId && !searchQuery && activeCategory && (
            <div className="bg-[#1E293B] border border-slate-700/60 p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setActiveTopicTab('concept')}
                className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Concept & Exam Theory</span>
              </button>
              <button
                onClick={() => setActiveTopicTab('practice')}
                className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-sky-500 text-slate-950 shadow-sm transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>2. Practice Questions ({filteredQuestions.length})</span>
              </button>
            </div>
          )}

          {filteredQuestions.length > 0 && activeQuestion ? (
            <div className="space-y-3">
              
              {/* Question Navigation Bar & Actions */}
              <div className="bg-[#1E293B] border border-slate-700/60 p-3 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 text-[11px] font-black font-mono-math border border-sky-500/25 shrink-0">
                      Question {activeQuestionIndex + 1} of {filteredQuestions.length}
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
                    {/* View Concept Button */}
                    {selectedCategoryId && TOPIC_CONCEPT_GUIDES[selectedCategoryId] && (
                      <button
                        onClick={() => setActiveTopicTab('concept')}
                        className="px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                        title="Review Concept Guide"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span className="hidden sm:inline">Concept</span>
                      </button>
                    )}

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
                
                {/* Subtopic, Exam Level & Formula Tag */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap border-b border-slate-700/60 pb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeQuestion.examLevel && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        activeQuestion.examLevel === 'Mains'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {activeQuestion.examLevel === 'Mains' ? '★ Mains Tier' : '✓ Prelims Tier'}
                      </span>
                    )}
                    {activeQuestion.subtopic ? (
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                        {activeQuestion.subtopic}
                      </span>
                    ) : null}
                    {activeQuestion.examTags && activeQuestion.examTags.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1">
                        {activeQuestion.examTags.slice(0, 2).map((tag, tIdx) => (
                          <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase text-sky-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Step-by-Step Derivation
                        </span>
                        
                        {!aiExplanations[activeQuestion.id] && (
                          <button
                            onClick={() => handleRequestAiExplanation(activeQuestion)}
                            disabled={isLoadingAiExplanation[activeQuestion.id]}
                            className="px-2 py-0.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                          >
                            <Sparkles className={`w-3 h-3 ${isLoadingAiExplanation[activeQuestion.id] ? 'animate-spin' : ''}`} />
                            <span>{isLoadingAiExplanation[activeQuestion.id] ? 'AI Thinking...' : 'Deep AI Breakdown'}</span>
                          </button>
                        )}
                      </div>
                      
                      <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                        {activeQuestion.explanation}
                      </p>

                      {aiExplanations[activeQuestion.id] && (
                        <div className="mt-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1 animate-in fade-in">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            Gemini AI Deep Tutor Analysis
                          </span>
                          <p className="text-[11px] text-purple-100/90 whitespace-pre-line leading-relaxed">
                            {aiExplanations[activeQuestion.id]}
                          </p>
                        </div>
                      )}
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
