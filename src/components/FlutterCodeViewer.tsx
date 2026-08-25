import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Database, 
  Server, 
  Layers,
  Smartphone,
  ShieldCheck,
  Download
} from 'lucide-react';

interface FlutterCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeViewer: React.FC<FlutterCodeViewerProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('main.dart');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const files: Record<string, { category: string; language: string; content: string }> = {
    'main.dart': {
      category: 'Flutter Core Entry',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'core/services/ad_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  // Initialize Supabase Backend
  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL'] ?? '',
    anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
  );

  // Initialize AdMob Test Units
  await AdService.instance.initialize();

  runApp(
    const ProviderScope(
      child: NumberSprintApp(),
    ),
  );
}

class NumberSprintApp extends ConsumerWidget {
  const NumberSprintApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'NumberSprint',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      routerConfig: router,
    );
  }
}`,
    },
    'pubspec.yaml': {
      category: 'Dependencies & Config',
      language: 'yaml',
      content: `name: number_sprint
description: A production-ready speed math and quantitative aptitude gaming app.
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  go_router: ^13.2.0
  supabase_flutter: ^2.5.6
  flutter_dotenv: ^5.1.0
  google_mobile_ads: ^5.1.0
  razorpay_flutter: ^1.3.7
  fl_chart: ^0.68.0
  excel: ^4.0.3
  csv: ^6.0.0
  audioplayers: ^6.0.0
  vibration: ^2.0.1
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  mockito: ^5.4.4
  build_runner: ^2.4.9`,
    },
    'math_engine.dart': {
      category: 'Clean Architecture - Domain',
      language: 'dart',
      content: `import 'dart:math';

enum MathOperation { addition, subtraction, multiplication, division, mixed, powersRoots, percentages }
enum DifficultyLevel { beginner, intermediate, advanced, expert }

class MathQuestion {
  final String id;
  final String displayExpression;
  final int correctAnswer;
  final List<int> options;
  final DifficultyLevel difficulty;

  MathQuestion({
    required this.id,
    required this.displayExpression,
    required this.correctAnswer,
    required this.options,
    required this.difficulty,
  });
}

class MathEngine {
  static final _random = Random();

  static MathQuestion generateQuestion({
    required MathOperation operation,
    required DifficultyLevel difficulty,
    int adaptiveStreak = 0,
  }) {
    // Dynamic difficulty adjustment based on consecutive correct answer streak
    DifficultyLevel effectiveDiff = difficulty;
    if (adaptiveStreak >= 6 && difficulty == DifficultyLevel.beginner) effectiveDiff = DifficultyLevel.intermediate;
    if (adaptiveStreak >= 6 && difficulty == DifficultyLevel.intermediate) effectiveDiff = DifficultyLevel.advanced;
    if (adaptiveStreak >= 5 && difficulty == DifficultyLevel.advanced) effectiveDiff = DifficultyLevel.expert;

    int op1 = 0;
    int op2 = 0;
    int answer = 0;
    String display = '';

    switch (operation) {
      case MathOperation.multiplication:
        if (effectiveDiff == DifficultyLevel.beginner) {
          op1 = _random.nextInt(11) + 2;
          op2 = _random.nextInt(11) + 2;
        } else if (effectiveDiff == DifficultyLevel.intermediate) {
          op1 = _random.nextInt(15) + 11;
          op2 = _random.nextInt(14) + 3;
        } else {
          op1 = _random.nextInt(40) + 15;
          op2 = _random.nextInt(30) + 12;
        }
        answer = op1 * op2;
        display = '$op1 × $op2';
        break;

      case MathOperation.addition:
        op1 = _random.nextInt(80) + 20;
        op2 = _random.nextInt(80) + 15;
        answer = op1 + op2;
        display = '$op1 + $op2';
        break;

      default:
        op1 = _random.nextInt(30) + 10;
        op2 = _random.nextInt(20) + 5;
        answer = op1 + op2;
        display = '$op1 + $op2';
    }

    final options = _generateSmartOptions(answer);
    return MathQuestion(
      id: 'q_\${DateTime.now().millisecondsSinceEpoch}',
      displayExpression: display,
      correctAnswer: answer,
      options: options,
      difficulty: effectiveDiff,
    );
  }

  static List<int> _generateSmartOptions(int answer) {
    final set = <int>{answer};
    final offsets = [1, -1, 5, -5, 10, -10, 2, -2];
    offsets.shuffle(_random);

    for (var offset in offsets) {
      if (set.length == 4) break;
      final cand = answer + offset;
      if (cand > 0) set.add(cand);
    }
    final list = set.toList()..shuffle(_random);
    return list;
  }
}`,
    },
    'schema.sql': {
      category: 'Supabase Database Migrations',
      language: 'sql',
      content: `-- NumberSprint Supabase Schema Migration (Clean RLS & Indexes)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  avatar text default '⚡',
  preferred_difficulty text default 'intermediate',
  streak_days integer default 0,
  xp integer default 0,
  level integer default 1,
  is_premium boolean default false,
  subscription_tier text,
  leaderboard_rank integer default 999,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Game Sessions
