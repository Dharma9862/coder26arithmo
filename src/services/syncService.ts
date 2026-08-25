import { StorageService } from './storageService';
import { AptitudeQuestion, GameSessionResult, UserProfile } from '../types';

export type SyncEventType = 
  | 'PROFILE_UPDATED'
  | 'SESSION_ADDED'
  | 'BOOKMARK_TOGGLED'
  | 'CHALLENGE_UPDATED'
  | 'QUESTIONS_IMPORTED'
  | 'STATE_RELOADED'
  | 'FULL_SYNC';

export interface SyncMessage {
  type: SyncEventType;
  payload?: any;
  timestamp: number;
  senderId: string;
}

export type SyncListener = (message: SyncMessage) => void;

class SyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private clientId: string = 'client_' + Math.random().toString(36).substring(2, 9);
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private lastSyncTimestamp: number = Date.now();

  constructor() {
    this.initBroadcastChannel();
    this.initStorageListener();
    this.initLocalEventListener();
    this.initNetworkListeners();
  }

  private initLocalEventListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('numbersprint_local_update', (event: any) => {
        const detail = event?.detail || {};
        let syncType: SyncEventType = 'FULL_SYNC';
        if (detail.key === 'numbersprint_user_profile') syncType = 'PROFILE_UPDATED';
        else if (detail.key === 'numbersprint_game_sessions') syncType = 'SESSION_ADDED';
        else if (detail.key === 'numbersprint_bookmarks') syncType = 'BOOKMARK_TOGGLED';
        else if (detail.key === 'numbersprint_daily_challenge') syncType = 'CHALLENGE_UPDATED';
        else if (detail.key === 'numbersprint_custom_questions') syncType = 'QUESTIONS_IMPORTED';

        if (this.channel) {
          try {
            this.channel.postMessage({
              type: syncType,
              payload: detail.data,
              timestamp: Date.now(),
              senderId: this.clientId,
            });
          } catch {
            // fallback
          }
        }
      });
    }
  }

  private initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('numbersprint_live_sync_bus');
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          if (event.data && event.data.senderId !== this.clientId) {
            this.lastSyncTimestamp = Date.now();
            this.notifyListeners(event.data);
          }
        };
      }
    } catch {
      // Fallback if BroadcastChannel is restricted in sandboxed iframes
      this.channel = null;
    }
  }

  private initStorageListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('numbersprint_')) {
          this.lastSyncTimestamp = Date.now();
          const message: SyncMessage = {
            type: 'FULL_SYNC',
            timestamp: Date.now(),
            senderId: 'storage_event',
          };
          this.notifyListeners(message);
        }
      });
    }
  }

  private initNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnlineStatus = true;
        this.broadcast({
          type: 'FULL_SYNC',
          timestamp: Date.now(),
        });
      });

      window.addEventListener('offline', () => {
        this.isOnlineStatus = false;
      });
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(message: SyncMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  public broadcast(message: Omit<SyncMessage, 'senderId'>) {
    const fullMsg: SyncMessage = {
      ...message,
      senderId: this.clientId,
    };
    this.lastSyncTimestamp = Date.now();

    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch {
        // BroadcastChannel post error fallback
      }
    }

    // Also notify internal subscribers
    this.notifyListeners(fullMsg);
  }

  public triggerSync(): {
    profile: UserProfile;
    sessions: GameSessionResult[];
    questions: AptitudeQuestion[];
    achievements: any[];
    dailyChallenge: any;
  } {
    const profile = StorageService.getProfile();
    const sessions = StorageService.getSessions();
    const questions = StorageService.getAllAptitudeQuestions();
    const achievements = StorageService.getAchievements();
    const dailyChallenge = StorageService.getDailyChallenge();

    this.broadcast({
      type: 'STATE_RELOADED',
      timestamp: Date.now(),
    });

    return {
      profile,
      sessions,
      questions,
      achievements,
      dailyChallenge,
    };
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public getLastSyncTime(): number {
    return this.lastSyncTimestamp;
  }

  public detectDevice(): {
    mode: 'desktop' | 'tablet' | 'mobile';
    orientation: 'portrait' | 'landscape';
    width: number;
    height: number;
    isTouch: boolean;
    pixelRatio: number;
  } {
    if (typeof window === 'undefined') {
      return {
        mode: 'desktop',
        orientation: 'portrait',
        width: 1200,
        height: 800,
        isTouch: false,
        pixelRatio: 1,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const orientation = width > height ? 'landscape' : 'portrait';
    const pixelRatio = window.devicePixelRatio || 1;

    let mode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
    if (width < 640) {
      mode = 'mobile';
    } else if (width < 1024) {
      mode = 'tablet';
    } else {
      mode = 'desktop';
    }

    return {
      mode,
      orientation,
      width,
      height,
      isTouch,
      pixelRatio,
    };
  }

  /**
   * Export all user data as a JSON file / string for backup or cross-device transfer
   */
  public exportData(): string {
    const data = {
      profile: StorageService.getProfile(),
      sessions: StorageService.getSessions(),
      achievements: StorageService.getAchievements(),
      bookmarks: StorageService.getBookmarks(),
      customQuestions: StorageService.getCustomQuestions(),
      dailyChallenge: StorageService.getDailyChallenge(),
      exportedAt: new Date().toISOString(),
      version: '2.4.0',
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON string and synchronize all stores
   */
  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) StorageService.saveProfile(data.profile);
      if (data.sessions) localStorage.setItem('numbersprint_game_sessions', JSON.stringify(data.sessions));
      if (data.achievements) StorageService.saveAchievements(data.achievements);
      if (data.bookmarks) localStorage.setItem('numbersprint_bookmarks', JSON.stringify(data.bookmarks));
      if (data.customQuestions) localStorage.setItem('numbersprint_custom_questions', JSON.stringify(data.customQuestions));
      if (data.dailyChallenge) localStorage.setItem('numbersprint_daily_challenge', JSON.stringify(data.dailyChallenge));

      this.triggerSync();
      return true;
    } catch {
      return false;
    }
  }
}

export const syncService = new SyncService();
