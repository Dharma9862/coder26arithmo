import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { GameSelectionModal } from './components/GameSelectionModal';
import { LiveGameScreen } from './components/LiveGameScreen';
import { GameResultScreen } from './components/GameResultScreen';
import { ExamPrepScreen } from './components/ExamPrepScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { BookmarksScreen } from './components/BookmarksScreen';
import { SideDrawerMenu } from './components/SideDrawerMenu';
import { AdminUploadModal } from './components/AdminUploadModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { PremiumModal } from './components/PremiumModal';
import { ProfileModal } from './components/ProfileModal';
import { RateAppModal } from './components/RateAppModal';
import { MoreAppsModal } from './components/MoreAppsModal';
import { AuthModal } from './components/AuthModal';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';

import { 
  AptitudeQuestion, 
  DifficultyLevel, 
  GameDuration, 
  GameSessionResult, 
  MathOperation, 
  UserProfile 
} from './types';
import { StorageService } from './services/storageService';
import { APTITUDE_CATEGORIES } from './data/aptitudeQuestions';
import { soundService } from './services/soundService';
import { syncService, SyncMessage } from './services/syncService';

export default function App() {
  // Navigation & Screen States
  const [currentTab, setCurrentTab] = useState<TabType>('sprint');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  
  // Game Flow State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [selectedInitialOp, setSelectedInitialOp] = useState<MathOperation>('multiplication');
  const [activeGameParams, setActiveGameParams] = useState<{
    operation: MathOperation;
    difficulty: DifficultyLevel;
    duration: GameDuration;
  } | null>(null);
  const [latestResult, setLatestResult] = useState<GameSessionResult | null>(null);

  // Modals
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [authPromptReason, setAuthPromptReason] = useState<string | undefined>(undefined);
  const [isRateAppModalOpen, setIsRateAppModalOpen] = useState<boolean>(false);
  const [isMoreAppsModalOpen, setIsMoreAppsModalOpen] = useState<boolean>(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState<boolean>(false);

  // App Data
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [sessions, setSessions] = useState<GameSessionResult[]>(StorageService.getSessions());
  const [achievements, setAchievements] = useState(StorageService.getAchievements());
  const [questions, setQuestions] = useState<AptitudeQuestion[]>(StorageService.getAllAptitudeQuestions());
  const [dailyChallenge, setDailyChallenge] = useState(StorageService.getDailyChallenge());

  // System & Android Hardware Back Button Handler (Backend / History Level)
  useEffect(() => {
    const handlePopState = () => {
      if (isAdminAuthModalOpen) {
        setIsAdminAuthModalOpen(false);
        return;
      }
      if (isAdminModalOpen) {
        setIsAdminModalOpen(false);
        return;
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return;
      }
      if (isProfileModalOpen) {
        setIsProfileModalOpen(false);
        return;
      }
      if (isPremiumModalOpen) {
        setIsPremiumModalOpen(false);
        return;
      }
      if (isRateAppModalOpen) {
        setIsRateAppModalOpen(false);
        return;
      }
      if (isMoreAppsModalOpen) {
        setIsMoreAppsModalOpen(false);
        return;
      }
      if (isCodeViewerOpen) {
        setIsCodeViewerOpen(false);
        return;
      }
      if (isConfigModalOpen) {
        setIsConfigModalOpen(false);
        return;
      }
      if (activeGameParams) {
        setActiveGameParams(null);
        return;
      }
      if (latestResult) {
        setLatestResult(null);
        setCurrentTab('sprint');
        return;
      }
      if (currentTab !== 'sprint') {
        setCurrentTab('sprint');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    isAdminAuthModalOpen,
    isAdminModalOpen,
    isAuthModalOpen,
    isProfileModalOpen,
    isPremiumModalOpen,
    isRateAppModalOpen,
    isMoreAppsModalOpen,
    isCodeViewerOpen,
    isConfigModalOpen,
    activeGameParams,
    latestResult,
    currentTab,
  ]);

  const handleOpenAuthModal = (mode: 'signin' | 'signup' | 'otp' = 'signin', reason?: string) => {
    setAuthModalInitialMode(mode);
    setAuthPromptReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleAuthenticate = (userData: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...profile,
      ...userData,
      isGuest: false,
    };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  // Sound & Audio Feedback sync
  useEffect(() => {
    soundService.setMuted(!profile.soundEnabled);
    soundService.setAudioFeedbackEnabled(profile.audioFeedbackEnabled ?? true);
  }, [profile.soundEnabled, profile.audioFeedbackEnabled]);

  // Live Synchronization & Multi-Tab Broadcast Subscriber
  useEffect(() => {
    const unsubscribe = syncService.subscribe((msg: SyncMessage) => {
      // Reload updated states from storage
      setProfile(StorageService.getProfile());
      setSessions(StorageService.getSessions());
      setAchievements(StorageService.getAchievements());
      setQuestions(StorageService.getAllAptitudeQuestions());
      setDailyChallenge(StorageService.getDailyChallenge());

      if (msg.senderId !== 'storage_event') {
        setSyncToast('⚡ State live synced across open tabs');
        setTimeout(() => setSyncToast(null), 3000);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLiveReload = () => {
    const synced = syncService.triggerSync();
    setProfile(synced.profile);
    setSessions(synced.sessions);
    setAchievements(synced.achievements);
    setQuestions(synced.questions);
    setDailyChallenge(synced.dailyChallenge);
    setSyncToast('⚡ Instant Live Reload completed');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleToggleSound = () => {
    const next = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: next };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleLaunchSprint = (op: MathOperation) => {
    if (profile.isGuest) {
      soundService.playWrong();
      handleOpenAuthModal('signin', 'Sign in or create an account to start Speed Sprints and Vedic Drills.');
      return;
    }
    setSelectedInitialOp(op);
    setIsConfigModalOpen(true);
  };

  const handleStartGame = (op: MathOperation, diff: DifficultyLevel, dur: GameDuration) => {
    if (profile.isGuest) {
      soundService.playWrong();
      handleOpenAuthModal('signin', 'Sign in or create an account to play calculation drills.');
      return;
    }
    setIsConfigModalOpen(false);
    setLatestResult(null);
    setActiveGameParams({ operation: op, difficulty: diff, duration: dur });
  };

  const handleFinishGame = (result: GameSessionResult) => {
    StorageService.saveSession(result);
    setSessions(StorageService.getSessions());
    setProfile(StorageService.getProfile());
    setAchievements(StorageService.getAchievements());
    
    // Update daily challenge progress if matched
    if (result.operation === dailyChallenge.operation && result.correctCount > 0) {
      const updated = StorageService.updateDailyChallenge(result.correctCount);
      setDailyChallenge(updated);
    }

    setLatestResult(result);
    setActiveGameParams(null);
  };

  const handleQuitGame = () => {
    setActiveGameParams(null);
  };

  const handleToggleBookmark = (questionId: string) => {
    StorageService.toggleBookmark(questionId);
    setQuestions(StorageService.getAllAptitudeQuestions());
  };

  const handleImportQuestions = (imported: AptitudeQuestion[]) => {
    StorageService.addCustomQuestions(imported);
    setQuestions(StorageService.getAllAptitudeQuestions());
  };

  const handleUpgradeSuccess = (productId?: string) => {
    const updated: UserProfile = {
      ...profile,
      isPremium: true,
      purchasedProductId: productId || profile.purchasedProductId || 'pro_supporter',
      subscriptionPlan: 'yearly',
      subscriptionExpiresAt: new Date(Date.now() + 3650 * 86400000).toISOString(),
    };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleUpdateProfile = (changes: Partial<UserProfile>) => {
    const updated: UserProfile = { ...profile, ...changes };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleResetProgress = () => {
    localStorage.clear();
    setProfile(StorageService.getProfile());
    setSessions(StorageService.getSessions());
    setAchievements(StorageService.getAchievements());
    setQuestions(StorageService.getAllAptitudeQuestions());
    setIsProfileModalOpen(false);
  };

  const bookmarkedQuestions = questions.filter(q => q.isBookmarked);

  // Active Screen Content
  const renderTabContent = () => {
    // If live sprint is active
    if (activeGameParams) {
      return (
        <LiveGameScreen
          operation={activeGameParams.operation}
          difficulty={activeGameParams.difficulty}
          duration={activeGameParams.duration}
          onFinishGame={handleFinishGame}
          onQuit={handleQuitGame}
          soundEnabled={profile.soundEnabled}
          onToggleSound={handleToggleSound}
          audioFeedbackEnabled={profile.audioFeedbackEnabled ?? true}
          streakDays={profile.streakDays}
        />
      );
    }

    // If just finished game, show results
    if (latestResult) {
      return (
        <GameResultScreen
          result={latestResult}
          onPlayAgain={() => handleStartGame(latestResult.operation, latestResult.difficulty, latestResult.duration)}
          onGoHome={() => {
            setLatestResult(null);
            setCurrentTab('sprint');
          }}
          onViewAnalytics={() => {
            setLatestResult(null);
            setCurrentTab('analytics');
          }}
        />
      );
    }

    switch (currentTab) {
      case 'sprint':
        return (
          <HomeDashboard
            profile={profile}
            dailyChallenge={dailyChallenge}
            onLaunchSprint={handleLaunchSprint}
            onOpenExamPrep={() => setCurrentTab('examprep')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAuth={() => handleOpenAuthModal('signin')}
            onRequireAuth={(reason) => handleOpenAuthModal('signin', reason)}
            onOpenRateApp={() => setIsRateAppModalOpen(true)}
            onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
            onSelectTab={setCurrentTab}
            bookmarkCount={bookmarkedQuestions.length}
          />
        );

      case 'examprep':
        return (
          <ExamPrepScreen
            categories={APTITUDE_CATEGORIES}
            questions={questions}
            isGuest={profile.isGuest}
            onToggleBookmark={handleToggleBookmark}
            onRequireAuth={(reason) => handleOpenAuthModal('signin', reason)}
          />
        );

      case 'analytics':
        return (
          <AnalyticsScreen
            profile={profile}
            sessions={sessions}
            onStartSuggestedSprint={(op) => handleStartGame(op, 'intermediate', 60)}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardScreen
            profile={profile}
            getLeaderboard={StorageService.getLeaderboard}
            onOpenAuth={() => handleOpenAuthModal('signup')}
            onChallengeRival={(rival) => {
              const op = (rival.bestOperation?.toLowerCase().includes('addition') ? 'addition' :
                          rival.bestOperation?.toLowerCase().includes('subtraction') ? 'subtraction' :
                          rival.bestOperation?.toLowerCase().includes('division') ? 'division' :
                          rival.bestOperation?.toLowerCase().includes('vedic') ? 'vedic' : 'multiplication') as MathOperation;
              handleStartGame(op, 'intermediate', 60);
            }}
          />
        );

      case 'bookmarks':
        return (
          <BookmarksScreen
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={handleToggleBookmark}
            onOpenPractice={(catId) => {
              setCurrentTab('examprep');
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex justify-center selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative shadow-2xl sm:border-x sm:border-slate-800">
        
        {/* Floating Real-Time Sync Toast */}
        {syncToast && (
          <aside aria-label="Sync Notification" className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/95 border border-sky-500/50 shadow-xl shadow-sky-500/20 text-sky-300 text-xs font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{syncToast}</span>
            </div>
          </aside>
        )}

        {/* Top Navigation - shown on other tabs, while Home Sprint tab has the Cyan header */}
        {!activeGameParams && currentTab !== 'sprint' && (
          <Navbar
            profile={profile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
            onOpenAuth={() => handleOpenAuthModal('signin')}
            onToggleSound={handleToggleSound}
            onBack={() => setCurrentTab('sprint')}
            onToggleMenu={() => setIsSideDrawerOpen(true)}
          />
        )}

        {/* Global Side Drawer Menu for other tabs */}
        <SideDrawerMenu
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          profile={profile}
          onSelectTab={setCurrentTab}
          onLaunchOperation={handleLaunchSprint}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onOpenAuth={() => handleOpenAuthModal('signin')}
          onOpenRateApp={() => setIsRateAppModalOpen(true)}
          onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
          onTriggerAdmin={() => setIsAdminAuthModalOpen(true)}
          bookmarkCount={bookmarkedQuestions.length}
        />

        {/* Main Screen Content */}
        <main className="flex-1 flex flex-col justify-start w-full">
          {renderTabContent()}
        </main>

        {/* Mobile & Tablet Bottom Navigation (only when not inside live gameplay) */}
        {!activeGameParams && !latestResult && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            bookmarkCount={bookmarkedQuestions.length}
          />
        )}

        {/* Modals */}
        <GameSelectionModal
          isOpen={isConfigModalOpen}
          initialOperation={selectedInitialOp}
          onClose={() => setIsConfigModalOpen(false)}
          onStartGame={handleStartGame}
        />

        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onSuccess={() => setIsAdminModalOpen(true)}
        />

        <AdminUploadModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onImportQuestions={handleImportQuestions}
        />

        <PremiumModal
          isOpen={isPremiumModalOpen}
          profile={profile}
          onClose={() => setIsPremiumModalOpen(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          profile={profile}
          achievements={achievements}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateProfile={handleUpdateProfile}
          onResetProgress={handleResetProgress}
          onOpenAuth={() => handleOpenAuthModal('signin')}
          onOpenRateApp={() => setIsRateAppModalOpen(true)}
          onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
          onTriggerAdmin={() => setIsAdminAuthModalOpen(true)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalInitialMode}
          promptReason={authPromptReason}
          onClose={() => {
            setIsAuthModalOpen(false);
            setAuthPromptReason(undefined);
          }}
          onAuthenticate={handleAuthenticate}
        />

        <RateAppModal
          isOpen={isRateAppModalOpen}
          onClose={() => setIsRateAppModalOpen(false)}
        />

        <MoreAppsModal
          isOpen={isMoreAppsModalOpen}
          onClose={() => setIsMoreAppsModalOpen(false)}
        />

        <FlutterCodeViewer
          isOpen={isCodeViewerOpen}
          onClose={() => setIsCodeViewerOpen(false)}
        />

      </div>
    </div>
  );
}
