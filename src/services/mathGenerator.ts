import { DifficultyLevel, MathOperation, MathQuestion } from '../types';

export class MathGenerator {
  /**
   * Generates an adaptive speed math question or math puzzle with 4 intelligent multiple choice options
   * Supports 1,000+ unique algorithmic permutations per section (Addition, Subtraction, Multiplication, Division, Puzzles)
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
      const ops: MathOperation[] = [
        'addition',
        'subtraction',
        'multiplication',
        'division',
        'powers_roots',
        'percentages',
        'math_puzzle',
        'linear_sequence',
      ];
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
        const addVariant = this.randomInt(1, 4);
        if (addVariant === 1) {
          // Standard 2-operand addition
          if (effectiveDifficulty === 'beginner') {
            op1 = this.randomInt(5, 50);
            op2 = this.randomInt(5, 50);
          } else if (effectiveDifficulty === 'intermediate') {
            op1 = this.randomInt(35, 299);
            op2 = this.randomInt(25, 299);
          } else if (effectiveDifficulty === 'advanced') {
            op1 = this.randomInt(250, 2500);
            op2 = this.randomInt(180, 2500);
          } else {
            op1 = this.randomInt(2500, 19999);
            op2 = this.randomInt(1500, 19999);
          }
          answer = op1 + op2;
          display = `${op1} + ${op2}`;
        } else if (addVariant === 2) {
          // 3-term rapid addition
          const a = this.randomInt(10, 45);
          const b = this.randomInt(10, 45);
          const c = this.randomInt(5, 30);
          answer = a + b + c;
          display = `${a} + ${b} + ${c}`;
          op1 = a + b;
          op2 = c;
        } else if (addVariant === 3) {
          // Decimal addition sprint (x.5 or x.25)
          const baseA = this.randomInt(10, 80);
          const baseB = this.randomInt(5, 60);
          const decA = (baseA + 0.5);
          const decB = (baseB + 0.5);
          answer = Math.round(decA + decB);
          display = `${decA} + ${decB}`;
          op1 = Math.round(decA * 10);
          op2 = Math.round(decB * 10);
        } else {
          // Vedic Nikhilam addition near base (e.g. 98 + 47 or 195 + 86)
          const baseNear = [98, 99, 195, 198, 296, 495][this.randomInt(0, 5)];
          const addVal = this.randomInt(15, 85);
          answer = baseNear + addVal;
          display = `${baseNear} + ${addVal}`;
          op1 = baseNear;
          op2 = addVal;
        }
        break;

      case 'subtraction':
        symbol = '−';
        const subVariant = this.randomInt(1, 3);
        if (subVariant === 1) {
          // Standard Subtraction
          if (effectiveDifficulty === 'beginner') {
            op1 = this.randomInt(12, 60);
            op2 = this.randomInt(3, op1 - 2);
          } else if (effectiveDifficulty === 'intermediate') {
            op1 = this.randomInt(55, 350);
            op2 = this.randomInt(18, op1 - 10);
          } else if (effectiveDifficulty === 'advanced') {
            op1 = this.randomInt(450, 3200);
            op2 = this.randomInt(120, op1 - 50);
          } else {
            op1 = this.randomInt(3500, 24000);
            op2 = this.randomInt(800, op1 - 200);
          }
          answer = op1 - op2;
          display = `${op1} − ${op2}`;
        } else if (subVariant === 2) {
          // Vedic All from 9 and last from 10 (Subtraction from 1000, 10000)
          const basePower = [100, 500, 1000, 2000, 5000, 10000][this.randomInt(0, 5)];
          const subAmount = this.randomInt(15, basePower - 10);
          answer = basePower - subAmount;
          display = `${basePower} − ${subAmount}`;
          op1 = basePower;
          op2 = subAmount;
        } else {
          // 3-term subtraction chain (A - B - C)
          const startVal = this.randomInt(70, 200);
          const b = this.randomInt(10, 40);
          const c = this.randomInt(5, 30);
          answer = startVal - b - c;
          display = `${startVal} − ${b} − ${c}`;
          op1 = startVal - b;
          op2 = c;
        }
        break;

      case 'multiplication':
        symbol = '×';
        const mulVariant = this.randomInt(1, 4);
        if (mulVariant === 1) {
          // Standard Grid & Vedic criss-cross
          if (effectiveDifficulty === 'beginner') {
            op1 = this.randomInt(3, 14);
            op2 = this.randomInt(3, 14);
          } else if (effectiveDifficulty === 'intermediate') {
            op1 = this.randomInt(12, 35);
            op2 = this.randomInt(4, 18);
          } else if (effectiveDifficulty === 'advanced') {
            op1 = this.randomInt(24, 75);
            op2 = this.randomInt(14, 45);
          } else {
            op1 = this.randomInt(45, 125);
            op2 = this.randomInt(35, 99);
          }
          answer = op1 * op2;
          display = `${op1} × ${op2}`;
        } else if (mulVariant === 2) {
          // Base 100 Vedic multiplication (e.g. 96 × 94 or 104 × 108)
          const isBelow = Math.random() > 0.5;
          const a = isBelow ? 100 - this.randomInt(2, 12) : 100 + this.randomInt(2, 15);
          const b = isBelow ? 100 - this.randomInt(2, 12) : 100 + this.randomInt(2, 15);
          answer = a * b;
          display = `${a} × ${b}`;
          op1 = a;
          op2 = b;
        } else if (mulVariant === 3) {
          // Squaring numbers ending in 5 (Ekadhikena Purvena)
          const tens = this.randomInt(1, 14);
          const end5 = tens * 10 + 5;
          answer = end5 * end5;
          display = `${end5}²`;
          op1 = end5;
          op2 = end5;
        } else {
          // Multiply by 11 or 15 shortcut
          const multi = Math.random() > 0.5 ? 11 : 15;
          const target = this.randomInt(14, 85);
          answer = target * multi;
          display = `${target} × ${multi}`;
          op1 = target;
          op2 = multi;
        }
        break;

      case 'division':
        symbol = '÷';
        const divVariant = this.randomInt(1, 3);
        if (divVariant === 1) {
          // Clean division sprint
          if (effectiveDifficulty === 'beginner') {
            op2 = this.randomInt(2, 12);
            answer = this.randomInt(3, 15);
            op1 = op2 * answer;
          } else if (effectiveDifficulty === 'intermediate') {
            op2 = this.randomInt(5, 20);
            answer = this.randomInt(12, 45);
            op1 = op2 * answer;
          } else if (effectiveDifficulty === 'advanced') {
            op2 = this.randomInt(14, 42);
            answer = this.randomInt(25, 95);
            op1 = op2 * answer;
          } else {
            op2 = this.randomInt(22, 65);
            answer = this.randomInt(45, 180);
            op1 = op2 * answer;
          }
          display = `${op1} ÷ ${op2}`;
        } else if (divVariant === 2) {
          // Division by 5, 25 shortcut
          const divBase = Math.random() > 0.5 ? 5 : 25;
          answer = this.randomInt(14, 120);
          op1 = answer * divBase;
          op2 = divBase;
          display = `${op1} ÷ ${divBase}`;
        } else {
          // Remainder Challenge (e.g. 147 mod 8 = ?)
          const divisor = this.randomInt(4, 15);
          const quotient = this.randomInt(10, 30);
          const rem = this.randomInt(1, divisor - 1);
          const totalVal = quotient * divisor + rem;
          answer = rem;
          display = `Remainder: ${totalVal} ÷ ${divisor}`;
          op1 = totalVal;
          op2 = divisor;
        }
        break;

      case 'powers_roots':
        if (Math.random() > 0.45) {
          symbol = '²';
          if (effectiveDifficulty === 'beginner') {
            op1 = this.randomInt(3, 16);
          } else if (effectiveDifficulty === 'intermediate') {
            op1 = this.randomInt(14, 32);
          } else if (effectiveDifficulty === 'advanced') {
            op1 = this.randomInt(28, 65);
          } else {
            op1 = this.randomInt(50, 110);
          }
          op2 = 2;
          answer = op1 * op1;
          display = `${op1}²`;
        } else {
          symbol = '√';
          const root = effectiveDifficulty === 'beginner' 
            ? this.randomInt(4, 18) 
            : effectiveDifficulty === 'intermediate' 
              ? this.randomInt(15, 35) 
              : this.randomInt(25, 60);
          op1 = root * root;
          op2 = 0;
          answer = root;
          display = `√${op1}`;
        }
        break;

      case 'percentages':
        symbol = '%';
        const percentPool = effectiveDifficulty === 'beginner'
          ? [10, 20, 25, 50, 100]
          : effectiveDifficulty === 'intermediate'
            ? [5, 12, 15, 20, 25, 30, 40, 50, 60, 75]
            : [8, 12.5, 15, 16.66, 24, 33.33, 37.5, 45, 65, 85, 120];
        
        const pct = percentPool[Math.floor(Math.random() * percentPool.length)];
        const baseNum = this.randomInt(2, 30) * (typeof pct === 'number' && pct % 1 === 0 ? 20 : 60);
        
        op1 = Number(pct);
        op2 = baseNum;
        answer = Math.round((Number(pct) / 100) * baseNum);
        display = `${pct}% of ${baseNum}`;
        break;

      case 'advance_calc':
        symbol = '( )';
        const patternType = this.randomInt(1, 4);
        if (patternType === 1) {
          // (a * b) + c
          const a = this.randomInt(4, 18);
          const b = this.randomInt(4, 15);
          const c = this.randomInt(10, 80);
          answer = (a * b) + c;
          display = `(${a} × ${b}) + ${c}`;
          op1 = a * b;
          op2 = c;
        } else if (patternType === 2) {
          // (a - b) * c
          const a = this.randomInt(30, 95);
          const b = this.randomInt(5, a - 12);
          const c = this.randomInt(3, 9);
          answer = (a - b) * c;
          display = `(${a} − ${b}) × ${c}`;
          op1 = a - b;
          op2 = c;
        } else if (patternType === 3) {
          // (a * b) - (c * d)
          const a = this.randomInt(6, 15);
          const b = this.randomInt(5, 12);
          const c = this.randomInt(3, 8);
          const d = this.randomInt(2, 6);
          answer = (a * b) - (c * d);
          display = `(${a} × ${b}) − (${c} × ${d})`;
          op1 = a * b;
          op2 = c * d;
        } else {
          // a² + b²
          const a = this.randomInt(6, 18);
          const b = this.randomInt(4, 15);
          answer = (a * a) + (b * b);
          display = `${a}² + ${b}²`;
          op1 = a * a;
          op2 = b * b;
        }
        break;

      case 'linear_sequence':
        symbol = '□-□';
        const seqType = this.randomInt(1, 4);
        if (seqType === 1) {
          // Arithmetic Progression: a, a+d, a+2d, a+3d, ?
          const start = this.randomInt(3, 30);
          const diff = this.randomInt(4, 18);
          const s1 = start;
          const s2 = start + diff;
          const s3 = start + diff * 2;
          const s4 = start + diff * 3;
          answer = start + diff * 4;
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = diff;
        } else if (seqType === 2) {
          // Geometric Progression: a, a*r, a*r^2, a*r^3, ?
          const start = this.randomInt(2, 6);
          const ratio = this.randomInt(2, 3);
          const s1 = start;
          const s2 = start * ratio;
          const s3 = s2 * ratio;
          const s4 = s3 * ratio;
          answer = s4 * ratio;
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = ratio;
        } else if (seqType === 3) {
          // Squared Sequence: (n+k)^2
          const baseOffset = this.randomInt(2, 8);
          const s1 = (baseOffset + 1) * (baseOffset + 1);
          const s2 = (baseOffset + 2) * (baseOffset + 2);
          const s3 = (baseOffset + 3) * (baseOffset + 3);
          const s4 = (baseOffset + 4) * (baseOffset + 4);
          answer = (baseOffset + 5) * (baseOffset + 5);
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = 5;
        } else {
          // Difference of Differences Series: +2, +4, +6, +8
          const start = this.randomInt(5, 20);
          const s1 = start;
          const s2 = s1 + 3;
          const s3 = s2 + 6;
          const s4 = s3 + 9;
          answer = s4 + 12;
          display = `${s1}, ${s2}, ${s3}, ${s4}, ?`;
          op1 = s4;
          op2 = 12;
        }
        break;

      case 'right_or_wrong':
        symbol = '✓✗';
        const isActuallyTrue = Math.random() > 0.5;
        const rwA = this.randomInt(8, 30);
        const rwB = this.randomInt(4, 18);
        const trueResult = rwA * rwB;
        const shownResult = isActuallyTrue ? trueResult : trueResult + (Math.random() > 0.5 ? this.randomInt(2, 8) : -this.randomInt(2, 8));
        
        display = `${rwA} × ${rwB} = ${shownResult} ?`;
        answer = isActuallyTrue ? 1 : 0; // 1 = Right, 0 = Wrong
        op1 = rwA;
        op2 = rwB;
        break;

      case 'math_puzzle':
        symbol = '⊞';
        const puzzleType = this.randomInt(1, 4);
        if (puzzleType === 1) {
          // Missing multiplication factor: ? × B = Prod
          const puzzleA = this.randomInt(6, 25);
          const puzzleB = this.randomInt(4, 18);
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
        } else if (puzzleType === 2) {
          // Missing Divisor / Dividend: (? ÷ B) + C = Result
          const dAnswer = this.randomInt(5, 20);
          const divisor = this.randomInt(3, 8);
          const dividend = dAnswer * divisor;
          const addOn = this.randomInt(4, 15);
          const totalRes = dAnswer + addOn;
          display = `(? ÷ ${divisor}) + ${addOn} = ${totalRes}`;
          answer = dividend;
          op1 = totalRes;
          op2 = divisor;
        } else if (puzzleType === 3) {
          // Missing Operator Puzzle: 15 [?] 4 = 60 -> What is [?]
          // Represented by solving for the missing numerical offset: (A + ?) × B = C
          const bVal = this.randomInt(3, 8);
          const targetOffset = this.randomInt(4, 18);
          const aVal = this.randomInt(10, 30);
          const sumVal = aVal + targetOffset;
          const finalResult = sumVal * bVal;
          display = `(${aVal} + ?) × ${bVal} = ${finalResult}`;
          answer = targetOffset;
          op1 = finalResult;
          op2 = bVal;
        } else {
          // Number Matrix / Balance Puzzle: A + B = C + ?
          const leftA = this.randomInt(25, 90);
          const leftB = this.randomInt(15, 60);
          const sumTotal = leftA + leftB;
          const rightC = this.randomInt(10, sumTotal - 10);
          answer = sumTotal - rightC;
          display = `${leftA} + ${leftB} = ${rightC} + ?`;
          op1 = sumTotal;
          op2 = rightC;
        }
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
