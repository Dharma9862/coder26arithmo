import { DifficultyLevel, MathOperation, MathQuestion } from '../types';

export class MathGenerator {
  /**
   * Generates an adaptive speed math question with 4 intelligent multiple choice options
   */
  public static generateQuestion(
    operation: MathOperation,
    difficulty: DifficultyLevel,
    adaptiveStreak: number = 0
  ): MathQuestion {
    // Determine effective difficulty factoring in live adaptive streak
    let effectiveDifficulty = difficulty;
    if (adaptiveStreak >= 7 && difficulty === 'beginner') effectiveDifficulty = 'intermediate';
    else if (adaptiveStreak >= 6 && difficulty === 'intermediate') effectiveDifficulty = 'advanced';
    else if (adaptiveStreak >= 5 && difficulty === 'advanced') effectiveDifficulty = 'expert';

    let resolvedOp = operation;
    if (resolvedOp === 'mixed') {
      const ops: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division', 'powers_roots', 'percentages'];
      resolvedOp = ops[Math.floor(Math.random() * ops.length)];
    }

    let op1 = 0;
    let op2 = 0;
    let symbol = '+';
    let answer = 0;
    let display = '';

    switch (resolvedOp) {
      case 'addition':
        symbol = '+';
        if (effectiveDifficulty === 'beginner') {
          op1 = this.randomInt(3, 20);
          op2 = this.randomInt(2, 20);
        } else if (effectiveDifficulty === 'intermediate') {
          op1 = this.randomInt(25, 99);
          op2 = this.randomInt(15, 99);
        } else if (effectiveDifficulty === 'advanced') {
          op1 = this.randomInt(120, 890);
          op2 = this.randomInt(85, 750);
        } else {
          // Expert
          op1 = this.randomInt(1050, 6800);
          op2 = this.randomInt(450, 4800);
        }
        answer = op1 + op2;
        display = `${op1} + ${op2}`;
        break;

      case 'subtraction':
        symbol = '−';
        if (effectiveDifficulty === 'beginner') {
          op1 = this.randomInt(8, 30);
          op2 = this.randomInt(2, op1 - 1);
        } else if (effectiveDifficulty === 'intermediate') {
          op1 = this.randomInt(40, 150);
          op2 = this.randomInt(12, op1 - 5);
        } else if (effectiveDifficulty === 'advanced') {
          op1 = this.randomInt(250, 999);
          op2 = this.randomInt(65, op1 - 20);
        } else {
          // Expert
          op1 = this.randomInt(1500, 8500);
          op2 = this.randomInt(480, op1 - 100);
        }
        answer = op1 - op2;
        display = `${op1} − ${op2}`;
        break;

      case 'multiplication':
        symbol = '×';
        if (effectiveDifficulty === 'beginner') {
          op1 = this.randomInt(2, 12);
          op2 = this.randomInt(2, 12);
        } else if (effectiveDifficulty === 'intermediate') {
          op1 = this.randomInt(11, 25);
          op2 = this.randomInt(3, 16);
        } else if (effectiveDifficulty === 'advanced') {
          op1 = this.randomInt(14, 55);
          op2 = this.randomInt(12, 35);
        } else {
          // Expert
          op1 = this.randomInt(35, 99);
          op2 = this.randomInt(25, 95);
        }
        answer = op1 * op2;
        display = `${op1} × ${op2}`;
        break;

      case 'division':
        symbol = '÷';
        if (effectiveDifficulty === 'beginner') {
          op2 = this.randomInt(2, 10);
          answer = this.randomInt(2, 12);
          op1 = op2 * answer;
        } else if (effectiveDifficulty === 'intermediate') {
          op2 = this.randomInt(4, 16);
          answer = this.randomInt(8, 30);
          op1 = op2 * answer;
        } else if (effectiveDifficulty === 'advanced') {
          op2 = this.randomInt(12, 28);
          answer = this.randomInt(15, 65);
          op1 = op2 * answer;
        } else {
          // Expert
          op2 = this.randomInt(18, 48);
          answer = this.randomInt(35, 120);
          op1 = op2 * answer;
        }
        display = `${op1} ÷ ${op2}`;
        break;

      case 'powers_roots':
        if (Math.random() > 0.45) {
          // Squares
          symbol = '²';
          if (effectiveDifficulty === 'beginner') {
            op1 = this.randomInt(2, 15);
          } else if (effectiveDifficulty === 'intermediate') {
            op1 = this.randomInt(12, 25);
          } else if (effectiveDifficulty === 'advanced') {
            op1 = this.randomInt(21, 45);
          } else {
            op1 = this.randomInt(35, 75);
          }
          op2 = 2;
          answer = op1 * op1;
          display = `${op1}²`;
        } else {
          // Square Roots
          symbol = '√';
          const root = effectiveDifficulty === 'beginner' 
            ? this.randomInt(3, 15) 
            : effectiveDifficulty === 'intermediate' 
              ? this.randomInt(12, 25) 
              : this.randomInt(20, 45);
          op1 = root * root;
          op2 = 0;
          answer = root;
          display = `√${op1}`;
        }
        break;

      case 'percentages':
        symbol = '%';
        const percentPool = effectiveDifficulty === 'beginner'
          ? [10, 20, 25, 50]
          : effectiveDifficulty === 'intermediate'
            ? [5, 15, 20, 25, 30, 40, 50, 75]
            : [12, 15, 18, 24, 35, 45, 65, 85, 120];
        
        const pct = percentPool[Math.floor(Math.random() * percentPool.length)];
        const baseMultiplier = effectiveDifficulty === 'beginner' ? 10 : (effectiveDifficulty === 'intermediate' ? 20 : 50);
        const baseNum = this.randomInt(2, 25) * baseMultiplier;
        
        op1 = pct;
        op2 = baseNum;
        answer = Math.round((pct / 100) * baseNum);
        display = `${pct}% of ${baseNum}`;
        break;

      case 'advance_calc':
        symbol = '( )';
        const patternType = this.randomInt(1, 3);
        if (patternType === 1) {
          // (a * b) + c
          const a = this.randomInt(3, 15);
          const b = this.randomInt(4, 12);
          const c = this.randomInt(10, 60);
          answer = (a * b) + c;
          display = `(${a} × ${b}) + ${c}`;
          op1 = a * b;
          op2 = c;
        } else if (patternType === 2) {
          // (a - b) * c
          const a = this.randomInt(25, 80);
          const b = this.randomInt(5, a - 10);
          const c = this.randomInt(2, 8);
          answer = (a - b) * c;
          display = `(${a} − ${b}) × ${c}`;
          op1 = a - b;
          op2 = c;
        } else {
          // a² + b
          const a = this.randomInt(5, 25);
          const b = this.randomInt(12, 50);
          answer = (a * a) + b;
          display = `(${a}²) + ${b}`;
          op1 = a * a;
          op2 = b;
        }
        break;

      case 'linear_sequence':
        symbol = '□-□';
        const seqType = this.randomInt(1, 3);
        if (seqType === 1) {
          // Arithmetic Progression: a, a+d, a+2d, a+3d, ?
          const start = this.randomInt(2, 20);
          const diff = this.randomInt(3, 12);
          const s1 = start;
          const s2 = start + diff;
          const s3 = start + diff * 2;
          const s4 = start + diff * 3;
          answer = start + diff * 4;
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = diff;
        } else if (seqType === 2) {
          // Geometric Progression (scaled): a, a*r, a*r^2, a*r^3, ?
          const start = this.randomInt(1, 5);
          const ratio = this.randomInt(2, 3);
          const s1 = start;
          const s2 = start * ratio;
          const s3 = s2 * ratio;
          const s4 = s3 * ratio;
          answer = s4 * ratio;
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = ratio;
        } else {
          // Squared Sequence: n^2 + c
          const baseOffset = this.randomInt(1, 5);
          const s1 = (baseOffset + 1) * (baseOffset + 1);
          const s2 = (baseOffset + 2) * (baseOffset + 2);
          const s3 = (baseOffset + 3) * (baseOffset + 3);
          const s4 = (baseOffset + 4) * (baseOffset + 4);
          answer = (baseOffset + 5) * (baseOffset + 5);
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = 5;
        }
        break;

      case 'right_or_wrong':
        symbol = '✓✗';
        const isActuallyTrue = Math.random() > 0.5;
        const rwA = this.randomInt(6, 25);
        const rwB = this.randomInt(3, 15);
        const trueResult = rwA * rwB;
        const shownResult = isActuallyTrue ? trueResult : trueResult + (Math.random() > 0.5 ? this.randomInt(1, 5) : -this.randomInt(1, 5));
        
        display = `${rwA} × ${rwB} = ${shownResult} ?`;
        answer = isActuallyTrue ? 1 : 0; // 1 = Right, 0 = Wrong
        op1 = rwA;
        op2 = rwB;
        break;

      case 'math_puzzle':
        symbol = '⊞';
        const puzzleA = this.randomInt(4, 16);
        const puzzleB = this.randomInt(3, 12);
        const puzzleProd = puzzleA * puzzleB;
        
        const hideFirst = Math.random() > 0.5;
        if (hideFirst) {
          display = `? × ${puzzleB} = ${puzzleProd}`;
          answer = puzzleA;
        } else {
          display = `${puzzleA} × ? = ${puzzleProd}`;
          answer = puzzleB;
        }
        op1 = puzzleProd;
        op2 = hideFirst ? puzzleB : puzzleA;
        break;
    }

    let options: number[];
    if (resolvedOp === 'right_or_wrong') {
      options = [1, 0]; // 1 = Right/True, 0 = Wrong/False
    } else {
      options = this.generateOptions(answer, resolvedOp, effectiveDifficulty);
    }

    return {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      displayExpression: display,
      operand1: op1,
      operand2: op2,
      operator: symbol,
      correctAnswer: answer,
      options,
      difficulty: effectiveDifficulty,
    };
  }

