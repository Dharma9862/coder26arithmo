# Arithmo — Speed Math & Quantitative Aptitude Arena

Arithmo is a high-performance, full-stack mental mathematics and quantitative aptitude training platform designed for competitive exam aspirants (CAT, GMAT, Banking PO, SSC-CGL, GRE, UPSC CSAT) and speed-math enthusiasts.

---

## 🚀 Key Features

### ⚡ Speed Math Sprints
- **Operations Supported**: Addition, Subtraction, Multiplication, Division, Squares, Cubes, Square Roots, Cube Roots, Vedic Cross-Multiplication, and Custom Mixes.
- **Configurable Formats**: 30s, 60s, 120s, 300s sprints across Novice, Intermediate, Master, and Grandmaster difficulties.
- **Adaptive Question Generator**: Generates balanced procedural math drills with dynamic distractor logic and difficulty scaling.
- **Interactive Keypad & Voice Feedback**: Integrated numeric on-screen keypad, keyboard shortcut support (`0-9`, `Enter`, `Backspace`, `Space`), and Web Audio sound synthesizer effects.

### 📚 Quantitative Aptitude & Exam Prep
- **20 Comprehensive Topic Banks**:
  1. Number System & Remainder Theorems
  2. Simplification & VBODMAS
  3. HCF & LCM Applications
  4. Fractions, Decimals & Surds
  5. Ratio, Proportion & Variation
  6. Percentage & Multipliers
  7. Average, Weighted Mean & Allegation
  8. Profit, Loss & Discount
  9. Simple & Compound Interest
  10. Partnership & Investment Cycles
  11. Mixture & Alligation
  12. Time, Work, Pipes & Cisterns
  13. Speed, Distance, Trains & Boats
  14. Problems on Ages
  15. Clocks & Calendars
  16. Mensuration 2D & 3D
  17. Data Interpretation (DI)
  18. Permutation, Combination & Probability
  19. Quadratic Equations & Linear Inequations
  20. Data Sufficiency, Tables & Graphs
- **Detailed Concept Guides & Formula Vault**: Visual concept breakdowns, Vedic arithmetic shortcuts, and step-by-step solutions for all questions.
- **Bookmarks & Revision Mode**: Save difficult questions with tags for spaced repetition.

### 🤖 Gemini AI Daily Quests & Concept Tutor
- Server-side integration with **Gemini 2.5 Flash** (`@google/genai`) to generate fresh daily conceptual quantitative challenges.
- Algorithmic fallback engines ensure uninterrupted practice if offline or during network outages.

### ☁️ Cloud Sync & Leaderboards (Firebase)
- **Firebase Authentication**: Email/Password and Google OAuth login.
- **Cloud Firestore**: Real-time synchronization of user profiles, bookmarks, streak counters, test history, and global athlete leaderboards.
- **Multi-Tab Live Synchronization**: BroadcastChannel integration for instant cross-tab state updates.

### 👑 PRO Tier & Payment Integrations
- Razorpay test-mode integration and local unlock pipelines for premium question banks, ad-free training, and advanced speed analytics.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (framer-motion successor), Lucide Icons, Canvas Confetti.
- **Backend / API**: Express 4.x, Node.js 22, `@google/genai` TypeScript SDK.
- **Database & Auth**: Firebase Firestore & Firebase Auth.
- **Build / Packaging**: `esbuild` for single-bundle server compilation (`dist/server.cjs`), `vite` for client-side assets.

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── firebase-applet-config.json # Firebase Web client credentials
├── firestore.rules           # Firestore security rules
├── index.html                # HTML entry point with dark-mode styling
├── metadata.json             # AI Studio applet metadata
├── package.json              # Project dependencies & scripts
├── server.ts                 # Full-stack Express server with Vite middleware & Gemini API
├── src/
│   ├── App.tsx               # Main application container & modal coordinator
│   ├── main.tsx              # React DOM entry point
│   ├── index.css             # Tailwind CSS & custom typography setup
│   ├── components/           # UI screens, modals & reusable navigation elements
│   ├── config/               # App configuration & cross-platform links
│   ├── data/                 # Quantitative question banks & achievements database
│   ├── services/             # Firebase, Storage, Sound, Sync & Math generators
│   └── types/                # Shared TypeScript models and interfaces
└── vite.config.ts            # Vite configuration with Tailwind CSS plugin
```

---

## 💻 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or v22 LTS
- **npm**: v10+

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your Gemini API key (optional for local math drills, required for live AI Quests):
```bash
cp .env.example .env
```
Inside `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 5. Production Build & Start
```bash
npm run build
npm run start
```

---

## 🛡️ Firebase Security Rules

Firestore rules enforce secure user isolation and read-only global leaderboard access:
- `/users/{userId}`: Only accessible by the authenticated user owning the document.
- `/users/{userId}/bookmarks/{bookmarkId}`: Private user bookmarks.
- `/gameSessions/{sessionId}`: Readable by public leaderboard queries; writable only by the session creator.
- Deploy rules using `deploy_firebase` or Firebase CLI (`firebase deploy --only firestore:rules`).

---

## 📄 License
This project is open-source and available under the standard MIT License.
