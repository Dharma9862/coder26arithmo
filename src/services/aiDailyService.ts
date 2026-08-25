import { AptitudeQuestion, DailyChallenge } from '../types';
import { StorageService } from './storageService';

export interface AIDailyTask extends DailyChallenge {
  category?: string;
  vedicTip?: string;
  source?: 'gemini-ai' | 'algorithm';
}

const AI_DAILY_TASKS_KEY = 'numbersprint_ai_daily_tasks_v2';
const AI_LAST_GEN_DATE_KEY = 'numbersprint_ai_last_gen_date';

export class AIDailyService {
  /**
   * Loads the current day's unique AI tasks from storage or fetches fresh ones
   */
  public static async getTodayTasks(): Promise<AIDailyTask[]> {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(AI_LAST_GEN_DATE_KEY);
    const cachedData = localStorage.getItem(AI_DAILY_TASKS_KEY);

    if (savedDate === today && cachedData) {
      try {
        const tasks: AIDailyTask[] = JSON.parse(cachedData);
        if (tasks && tasks.length > 0) {
          return tasks;
        }
      } catch (e) {
        console.error('Error parsing cached AI daily tasks', e);
      }
    }

    // Generate fresh tasks for today
    return this.fetchOrGenerateTasks(today);
  }

  /**
   * Fetches fresh tasks from Gemini AI server route with local date-seeded fallback
   */
  public static async fetchOrGenerateTasks(dateStr: string, forceRefresh: boolean = false): Promise<AIDailyTask[]> {
    const profile = StorageService.getProfile();
    try {
      const response = await fetch('/api/ai/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          userLevel: profile.level,
          streak: profile.streakDays,
          accuracy: profile.overallAccuracy || 92,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.tasks) && data.tasks.length > 0) {
          const tasksWithDefaults: AIDailyTask[] = data.tasks.map((t: any, index: number) => ({
            id: t.id || `daily_${dateStr}_${index + 1}`,
            title: t.title || 'Daily Speed Sprint',
            description: t.description || 'Complete calculation objectives',
            targetCount: t.targetCount || 15,
            currentCount: t.currentCount || 0,
            rewardXp: t.rewardXp || 350,
            isCompleted: t.isCompleted || false,
            expiresInHours: 24,
            operation: t.operation || 'multiplication',
            difficulty: t.difficulty || 'intermediate',
            category: t.category || 'Speed Math',
            vedicTip: t.vedicTip || 'Apply Vedic calculation shortcuts for rapid mental estimation.',
            source: data.source || 'gemini-ai',
          }));

          localStorage.setItem(AI_LAST_GEN_DATE_KEY, dateStr);
          localStorage.setItem(AI_DAILY_TASKS_KEY, JSON.stringify(tasksWithDefaults));
          return tasksWithDefaults;
        }
      }
    } catch (err) {
      console.warn('AI Daily task server request failed, utilizing dynamic algorithmic generator', err);
    }

    // Fallback date-seeded unique generator
    const fallbackTasks = this.generateDeterministicDailyTasks(dateStr);
    localStorage.setItem(AI_LAST_GEN_DATE_KEY, dateStr);
    localStorage.setItem(AI_DAILY_TASKS_KEY, JSON.stringify(fallbackTasks));
    return fallbackTasks;
  }

  /**
   * Updates task progress and returns updated tasks list with any newly unlocked XP
   */
  public static async recordActivity(
    operation: string,
    countIncrement: number = 1
  ): Promise<{ tasks: AIDailyTask[]; xpGained: number }> {
    const tasks = await this.getTodayTasks();
    let xpGained = 0;
    let modified = false;

    for (const task of tasks) {
      if (task.isCompleted) continue;

      // Check operation matching
      const matchesOp =
        task.operation === operation ||
        task.operation === 'mixed' ||
        (task.category === 'Exam Prelims' && operation === 'prelims') ||
        (task.category === 'Exam Mains' && operation === 'mains') ||
        (task.operation === 'math_puzzle' && (operation === 'math_puzzle' || operation === 'linear_sequence'));

      if (matchesOp) {
        task.currentCount = Math.min(task.currentCount + countIncrement, task.targetCount);
        if (task.currentCount >= task.targetCount) {
          task.isCompleted = true;
          xpGained += task.rewardXp;
          const profile = StorageService.getProfile();
          profile.xp += task.rewardXp;
          StorageService.saveProfile(profile);
        }
        modified = true;
      }
    }

    if (modified) {
      localStorage.setItem(AI_DAILY_TASKS_KEY, JSON.stringify(tasks));
    }

    return { tasks, xpGained };
  }

  /**
   * Request live Gemini AI derivation for any complex question
   */
  public static async explainQuestionWithAI(question: AptitudeQuestion): Promise<string> {
    try {
      const response = await fetch('/api/ai/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.questionText,
          options: question.options,
          correctAnswerIndex: question.correctAnswerIndex,
          categoryName: question.categoryName,
          subtopic: question.subtopic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.explanation) {
          return data.explanation;
        }
      }
    } catch (e) {
      console.warn('AI explanation fetch failed, using built-in explanation', e);
    }
    return question.explanation || 'Refer to the formula shortcuts and step-by-step notes.';
  }

  /**
   * Date-seeded unique daily challenge generator
   */
  private static generateDeterministicDailyTasks(dateStr: string): AIDailyTask[] {
    const rawNumber = parseInt(dateStr.replace(/-/g, ''), 10) || 20260825;
    const pool = [
      {
        title: 'Vedic 2-Digit Multiplication Sprint',
        description: 'Solve 20 intermediate multiplication questions using Vedic criss-cross method in under 60s.',
        targetCount: 20,
        rewardXp: 350,
        operation: 'multiplication',
        difficulty: 'intermediate',
        category: 'Speed Math',
        vedicTip: 'Vertical and crosswise: Multiply unit digits, add cross-products, then multiply tens digits.',
      },
      {
        title: 'Prelims Percentages & Ratio Benchmark',
        description: 'Complete 15 Prelims-level questions with at least 90% accuracy.',
        targetCount: 15,
        rewardXp: 400,
        operation: 'percentages',
        difficulty: 'intermediate',
        category: 'Exam Prelims',
        vedicTip: 'Use fractional equivalents (e.g., 37.5% = 3/8, 83.33% = 5/6) for instantaneous fraction cancellation.',
      },
      {
        title: 'Rapid Division & Remainder Blitz',
        description: 'Solve 15 division calculations with clean accuracy.',
        targetCount: 15,
        rewardXp: 320,
        operation: 'division',
        difficulty: 'advanced',
        category: 'Speed Math',
        vedicTip: 'To divide by 25, multiply by 4 and shift decimal left two places.',
      },
      {
        title: 'Mains Quantitative & DI Caselet Sprint',
        description: 'Solve 10 multi-step Mains questions.',
        targetCount: 10,
        rewardXp: 500,
        operation: 'advance_calc',
        difficulty: 'expert',
        category: 'Exam Mains',
        vedicTip: 'Calculate net percentage multiplier instead of individual successive calculations.',
      },
      {
        title: 'Mental Addition & Carryover Surge',
        description: 'Rack up 25 rapid addition answers.',
        targetCount: 25,
        rewardXp: 350,
        operation: 'addition',
        difficulty: 'intermediate',
        category: 'Speed Math',
        vedicTip: 'Group numbers into tens complements (e.g., 7+3=10, 8+2=10) before summing remaining digits.',
      },
      {
        title: 'Math Puzzle & Matrix Enigma',
        description: 'Crack 12 missing number and matrix puzzles.',
        targetCount: 12,
        rewardXp: 380,
        operation: 'math_puzzle',
        difficulty: 'advanced',
        category: 'Vedic Puzzle',
        vedicTip: 'Test unit digits and divisibility rules to quickly identify missing factors.',
      },
    ];

    const tasks: AIDailyTask[] = [];
    const startIndex = rawNumber % pool.length;
    for (let i = 0; i < 3; i++) {
      const item = pool[(startIndex + i) % pool.length];
      tasks.push({
        id: `daily_${dateStr}_${i + 1}`,
        title: item.title,
        description: item.description,
        targetCount: item.targetCount,
        currentCount: 0,
        rewardXp: item.rewardXp,
        isCompleted: false,
        expiresInHours: 24,
        operation: item.operation as any,
        difficulty: item.difficulty as any,
        category: item.category,
        vedicTip: item.vedicTip,
        source: 'algorithm',
      });
    }

    return tasks;
  }
}