  /**
   * Creates 4 distinct believable multiple choice options (including correct answer)
   */
  private static generateOptions(correctAnswer: number, operation: MathOperation, difficulty: DifficultyLevel): number[] {
    const optionsSet = new Set<number>();
    optionsSet.add(correctAnswer);

    // Delta candidates based on magnitude
    const magnitude = Math.max(Math.abs(correctAnswer), 10);
    const step = magnitude > 500 ? 10 : (magnitude > 100 ? 5 : (magnitude > 30 ? 2 : 1));

    const offsetPool = [
      step,
      -step,
      step * 2,
      -step * 2,
      1,
      -1,
      10,
      -10,
      100,
      -100,
    ];

    let attempts = 0;
    while (optionsSet.size < 4 && attempts < 40) {
      attempts++;
      const randOffset = offsetPool[Math.floor(Math.random() * offsetPool.length)];
      const candidate = correctAnswer + randOffset;
      if (candidate > 0 && candidate !== correctAnswer) {
        optionsSet.add(candidate);
      }
    }

    // Fallback if set still smaller than 4
    let fallbackOffset = 3;
    while (optionsSet.size < 4) {
      const cand = correctAnswer + fallbackOffset;
      if (cand > 0) optionsSet.add(cand);
      fallbackOffset = fallbackOffset > 0 ? -fallbackOffset - 1 : Math.abs(fallbackOffset) + 2;
    }

    // Shuffle options
    const arr = Array.from(optionsSet);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
