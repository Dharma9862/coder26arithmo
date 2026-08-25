import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client lazily
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Daily Unique Tasks & Challenges Generation using Gemini AI
app.post('/api/ai/daily-tasks', async (req, res) => {
  try {
    const { date, userLevel, streak, accuracy } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic response when API key is not configured
      return res.json({
        source: 'algorithm',
        tasks: generateFallbackDailyTasks(date || new Date().toISOString().split('T')[0]),
      });
    }

    const prompt = `You are the master quantitative aptitude and speed math coach for Arithmo.
Generate 3 unique, exciting, and mathematically rich daily quests for the date ${date || new Date().toISOString().split('T')[0]}.
The user has level ${userLevel || 1}, a ${streak || 0}-day streak, and ${accuracy || 90}% overall accuracy.

Return a JSON array of 3 objects with these exact keys:
- "id": string unique identifier
- "title": concise punchy task title (e.g., "Vedic Criss-Cross Blitz", "Prelims Percentages Surge", "Mains Time & Work Marathon")
- "description": clear objective with specific criteria (e.g., "Solve 20 intermediate multiplication questions under 60 seconds")
- "targetCount": integer target (e.g., 15, 20, 25)
- "currentCount": 0
- "rewardXp": integer XP reward (200 to 500)
- "operation": one of ["addition", "subtraction", "multiplication", "division", "powers_roots", "percentages", "mixed", "math_puzzle", "advance_calc"]
- "difficulty": one of ["beginner", "intermediate", "advanced", "expert"]
- "category": string (e.g. "Speed Math", "Exam Prelims", "Exam Mains", "Vedic Puzzle")
- "vedicTip": a 1-sentence Vedic calculation tip or formula shortcut related to this task.

Respond ONLY with valid JSON array of 3 task objects.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '[]';
    const tasks = JSON.parse(text);

    return res.json({
      source: 'gemini-ai',
      tasks: Array.isArray(tasks) && tasks.length > 0 ? tasks : generateFallbackDailyTasks(date),
    });
  } catch (error: any) {
    console.error('Error generating AI daily tasks:', error);
    const dateStr = req.body?.date || new Date().toISOString().split('T')[0];
    return res.json({
      source: 'algorithm-fallback',
      tasks: generateFallbackDailyTasks(dateStr),
    });
  }
});

// API: AI Question Explainer / Formula Breakdown
app.post('/api/ai/explain-question', async (req, res) => {
  try {
    const { questionText, options, correctAnswerIndex, categoryName, subtopic } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        explanation: 'Instant Step-by-Step AI breakdown is available. Review the formula shortcuts and standard derivations provided in the exam syllabus.',
      });
    }

    const correctOption = options && options[correctAnswerIndex] !== undefined ? options[correctAnswerIndex] : 'Option ' + (correctAnswerIndex + 1);

    const prompt = `You are an expert Quantitative Aptitude exam tutor for SSC CGL, SBI/IBPS PO, and CAT.
Break down this question concisely with:
1. Quick Concept & Formula shortcut (< 40 words)
2. Fastest Vedic / Elimination Trick (under 20 seconds method)
3. Step-by-Step formal proof

Question: ${questionText}
Category: ${categoryName || 'Quantitative Aptitude'}
Subtopic: ${subtopic || 'General'}
Options: ${JSON.stringify(options || [])}
Correct Option: ${correctOption}

Keep the explanation clear, crisp, and high-yield.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return res.json({
      explanation: response.text || 'Explanation generated.',
    });
  } catch (error: any) {
    console.error('Error explaining question with Gemini:', error);
    return res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// Algorithmic Fallback for Daily Tasks
function generateFallbackDailyTasks(dateStr: string) {
  const dateNum = dateStr ? parseInt(dateStr.replace(/-/g, ''), 10) : 20260825;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = new Date().getDay();

  const taskPool = [
    {
      title: 'Vedic 2-Digit Multiplication Sprint',
      description: 'Solve 20 intermediate multiplication problems using Vedic criss-cross technique in under 60 seconds.',
      targetCount: 20,
      rewardXp: 350,
      operation: 'multiplication',
      difficulty: 'intermediate',
      category: 'Speed Math',
      vedicTip: 'Use Urdhva Tiryagbhyam: Vertical and crosswise multiplication for 2-digit numbers in 5 seconds.',
    },
    {
      title: 'Prelims Percentages & Ratio Marathon',
      description: 'Answer 15 Prelims-tier Percentage and Ratio questions with at least 90% accuracy.',
      targetCount: 15,
      rewardXp: 400,
      operation: 'percentages',
      difficulty: 'intermediate',
      category: 'Exam Prelims',
      vedicTip: 'Convert standard percentages to fractions (e.g., 16.66% = 1/6, 37.5% = 3/8) for rapid reduction.',
    },
    {
      title: 'Rapid Division & Remainder Blitz',
      description: 'Complete 15 division calculations with zero mistakes.',
      targetCount: 15,
      rewardXp: 300,
      operation: 'division',
      difficulty: 'advanced',
      category: 'Speed Math',
      vedicTip: 'Use digital roots (mod 9) to verify quotient and remainders instantaneously.',
    },
    {
      title: 'Mains Quantitative & DI Quest',
      description: 'Solve 10 advanced Mains-level multi-step questions.',
      targetCount: 10,
      rewardXp: 500,
      operation: 'advance_calc',
      difficulty: 'advanced',
      category: 'Exam Mains',
      vedicTip: 'Break complex multi-step expressions into clean sub-factors before evaluating.',
    },
    {
      title: 'Mental Addition & Carryover Surge',
      description: 'Rack up 25 consecutive correct additions in rapid succession.',
      targetCount: 25,
      rewardXp: 350,
      operation: 'addition',
      difficulty: 'intermediate',
      category: 'Speed Math',
      vedicTip: 'Add from left-to-right (hundreds first, then tens, then units) for faster mental visualization.',
    },
    {
      title: 'Math Puzzle & Matrix Enigma',
      description: 'Crack 12 missing number and operator puzzles.',
      targetCount: 12,
      rewardXp: 380,
      operation: 'math_puzzle',
      difficulty: 'advanced',
      category: 'Vedic Puzzle',
      vedicTip: 'Look for parity (even/odd) and modular divisibility when solving missing variables.',
    },
  ];

  // Pick 3 pseudo-random but deterministic tasks based on the date
  const selected: any[] = [];
  const startIdx = (dateNum + dayIndex) % taskPool.length;
  for (let i = 0; i < 3; i++) {
    const raw = taskPool[(startIdx + i) % taskPool.length];
    selected.push({
      id: `daily_${dateStr}_${i + 1}`,
      ...raw,
      currentCount: 0,
      isCompleted: false,
    });
  }
  return selected;
}

// Start Server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arithmo full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