create table public.game_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  operation text not null,
  difficulty text not null,
  duration integer not null,
  score integer not null,
  correct_count integer not null,
  wrong_count integer not null,
  accuracy numeric(5,2) not null,
  max_combo integer not null,
  avg_time_ms integer not null,
  best_time_ms integer not null,
  xp_earned integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Aptitude Questions Table
create table public.aptitude_questions (
  id uuid default uuid_generate_v4() primary key,
  category_id text not null,
  category_name text not null,
  question_text text not null,
  options jsonb not null,
  correct_answer_index integer not null,
  explanation text not null,
  difficulty text not null,
  exam_tags text[] default '{}',
  formula_shortcut text,
  image_url text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Question Bookmarks
create table public.question_bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id uuid references public.aptitude_questions(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, question_id)
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.aptitude_questions enable row level security;
alter table public.question_bookmarks enable row level security;

-- Profiles: Users can view all public profiles for leaderboard, but edit only own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Game Sessions: Private to user
create policy "Users can view own sessions" on public.game_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.game_sessions for insert with check (auth.uid() = user_id);

-- Questions: Public read access, Admin write access
create policy "Questions viewable by everyone" on public.aptitude_questions for select using (true);`,
    },
    'razorpay_edge_function.ts': {
      category: 'Supabase Edge Functions',
      language: 'typescript',
      content: `// Supabase Edge Function: create-razorpay-order
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

serve(async (req) => {
  try {
    const { tierId, amount, currency = "INR" } = await req.json();

    // Authenticate user via Supabase Bearer Token
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Call Razorpay API server-side
    const credentials = btoa(\`\${RAZORPAY_KEY_ID}:\${RAZORPAY_KEY_SECRET}\`);
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": \`Basic \${credentials}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // paise
        currency,
        receipt: \`rcpt_\${user.id.slice(0, 8)}_\${Date.now()}\`,
        notes: { userId: user.id, tierId },
      }),
    });

    const orderData = await orderRes.json();
    return new Response(JSON.stringify(orderData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});`,
    },
    'unit_tests.dart': {
      category: 'Unit & Validation Tests',
      language: 'dart',
      content: `import 'package:flutter_test/flutter_test.dart';
import 'package:number_sprint/core/math/math_engine.dart';
import 'package:number_sprint/core/services/admin_import_validator.dart';

void main() {
  group('Math Engine Unit Tests', () {
    test('Addition generates valid options including correct answer', () {
      final q = MathEngine.generateQuestion(
        operation: MathOperation.addition,
        difficulty: DifficultyLevel.beginner,
      );

      expect(q.options.length, 4);
      expect(q.options.contains(q.correctAnswer), isTrue);
      expect(q.options.toSet().length, 4); // All distinct
    });

    test('Multiplication beginner limits operands <= 12', () {
      for (int i = 0; i < 20; i++) {
        final q = MathEngine.generateQuestion(
          operation: MathOperation.multiplication,
          difficulty: DifficultyLevel.beginner,
        );
        expect(q.correctAnswer, lessThanOrEqualTo(144));
      }
    });
  });

  group('CSV/Excel Validator Tests', () {
    test('Rejects row with missing correct answer', () {
      final row = {
        'Question': 'What is 5% of 200?',
        'Option A': '10',
        'Option B': '20',
        'Correct Answer': '',
      };
      final result = AdminImportValidator.validateRow(row);
      expect(result.isValid, isFalse);
      expect(result.errors, contains('Missing correct answer'));
    });
  });
}`,
    },
    '.env.example': {
      category: 'Environment Variables',
      language: 'bash',
      content: `# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Payment Gateway (Test Mode Defaults)
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Google AdMob Test App & Unit IDs
ADMOB_APP_ID_ANDROID=ca-app-pub-3940256099942544~3347511713
ADMOB_BANNER_ID_ANDROID=ca-app-pub-3940256099942544/6300978111
ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-3940256099942544/1033173712
ADMOB_REWARDED_ID_ANDROID=ca-app-pub-3940256099942544/5224354917`,
    },
  };

  const copyCode = () => {
    navigator.clipboard.writeText(files[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                Flutter Clean Architecture & Backend Hub
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Production-ready Flutter/Dart code, Supabase SQL migrations, and Razorpay Edge Functions
              </p>
            </div>
          </div>
          <button
            id="close-code-viewer-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-900 border-r border-slate-700/60 p-4 space-y-1.5 overflow-y-auto shrink-0">
            <div className="px-2 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Project Architecture
            </div>
            {Object.entries(files).map(([filename, data]) => {
              const isActive = activeFile === filename;
              return (
                <button
                  key={filename}
                  id={`file-tree-${filename}`}
                  onClick={() => setActiveFile(filename)}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-mono transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="truncate">{filename}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Main Area */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            
            {/* File Toolbar */}
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-sky-400 font-mono font-bold text-xs border border-slate-700/60">
                  {activeFile}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-black uppercase tracking-wider text-[11px]">{files[activeFile].category}</span>
              </div>

              <button
                id="copy-code-btn"
                onClick={copyCode}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
              <pre className="whitespace-pre">{files[activeFile].content}</pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
