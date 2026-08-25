import { AptitudeCategory, TopicConceptGuide } from '../types';

export const APTITUDE_CATEGORIES: AptitudeCategory[] = [
  {
    id: 'number-system',
    name: 'Number System',
    shortName: 'Number System',
    iconName: 'Binary',
    description: 'Divisibility rules, unit digit cyclicity, remainder theorems, prime factorization & base systems',
    color: 'from-amber-500 to-orange-600',
    subtopics: ['Unit Digit & Cyclicity', 'Divisibility Rules', 'Remainder Theorem', 'Number of Factors & Zeros', 'Base Systems'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'simplification-bodmas',
    name: 'Simplification, Approximation & BODMAS',
    shortName: 'Simplification',
    iconName: 'Calculator',
    description: 'VBODMAS hierarchy, decimal estimation, algebraic identities, nested roots & mental approximation',
    color: 'from-blue-500 to-indigo-600',
    subtopics: ['VBODMAS Rule', 'Approximation & Estimation', 'Algebraic Identities', 'Square & Cube Root Tricks', 'Nested Fractions'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'hcf-lcm',
    name: 'HCF and LCM',
    shortName: 'HCF & LCM',
    iconName: 'Split',
    description: 'Prime factor method, division method, bells tolling simultaneously, circular race meeting points & remainders',
    color: 'from-emerald-500 to-teal-600',
    subtopics: ['HCF & LCM of Fractions', 'Bells / Traffic Lights', 'Remainder Conditions', 'Product Rule: HCF × LCM = A × B', 'Co-primes'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'fractions-surds-indices',
    name: 'Fractions, Decimals, Surds & Indices',
    shortName: 'Surds & Indices',
    iconName: 'Superscript',
    description: 'Laws of indices, comparing infinite nested surds, rationalizing denominators & recurring decimals',
    color: 'from-purple-500 to-violet-600',
    subtopics: ['Laws of Exponents', 'Surds Comparison', 'Infinite Nested Radicals', 'Rationalization', 'Recurring Decimals to Fractions'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'ratio-proportion-variation',
    name: 'Ratio, Proportion, Variation & Unitary Method',
    shortName: 'Ratio & Variation',
    iconName: 'Scale',
    description: 'Compounded ratios, mean proportional, direct & inverse variation, coin distribution & unitary scaling',
    color: 'from-cyan-500 to-blue-600',
    subtopics: ['Direct & Inverse Variation', 'Mean & Third Proportional', 'Coin Problem Models', 'Income-Expenditure Ratios', 'Unitary Multipliers'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'percentage-successive',
    name: 'Percentage & Successive Percentage',
    shortName: 'Percentages',
    iconName: 'Percent',
    description: 'Fraction-percentage equivalents, successive changes (a + b + ab/100), price-consumption-expenditure & election votes',
    color: 'from-sky-500 to-cyan-600',
    subtopics: ['Fraction Equivalents', 'Successive Percentage Formula', 'Price & Consumption Invariance', 'Population Growth', 'Election Vote Models'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'average',
    name: 'Average',
    shortName: 'Average',
    iconName: 'Sigma',
    description: 'Weighted averages, assumed mean deviation technique, batsman & bowler cricket metrics & replacement balance',
    color: 'from-emerald-600 to-green-500',
    subtopics: ['Deviation Method', 'Cricket Batting & Bowling Average', 'Replacement & Inclusion', 'Weighted Average Formula', 'Consecutive Series Average'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'profit-loss-discount',
    name: 'Profit, Loss, Discount & Marked Price',
    shortName: 'Profit & Loss',
    iconName: 'TrendingUp',
    description: 'Cost price, markup percentage, successive discounts, dishonest shopkeeper false weight cheats & break-even points',
    color: 'from-lime-500 to-emerald-600',
    subtopics: ['Marked Price & Discounts', 'Successive Discount Equivalents', 'Dishonest Dealer Weight Fraud', 'CP/SP Ratio Rules', 'Buy X Get Y Free'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'simple-compound-interest',
    name: 'Simple & Compound Interest',
    shortName: 'SI & CI',
    iconName: 'Coins',
    description: 'Annual vs semi-annual compounding, CI - SI delta formulas for 2 & 3 years, equal installment schemes & doubling rules',
    color: 'from-amber-600 to-yellow-500',
    subtopics: ['SI = PRT / 100', 'Compounding Multiplier', 'CI - SI Difference for 2 & 3 Years', 'Rule of 72', 'Equal Loan Installments'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'partnership',
    name: 'Partnership',
    shortName: 'Partnership',
    iconName: 'Users',
    description: 'Capital × Time investment ratio, active working partners vs sleeping partners, salary deductions & profit splits',
    color: 'from-violet-500 to-purple-600',
    subtopics: ['Investment × Time Ratio', 'Active vs Sleeping Partners', 'Manager Salary Deduction', 'Varying Capital Withdrawals', 'Loss Allocation'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'mixture-alligation',
    name: 'Mixture and Alligation',
    shortName: 'Alligations',
    iconName: 'FlaskConical',
    description: 'Rule of alligation cross method, mean price blending, repeated liquid withdrawal/replacement formula & 3-component blends',
    color: 'from-fuchsia-500 to-rose-600',
    subtopics: ['Alligation Cross Method', 'Repeated Dilution Formula x(1 - y/x)^n', 'Milk-Water Concentration', 'Price Blending', 'Multi-Vessel Transfers'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'time-work-pipes',
    name: 'Time and Work; Pipes and Cisterns',
    shortName: 'Time & Work',
    iconName: 'Clock',
    description: 'Total work LCM method, efficiency ratios, alternate day cycles, negative work leaks & wages sharing based on work done',
    color: 'from-blue-600 to-sky-500',
    subtopics: ['Total Work LCM Method', 'Efficiency Ratios', 'Alternate Day Cycles', 'Pipes & Leakages', 'Man-Days-Hours Formula (M1D1H1 = M2D2H2)'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'speed-distance-trains-boats',
    name: 'Speed, Time and Distance; Trains; Boats and Streams',
    shortName: 'Speed & Distance',
    iconName: 'Gauge',
    description: 'Relative velocity, train crossings (poles, platforms, moving trains), upstream/downstream flow & harmonic average speed',
    color: 'from-rose-500 to-red-600',
    subtopics: ['Relative Speed in Same/Opposite Directions', 'Train Crossing Objects & Platforms', 'Upstream (u-v) & Downstream (u+v)', 'Average Speed 2xy/(x+y)', 'Circular Races'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'ages',
    name: 'Ages',
    shortName: 'Problems on Ages',
    iconName: 'CalendarCheck',
    description: 'Constant age difference invariance, past-present-future ratio scaling & family generational average age shifts',
    color: 'from-teal-500 to-cyan-600',
    subtopics: ['Age Difference Invariance', 'Ratio Normalization Across Time', 'Father-Son / Mother-Daughter Models', 'Average Age of Family After Birth/Death', 'Linear Age System'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'clocks-calendars',
    name: 'Clocks and Calendars',
    shortName: 'Clocks & Calendars',
    iconName: 'Watch',
    description: 'Angle between clock hands |30H - 5.5M|, hands overlapping/right angle/opposite, leap year rules & day of week odd days',
    color: 'from-indigo-500 to-blue-600',
    subtopics: ['Angle Formula |30H - 11/2 M|', 'Clock Overlapping & Right Angles', 'Slow / Fast Clock Errors', 'Odd Days in Century & Years', 'Calendar Day Determination'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'mensuration',
    name: 'Mensuration',
    shortName: 'Mensuration',
    iconName: 'Box',
    description: '2D area & perimeter of circles, sectors, triangles, rhombuses; 3D volume, curved & total surface area of cylinders, cones, spheres & prisms',
    color: 'from-emerald-500 to-teal-700',
    subtopics: ['2D Polygons, Circles & Sectors', 'Cylinder, Cone & Sphere Surface/Volume', 'Frustum & Prisms', 'Melting & Recasting 3D Solids', 'Pathways & Inscribed Circles'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'data-interpretation',
    name: 'Data Interpretation',
    shortName: 'Data Interpretation',
    iconName: 'BarChart3',
    description: 'Bar charts, pie charts (degrees vs percentage conversions), line graphs, radar charts, tabular DI & missing data sets',
    color: 'from-purple-600 to-indigo-700',
    subtopics: ['Pie Charts (360° = 100%)', 'Bar Charts & Compound Bars', 'Line Graphs & Growth Trends', 'Tabular DI with Missing Values', 'Caselet DI (Paragraph Parsing)'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'probability-permutation-combination',
    name: 'Basic Probability, Permutation and Combination',
    shortName: 'Probability & PnC',
    iconName: 'Dices',
    description: 'Factorials, nPr arrangements with repetitions, nCr selections, cards, dice, urns & independent/mutually exclusive probabilities',
    color: 'from-orange-500 to-amber-600',
    subtopics: ['Arrangements with Repetitions', 'Circular Permutations (n-1)!', 'Selection Groups nCr', 'Card & Dice Probability Models', 'At Least / At Most Probability Rules'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'quadratic-linear-equations',
    name: 'Quadratic and Linear Equations',
    shortName: 'Equations & Roots',
    iconName: 'Variable',
    description: 'Roots of ax² + bx + c = 0, instant root sign shortcut (+/- patterns), root comparison (x > y, x < y, CND) & simultaneous linear equations',
    color: 'from-rose-600 to-pink-600',
    subtopics: ['Instant Sign Trick for Root Signs', 'Root Comparison (x vs y Relationship)', 'Discriminant Nature of Roots (b² - 4ac)', 'Sum & Product of Roots (-b/a, c/a)', 'Simultaneous Linear Equations'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
  {
    id: 'tables-graphs-quantity-comparison',
    name: 'Tables, Graphs, and Quantity Comparison',
    shortName: 'Quantity Comparison',
    iconName: 'GitCompare',
    description: 'Quantity I vs Quantity II comparison (Bank PO & CAT format), data sufficiency, multi-table cross-verification & logical bounds',
    color: 'from-blue-500 to-violet-600',
    subtopics: ['Quantity I vs Quantity II Analysis', 'Data Sufficiency (Statement I & II)', 'Multi-Table Cross-Referencing', 'Logical Bound Estimation', 'Critical Arithmetic Comparison'],
    totalQuestions: 26,
    difficultyDistribution: { easy: 8, medium: 10, hard: 8 },
  },
];

export const TOPIC_CONCEPT_GUIDES: Record<string, TopicConceptGuide> = {
  'number-system': {
    categoryId: 'number-system',
    topicName: 'Number System',
    overview: 'The bedrock of quantitative aptitude. Exam problems test rapid identification of remainders, unit digit cyclicity, divisibility rules (primes and composite numbers), factor counts, and trailing zero calculations.',
    keyFormulas: [
      {
        name: 'Unit Digit Cyclicity Theorem',
        formula: 'Cyclicity of (2,3,7,8) = 4; Cyclicity of (4,9) = 2; Cyclicity of (0,1,5,6) = 1',
        description: 'For finding unit digit of a^b: Divide power b by cyclicity 4. If remainder is r (1,2,3), unit digit is a^r. If r = 0, unit digit is a^4.',
        example: 'Unit digit of 7^95: 95 mod 4 = 3 -> 7^3 = 343 -> Unit digit is 3.'
      },
      {
        name: 'Number of Factors & Sum of Factors',
        formula: 'If N = p^a * q^b * r^c (p,q,r primes), Total Factors = (a+1)(b+1)(c+1)',
        description: 'Sum of factors = (p^(a+1)-1)/(p-1) * (q^(b+1)-1)/(q-1) * (r^(c+1)-1)/(r-1). Number of even/odd factors obtained by isolating factor of 2.',
        example: 'N = 72 = 2^3 * 3^2 -> Total factors = (3+1)(2+1) = 12.'
      },
      {
        name: 'Number of Trailing Zeros in N!',
        formula: 'Trailing Zeros = floor(N/5) + floor(N/25) + floor(N/125) + ...',
        description: 'Count highest power of 5 in N! because powers of 2 always exceed powers of 5.',
        example: 'In 100!: floor(100/5) + floor(100/25) = 20 + 4 = 24 zeros.'
      },
      {
        name: 'Remainder Theorem (Euler & Fermat)',
        formula: 'Fermat: If p is prime and gcd(a,p)=1, a^(p-1) mod p = 1',
        description: 'Euler Totient: a^phi(n) mod n = 1 where phi(n) = n * prod(1 - 1/p) for each distinct prime factor p.',
        example: '2^100 mod 101 = 1 because 101 is prime and gcd(2,101) = 1.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Divisibility Rule for 7, 11, and 13 (Cluster of 1001)',
        technique: 'Split number into 3-digit blocks from right to left, alternating subtraction and addition. If the result is divisible by 7, 11, or 13, the entire number is divisible by that prime.',
        speedAdvantage: 'Instantly tests large 6-9 digit numbers without long division.'
      },
      {
        title: 'Vedic Digital Root (Beejank)',
        technique: 'Sum digits repeatedly until single digit 1-9 is obtained. Modulo 9 arithmetic checks arithmetic sanity in 2 seconds.',
        speedAdvantage: 'Eliminate wrong options in 3 seconds before calculating full result.'
      }
    ],
    commonTraps: [
      'Forgetting that 1 is neither prime nor composite, and 2 is the only even prime.',
      'In a^b where power b is exact multiple of 4, taking remainder as 0 instead of 4th power.',
      'Overlooking negative remainders: remainder -1 mod 7 is equal to +6.'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions (Unit digits, basic divisibility, trailing zeros)',
      mainsWeightage: '3 to 4 Questions (Chinese Remainder Theorem, complex factorials, algebraic roots)',
      recommendedTimePerQuestion: '25-40 seconds in Prelims, 60-80 seconds in Mains'
    }
  },
  'simplification-bodmas': {
    categoryId: 'simplification-bodmas',
    topicName: 'Simplification, Approximation & BODMAS',
    overview: 'Speed and accuracy under tight time constraints. Focus on the strict operator order: Vinculum (Bar) -> Brackets -> Of (Multiplication) -> Division -> Multiplication -> Addition -> Subtraction.',
    keyFormulas: [
      {
        name: 'VBODMAS Strict Precedence',
        formula: 'V (Vinculum / Bar) > B (Brackets: (), {}, []) > O (Of) > D (/) > M (*) > A (+) > S (-)',
        description: '"Of" operations have higher precedence than division and must be executed before dividing.',
        example: '24 / 4 of 2 = 24 / 8 = 3 (NOT (24/4)*2 = 12).'
      },
      {
        name: 'Core Algebraic Identities for Simplification',
        formula: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2) | a^3 + b^3 + c^3 - 3abc = (a+b+c)(a^2+b^2+c^2 - ab - bc - ca)',
        description: 'When numerator contains (a^3 + b^3) and denominator is (a^2 - ab + b^2), answer simplifies directly to (a + b).',
        example: '(0.7^3 + 0.3^3)/(0.7^2 - 0.21 + 0.3^2) = 0.7 + 0.3 = 1.'
      },
      {
        name: 'Approximation Golden Rule',
        formula: 'Round numbers to 1 decimal place or nearest 5/10 when options are spaced >= 5% apart.',
        description: 'Look at the dispersion among options. If options are far apart, round aggressive numbers (e.g., 49.89% of 799.9 -> 50% of 800 = 400).',
        example: 'Sqrt(2502) / 4.99 * 19.98 ~ 50 / 5 * 20 = 200.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Duplex Method for Instant Square Roots',
        technique: 'Find base square from nearest perfect square, then delta / (2 * base).',
        speedAdvantage: 'Gives square root accurate to 2 decimals within 5 seconds.'
      },
      {
        title: 'Multiplication by Base 100 / 1000 (Nikhilam Navatashcaramam)',
        technique: 'For 97 * 94: Deficits are (-3) and (-6). Cross subtract: 97 - 6 = 91. Product of deficits: (-3)*(-6) = 18. Result = 9118.',
        speedAdvantage: 'Solves 2-3 digit multiplications mentally in 3 seconds.'
      }
    ],
    commonTraps: [
      'Executing Division before "Of" in expressions like 60 / 5 of 3.',
      'Misapplying negative sign across parentheses in nested brackets.',
      'Rounding numbers too aggressively when answer choices differ by less than 1%.'
    ],
    examTrends: {
      prelimsWeightage: '5 to 10 Questions (Bank PO/Clerk prelims hallmark scoring section)',
      mainsWeightage: '2 to 3 Questions (High-power nested surds and algebraic approximations)',
      recommendedTimePerQuestion: '15-25 seconds in Prelims'
    }
  },
  'hcf-lcm': {
    categoryId: 'hcf-lcm',
    topicName: 'HCF and LCM',
    overview: 'Highest Common Factor and Least Common Multiple underpin time-work schedules, traffic lights synchronization, circular tracks, and fractional reductions.',
    keyFormulas: [
      {
        name: 'Product of Two Numbers Formula',
        formula: 'Product of Two Numbers = HCF × LCM',
        description: 'Only valid for exactly two numbers (A × B = HCF(A,B) × LCM(A,B)). Does NOT hold directly for 3+ numbers.',
        example: 'If HCF = 12, LCM = 360, and one number is 72, second number = (12 * 360) / 72 = 60.'
      },
      {
        name: 'HCF & LCM of Fractions',
        formula: 'HCF(Fractions) = HCF(Numerators) / LCM(Denominators) | LCM(Fractions) = LCM(Numerators) / HCF(Denominators)',
        description: 'Always reduce fractions to their simplest lowest form before computing HCF/LCM.',
        example: 'HCF(2/3, 8/9, 16/81) = HCF(2,8,16) / LCM(3,9,81) = 2 / 81.'
      },
      {
        name: 'Finding Number Leaving Constant Remainder r',
        formula: 'N = LCM(d1, d2, d3) * k + r',
        description: 'Smallest number which when divided by d1, d2, d3 leaves remainder r in each case is LCM(d1,d2,d3) + r.',
        example: 'Divided by 4, 6, 8 leaves remainder 3: LCM(4,6,8) + 3 = 24 + 3 = 27.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'HCF by Difference Method',
        technique: 'The HCF of any set of numbers must be either the difference between the closest two numbers or a factor of that difference.',
        speedAdvantage: 'Eliminates long division; for HCF(306, 391), difference is 85 = 5 * 17. Since 306 is not divisible by 5, HCF must be 17.'
      },
      {
        title: 'Simultaneous Ringing Interval',
        technique: 'To find how many times bells ring together in T seconds: Count = floor(T / LCM) + 1 (including the initial toll at t=0).',
        speedAdvantage: 'Prevents the classic "+1 initial ring" trap in Banking & SSC.'
      }
    ],
    commonTraps: [
      'Forgetting to add +1 for the starting instant when counting bell tolls or meetings.',
      'Applying Product = HCF × LCM to three numbers without factoring intermediate pairwise common multiples.'
    ],
    examTrends: {
      prelimsWeightage: '1 to 2 Questions',
      mainsWeightage: '1 to 2 Questions (Variable remainder constraints and circular motion sync)',
      recommendedTimePerQuestion: '30-45 seconds'
    }
  },
  'fractions-surds-indices': {
    categoryId: 'fractions-surds-indices',
    topicName: 'Fractions, Decimals, Surds & Indices',
    overview: 'Manipulating exponents, simplifying nested root radicals, converting pure/mixed recurring decimals, and comparing surds using common LCM indices.',
    keyFormulas: [
      {
        name: 'Infinite Nested Radicals (Sum & Difference)',
        formula: 'sqrt(N + sqrt(N + sqrt(N + ...))) = (1 + sqrt(1 + 4N)) / 2',
        description: 'If N is factored into consecutive integers n*(n+1), the "+" series equals (n+1) and the "-" series equals n.',
        example: 'sqrt(12 + sqrt(12 + ...)) = 4 because 12 = 3 * 4.'
      },
      {
        name: 'Infinite Product Radical',
        formula: 'sqrt(N * sqrt(N * sqrt(N * ...))) = N',
        description: 'When infinite multiplication of root N occurs, the value is always N.',
        example: 'sqrt(7 * sqrt(7 * sqrt(7 * ...))) = 7.'
      },
      {
        name: 'Finite Product of Root N (k times)',
        formula: 'sqrt(N * sqrt(N ... (k times))) = N^( (2^k - 1) / 2^k )',
        description: 'Exponent is (2^k - 1) / 2^k where k is the number of radical layers.',
        example: 'sqrt(5 * sqrt(5 * sqrt(5))) (3 roots) = 5^( (8-1)/8 ) = 5^(7/8).'
      },
      {
        name: 'Recurring Decimal to Fraction',
        formula: '0.ab(bar on c) = (abc - ab) / 900 (number of 9s = count of repeating digits, 0s = count of non-repeating digits)',
        description: 'Subtract non-repeating integer prefix from total digits, divided by 9s and 0s.',
        example: '0.12333... = (123 - 12) / 900 = 111 / 900 = 37 / 300.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Comparing Surds by LCM of Indices',
        technique: 'To compare 3^(1/3) and 2^(1/2), take LCM of power denominators (LCM(3,2) = 6). Raise both to 6th power: (3^(1/3))^6 = 3^2 = 9; (2^(1/2))^6 = 2^3 = 8. Since 9 > 8, 3^(1/3) > 2^(1/2).',
        speedAdvantage: 'Avoids decimal root calculations completely.'
      }
    ],
    commonTraps: [
      'Adding exponents when multiplying like bases versus raising a power to a power ( (a^m)^n = a^(m*n) vs a^m * a^n = a^(m+n) ).',
      'Forgetting to rationalize both numerator and denominator with the conjugate (a - sqrt(b)).'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '2 to 3 Questions',
      recommendedTimePerQuestion: '30-50 seconds'
    }
  },
  'ratio-proportion-variation': {
    categoryId: 'ratio-proportion-variation',
    topicName: 'Ratio, Proportion, Variation & Unitary Method',
    overview: 'Mastery of proportional division, compound ratios, third/fourth/mean proportionals, and inverse variation models.',
    keyFormulas: [
      {
        name: 'Mean, Third & Fourth Proportional',
        formula: 'Mean Proportional between a & b = sqrt(ab) | Third Proportional to a & b = b^2 / a | Fourth Proportional to a,b,c = (b * c) / a',
        description: 'Fundamental definitions in SSC CGL and Banking quant sections.',
        example: 'Mean proportional of 4 and 16 = sqrt(64) = 8. Third proportional of 12 and 18 = 18^2 / 12 = 27.'
      },
      {
        name: 'Direct & Inverse Variation',
        formula: 'Direct: y = k * x (y1/x1 = y2/x2) | Inverse: y = k / x (y1 * x1 = y2 * x2)',
        description: 'In compound variation: y is directly proportional to u and inversely to v -> (y1 * v1) / u1 = (y2 * v2) / u2.',
        example: 'If 15 men build 30m wall in 10 days, 20 men build 60m wall in: (15*10)/30 = (20*D)/60 -> D = 15 days.'
      },
      {
        name: 'Combining Ratios (A:B and B:C to A:B:C)',
        formula: 'If A:B = p:q and B:C = r:s, then A:B:C = (p*r) : (q*r) : (q*s)',
        description: 'Multiply by cross-terms to equalize the common term B.',
        example: 'A:B = 2:3, B:C = 4:5 -> A:B:C = (2*4) : (3*4) : (3*5) = 8 : 12 : 15.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'N-Method Ratio Merger',
        technique: 'Write [p q] on top, [r s] on bottom. Follow reverse N path: Down-left (p*r), diagonal (q*r), straight down (q*s).',
        speedAdvantage: 'Combines 3-4 ratios in 4 seconds without writing separate equations.'
      }
    ],
    commonTraps: [
      'Failing to convert ratios to a common unit when dividing coin quantities vs coin rupee values.',
      'Assuming third proportional of a & b is (a+b)/2 instead of b^2/a.'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '2 to 3 Questions',
      recommendedTimePerQuestion: '30-45 seconds'
    }
  },
  'percentage-successive': {
    categoryId: 'percentage-successive',
    topicName: 'Percentage & Successive Percentage',
    overview: 'The universal language of data interpretation and commercial arithmetic. Crucial fraction-percentage conversions and successive compound adjustments.',
    keyFormulas: [
      {
        name: 'Successive Percentage Net Effect',
        formula: 'Net % Change = a + b + (a * b) / 100',
        description: 'For increases, use +a, +b; for decreases, use -a, -b. For three successive changes, apply formula pairwise.',
        example: '+20% followed by -10%: 20 - 10 + (20 * -10)/100 = 10 - 2 = +8% net increase.'
      },
      {
        name: 'Price, Consumption & Expenditure Invariance',
        formula: 'If Price rises by r% (r/100 = 1/x), Consumption must decrease by 1/(x+1) to keep expenditure constant.',
        description: 'If price increases by 25% (1/4), consumption must reduce by 1/(4+1) = 1/5 = 20%.',
        example: 'Sugar price rises 20% (1/5) -> Consumption reduction = 1/6 = 16.67%.'
      },
      {
        name: 'Standard Fraction Equivalents (Must Memorize)',
        formula: '1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%, 1/12=8.33%, 1/16=6.25%',
        description: 'Convert percentage multipliers into clean fractions for fast mental cancellation.',
        example: '37.5% = 3/8; 62.5% = 5/8; 83.33% = 5/6; 57.14% = 4/7.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Percentage Splitting Technique',
        technique: 'To calculate 64% of 350: 64% of 350 = 350% of 64 = 3.5 * 64 = 3 * 64 + 32 = 192 + 32 = 224.',
        speedAdvantage: 'Exploits x% of y = y% of x symmetry to make mental math effortless.'
      }
    ],
    commonTraps: [
      'Confusing percentage points with percentage change (e.g., rising from 20% to 25% is a 5 percentage point rise, but a 25% relative increase).',
      'Applying successive formula directly with positive signs for discounts (must use negative signs).'
    ],
    examTrends: {
      prelimsWeightage: '3 to 5 Questions',
      mainsWeightage: '4 to 6 Questions (embedded deeply across all DI sets)',
      recommendedTimePerQuestion: '20-35 seconds'
    }
  },
  'average': {
    categoryId: 'average',
    topicName: 'Average',
    overview: 'Arithmetic mean, weighted mean, and the powerful Assumed Mean Deviation technique that avoids massive additions.',
    keyFormulas: [
      {
        name: 'Deviation Method (Assumed Mean)',
        formula: 'Average = Assumed Mean + (Sum of Deviations / Total Number of Items)',
        description: 'Pick an easy round number near the cluster, calculate difference (+/-) for each item, divide net deviation by count.',
        example: 'Average of 92, 95, 98, 104, 111. Assume A = 100. Deviations: -8, -5, -2, +4, +11. Sum = 0. Average = 100.'
      },
      {
        name: 'Inclusion / Exclusion of an Item',
        formula: 'New Item Value = Old Average + (New Count × Change in Average)',
        description: 'If average increases by d when 1 person joins of new count N: New Person = Old Avg + N * d.',
        example: 'Average weight of 24 students is 40 kg. Teacher joins (count=25), avg rises by 1 kg. Teacher = 40 + (25 * 1) = 65 kg.'
      },
      {
        name: 'Cricket Batting & Bowling Average',
        formula: 'Batting Avg = Total Runs / Dismissals (Innings - Not Out) | Bowling Avg = Runs Conceded / Wickets Taken',
        description: 'For bowling average, a decrease is an improvement.',
        example: 'Batsman scores 80 in 16th inning and increases average by 3: 80 = Old Avg + 16 * 3 -> Old Avg = 32, New Avg = 35.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Consecutive Series Symmetry Rule',
        technique: 'For any arithmetic progression (AP) with odd number of terms, Average = Exact Middle Term. For even number of terms, Average = (First + Last) / 2.',
        speedAdvantage: 'Answers consecutive integer average questions in 1 second.'
      }
    ],
    commonTraps: [
      'Dividing total runs by total innings instead of total dismissals (times out) when not-out innings are mentioned.',
      'Forgetting that bowling average improves when the number decreases.'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '2 Questions',
      recommendedTimePerQuestion: '25-40 seconds'
    }
  },
  'profit-loss-discount': {
    categoryId: 'profit-loss-discount',
    topicName: 'Profit, Loss, Discount & Marked Price',
    overview: 'Commercial arithmetic testing relationships between Cost Price (CP), Selling Price (SP), Marked Price (MP), and profit/discount percentages.',
    keyFormulas: [
      {
        name: 'CP to MP Direct Relationship Formula',
        formula: 'MP / CP = (100 + Profit%) / (100 - Discount%)',
        description: 'Connects Marked Price and Cost Price directly without calculating intermediate Selling Price.',
        example: 'Trader gives 10% discount and gains 20%: MP / CP = (100+20) / (100-10) = 120 / 90 = 4 / 3. Markup = 33.33%.'
      },
      {
        name: 'Successive Discounts Equivalent',
        formula: 'Single Equivalent Discount = d1 + d2 - (d1 * d2) / 100',
        description: 'For two successive discounts of 20% and 10%: Net Discount = 20 + 10 - (20*10)/100 = 28%.',
        example: 'Discounts of 30% and 20%: 30 + 20 - 6 = 44%.'
      },
      {
        name: 'Dishonest Dealer (False Weight Cheat)',
        formula: 'Gain % = (True Value - False Value) / False Value × 100',
        description: 'Profit percentage is always calculated on the quantity actually given to the customer.',
        example: 'Dealer uses 900g weight instead of 1kg: Profit% = (1000 - 900) / 900 * 100 = 100/9 = 11.11%.'
      },
      {
        name: 'Two Items Sold at Same SP (One +x%, One -x%)',
        formula: 'Always a Net Loss % = (x / 10)^2 = x^2 / 100 %',
        description: 'When two articles are sold at equal selling price with equal gain% and loss%, the overall transaction is always a net loss.',
        example: 'Both sold for Rs 1200 each, one at 20% gain, one at 20% loss: Loss% = 20^2 / 100 = 4%.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Multiplier Method for Chain Transactions',
        technique: 'A sells to B at +10% (11/10), B sells to C at +20% (6/5), C pays Rs 1320. Initial CP = 1320 * (10/11) * (5/6) = 1000.',
        speedAdvantage: 'Solves multi-party chain sales in a single multiplication line.'
      }
    ],
    commonTraps: [
      'Calculating discount percentage on CP instead of MP.',
      'Assuming that selling two items at same CP with +x% and -x% yields a loss (at same CP, net result is 0% profit/loss).'
    ],
    examTrends: {
      prelimsWeightage: '3 to 4 Questions',
      mainsWeightage: '3 to 4 Questions',
      recommendedTimePerQuestion: '30-45 seconds'
    }
  },
  'simple-compound-interest': {
    categoryId: 'simple-compound-interest',
    topicName: 'Simple & Compound Interest',
    overview: 'Time value of money. Compounding interest yields geometric growth, whereas simple interest yields arithmetic progression.',
    keyFormulas: [
      {
        name: 'Difference Between CI and SI (2 Years & 3 Years)',
        formula: 'For 2 Years: CI - SI = P * (R / 100)^2 | For 3 Years: CI - SI = P * (R/100)^2 * (3 + R/100)',
        description: 'Fastest formula for solving the most common bank exam interest comparison question.',
        example: 'P = 10000, R = 10%, 2 yrs: CI - SI = 10000 * (10/100)^2 = 10000 * 1/100 = Rs 100.'
      },
      {
        name: 'Compound Interest Multipliers (Pascal Triangle Tree)',
        formula: 'For 2 Yrs: 2A + B | For 3 Yrs: 3A + 3B + C | For 4 Yrs: 4A + 6B + 4C + D',
        description: 'A = R% of P, B = R% of A, C = R% of B. Total CI is sum of rows.',
        example: 'P=8000, R=5%, 3 yrs: A = 400, B = 20, C = 1. CI = 3(400) + 3(20) + 1 = 1200 + 60 + 1 = Rs 1261.'
      },
      {
        name: 'Equal Annual Installments (Compound Interest)',
        formula: 'P = x / (1 + R/100) + x / (1 + R/100)^2 + ... + x / (1 + R/100)^n',
        description: 'x is each equal annual installment paid at end of year.',
        example: 'Loan of Rs 2100 repaid in 2 installments at 10%: 2100 = x/(1.1) + x/(1.21) = 2.1x/1.21 -> x = Rs 1210.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Effective Rate Table (Successive CI %)',
        technique: 'At 10% CI: 2 yrs = 21%, 3 yrs = 33.1%, 4 yrs = 46.41%. At 5% CI: 2 yrs = 10.25%, 3 yrs = 15.7625%.',
        speedAdvantage: 'Directly multiply Principal by memorized effective rate to get CI in 2 seconds.'
      }
    ],
    commonTraps: [
      'Forgetting to halve the annual interest rate (R/2) and double the time periods (2n) for semi-annual compounding.',
      'Applying CI installment formula to simple interest loans (SI installments use linear interest savings formula).'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '2 to 3 Questions',
      recommendedTimePerQuestion: '35-50 seconds'
    }
  },
  'partnership': {
    categoryId: 'partnership',
    topicName: 'Partnership',
    overview: 'Allocation of profits and losses among partners based on effective capital contributions and active management responsibilities.',
    keyFormulas: [
      {
        name: 'Fundamental Partnership Profit Split Rule',
        formula: 'Profit Ratio (P_A : P_B : P_C) = (C_A × T_A) : (C_B × T_B) : (C_C × T_C)',
        description: 'Profit is distributed in direct proportion to the product of Capital (C) and Time period (T).',
        example: 'A invests Rs 5000 for 12 months, B invests Rs 8000 for 6 months: P_A : P_B = (5000*12) : (8000*6) = 60000 : 48000 = 5 : 4.'
      },
      {
        name: 'Working / Active Partner Salary Deduction',
        formula: 'Remaining Distributable Profit = Total Profit - Active Management Salary/Commission',
        description: 'Deduct working partner stipend first from gross profit; remainder is split in Capital × Time ratio.',
        example: 'Total profit Rs 10,000. A gets 10% salary (Rs 1000). Remaining Rs 9000 is divided between A and B based on investment ratio.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Month-Capital Units Normalization',
        technique: 'Convert all investments into "Rupee-Months" by multiplying each fraction of investment by the months it remained active.',
        speedAdvantage: 'Simplifies complex scenarios where partners withdraw or inject capital mid-year.'
      }
    ],
    commonTraps: [
      'Assuming profit split is based solely on capital when investment durations differ.',
      'Forgetting that when partner joins after M months, their time duration is (12 - M) months.'
    ],
    examTrends: {
      prelimsWeightage: '1 to 2 Questions',
      mainsWeightage: '1 to 2 Questions',
      recommendedTimePerQuestion: '30-45 seconds'
    }
  },
  'mixture-alligation': {
    categoryId: 'mixture-alligation',
    topicName: 'Mixture and Alligation',
    overview: 'The rule of alligation is an optical weighted average cross-calculation tool. Solves mixing prices, alloy purities, solution dilutions, and speed blends.',
    keyFormulas: [
      {
        name: 'Rule of Alligation Cross Formula',
        formula: '(Quantity of Cheaper / Quantity of Dearer) = (Price of Dearer - Mean Price) / (Mean Price - Price of Cheaper)',
        description: 'Always place Cheaper on left, Dearer on right, Mean in center. Cross-subtract to get quantity ratio.',
        example: 'Mix rice at Rs 15/kg with Rs 20/kg to get blend at Rs 18/kg: Ratio = (20 - 18) : (18 - 15) = 2 : 3.'
      },
      {
        name: 'Repeated Liquid Replacement / Dilution Formula',
        formula: 'Final Pure Liquid Remaining = Initial Volume × (1 - Replacement Volume / Initial Volume)^n',
        description: 'When y liters of pure liquid are drawn from vessel of capacity x and replaced with water n times.',
        example: '40L pure milk. 4L drawn and replaced with water twice: Remaining milk = 40 * (1 - 4/40)^2 = 40 * 0.81 = 32.4 Liters.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Mean Price Baseline Shift',
        technique: 'Ensure all three prices (Cheaper, Dearer, Mean) are measured in Cost Price (CP). If selling price of mixture with profit is given, find Mean CP = SP / (1 + P%).',
        speedAdvantage: 'Prevents the #1 alligation error in competitive exams.'
      }
    ],
    commonTraps: [
      'Plugging Selling Price (SP) directly into the mean center instead of Cost Price (CP).',
      'Confusing the ratio of ingredients with the ratio of total mixture.'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '2 to 3 Questions',
      recommendedTimePerQuestion: '30-50 seconds'
    }
  },
  'time-work-pipes': {
    categoryId: 'time-work-pipes',
    topicName: 'Time and Work; Pipes and Cisterns',
    overview: 'The standard LCM Total Work model treats work as units rather than fractions. Efficiency is inversely proportional to time taken.',
    keyFormulas: [
      {
        name: 'Total Work LCM Method',
        formula: 'Total Work = LCM(Time_A, Time_B, Time_C) | Efficiency = Total Work / Time Taken',
        description: 'Convert fractions 1/A + 1/B into integer work units. Time together = Total Work / (Sum of Efficiencies).',
        example: 'A does work in 10 days, B in 15 days. Total Work = LCM(10,15) = 30 units. Eff_A = 3, Eff_B = 2. Together: 30 / (3+2) = 6 days.'
      },
      {
        name: 'Chain Rule (Man-Days-Hours-Efficiency)',
        formula: '(M1 × D1 × H1 × E1) / W1 = (M2 × D2 × H2 × E2) / W2',
        description: 'M = Men, D = Days, H = Hours/day, E = Efficiency, W = Work done or wages earned.',
        example: '12 men working 8 hrs/day complete work in 10 days. How many days for 16 men at 6 hrs/day? (12*8*10)/1 = (16*6*D)/1 -> D = 10 days.'
      },
      {
        name: 'Pipes with Leakage (Negative Efficiency)',
        formula: 'Net Efficiency = Filling Rate (Positive) - Emptying / Leak Rate (Negative)',
        description: 'Inlet pipe adds positive units per hour; drain pipe subtracts units per hour.',
        example: 'Pipe fills tank in 6 hrs (Eff = +2 units/hr on 12u tank). Leak empties in 12 hrs (Eff = -1). Net Eff = +1. Time to fill = 12 hrs.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Alternate Day Work Cycle Rule',
        technique: 'Find work done in 1 full cycle (e.g. 2 days for A then B). Divide Total Work by 1-cycle work to get complete cycles, then calculate remaining units.',
        speedAdvantage: 'Prevents overshoot errors on alternate work schedules.'
      }
    ],
    commonTraps: [
      'Dividing wages equally among workers rather than in direct proportion to work units contributed.',
      'Failing to stop when a filling pipe is closed or tank overflows.'
    ],
    examTrends: {
      prelimsWeightage: '3 to 4 Questions',
      mainsWeightage: '3 to 4 Questions',
      recommendedTimePerQuestion: '30-45 seconds'
    }
  },
  'speed-distance-trains-boats': {
    categoryId: 'speed-distance-trains-boats',
    topicName: 'Speed, Time and Distance; Trains; Boats and Streams',
    overview: 'Motion physics applied to competitive arithmetic. Train crossings require adding vehicle lengths; boats and streams require relative river flow vector math.',
    keyFormulas: [
      {
        name: 'Unit Conversion Golden Multiplier',
        formula: '1 km/h = 5/18 m/s | 1 m/s = 18/5 km/h',
        description: 'Multiply km/h by 5/18 to get m/s. Multiply m/s by 18/5 to get km/h.',
        example: '72 km/h = 72 * (5/18) = 20 m/s.'
      },
      {
        name: 'Train Crossing Formulas',
        formula: 'Crossing Stationary Point Object (pole/man): Time = L_train / Speed | Crossing Extended Object (platform/bridge/train): Time = (L_train + L_platform) / Relative Speed',
        description: 'When two moving trains cross: In opposite directions, Relative Speed = S1 + S2; In same direction, Relative Speed = |S1 - S2|.',
        example: 'Train 200m long at 54 km/h (15 m/s) crosses 100m platform: Time = (200 + 100) / 15 = 20 seconds.'
      },
      {
        name: 'Boats and Streams (Upstream vs Downstream)',
        formula: 'Downstream Speed (D) = u + v | Upstream Speed (U) = u - v | Still Water Speed (u) = (D + U) / 2 | Stream Speed (v) = (D - U) / 2',
        description: 'u = boat speed in still water, v = river stream flow speed.',
        example: 'Downstream = 16 km/h, Upstream = 10 km/h -> Boat in still water = (16+10)/2 = 13 km/h; Stream = (16-10)/2 = 3 km/h.'
      },
      {
        name: 'Harmonic Average Speed for Equal Distance',
        formula: 'Average Speed = (2 × S1 × S2) / (S1 + S2)',
        description: 'Applicable ONLY when equal distance is traveled at speed S1 and returned at speed S2.',
        example: 'Goes at 60 km/h, returns at 40 km/h: Avg Speed = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Meeting After Passing Theorem',
        technique: 'If two bodies start at same time towards each other and take time t1 and t2 to reach their destinations after meeting: Speed1 / Speed2 = sqrt(t2 / t1).',
        speedAdvantage: 'Solves the advanced Mains question in 5 seconds without quadratic equations.'
      }
    ],
    commonTraps: [
      'Taking simple arithmetic average (S1+S2)/2 for round trips instead of harmonic average 2S1S2/(S1+S2).',
      'Forgetting to add the length of both trains when they cross each other.'
    ],
    examTrends: {
      prelimsWeightage: '3 to 4 Questions',
      mainsWeightage: '4 to 5 Questions',
      recommendedTimePerQuestion: '30-50 seconds'
    }
  },
  'ages': {
    categoryId: 'ages',
    topicName: 'Ages',
    overview: 'Age problems rely on a single golden axiom: the age difference between any two people remains permanently invariant across time.',
    keyFormulas: [
      {
        name: 'Age Difference Invariance Principle',
        formula: 'Age_A(t) - Age_B(t) = Constant for all time t',
        description: 'If A is 6 years older than B today, A was 6 years older 20 years ago and will be 6 years older 50 years from now.',
        example: 'If Ratio of ages is 4:3 today and 5:4 in 5 years: Difference in ratio units = 1 in both. 1 unit = 5 years. Present ages = 20 and 15.'
      },
      {
        name: 'Ratio Normalization Across Time',
        formula: 'Equalize unit differences between numerator and denominator in both time frames.',
        description: 'Multiply ratios by cross differences to balance unit steps.',
        example: 'Age ratio 7:3 (diff=4) and 2:1 (diff=1). Multiply second ratio by 4 -> 8:4. Now 7->8 is +1 unit.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Cross-Multiplication Age Shortcut',
        technique: 'For (Present A/B = a/b) and (In T years = c/d): Present Age of B = (T * b * (c - d)) / |a*d - b*c|.',
        speedAdvantage: 'Direct one-step arithmetic calculation without setting up 2x2 simultaneous algebra.'
      }
    ],
    commonTraps: [
      'Adding time T to only one person instead of both individuals.',
      'Misinterpreting "n years ago" as +n instead of -n.'
    ],
    examTrends: {
      prelimsWeightage: '1 to 2 Questions',
      mainsWeightage: '1 Question',
      recommendedTimePerQuestion: '25-35 seconds'
    }
  },
  'clocks-calendars': {
    categoryId: 'clocks-calendars',
    topicName: 'Clocks and Calendars',
    overview: 'Angular speeds of clock hands and modular day offsets in the Gregorian calendar.',
    keyFormulas: [
      {
        name: 'Clock Angle Master Formula',
        formula: 'Angle θ = | 30 × H - (11/2) × M | degrees',
        description: 'H = Hour (1-12), M = Minutes (0-59). If angle > 180°, reflex angle = 360° - θ.',
        example: 'At 8:20: θ = |30(8) - 5.5(20)| = |240 - 110| = 130 degrees.'
      },
      {
        name: 'Relative Angular Speed of Clock Hands',
        formula: 'Minute hand = 6°/min | Hour hand = 0.5°/min | Relative Speed = 5.5°/min (11/2° per min)',
        description: 'Hands coincide every 65 and 5/11 minutes (22 times in 24 hours, not 24 times).',
        example: 'Hands overlap 11 times in 12 hours.'
      },
      {
        name: 'Calendar Odd Days Counting',
        formula: 'Normal Year = 365 days = 52 weeks + 1 Odd Day | Leap Year = 366 days = 52 weeks + 2 Odd Days',
        description: '100 years = 5 odd days; 200 years = 3 odd days; 300 years = 1 odd day; 400 years = 0 odd days.',
        example: 'Century years are leap years ONLY if divisible by 400 (e.g., 2000 is a leap year, 1900 is not).'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Instant Overlap Time (Between H and H+1)',
        technique: 'Exact time when hands coincide = (5 × H) × (12/11) minutes past H.',
        speedAdvantage: 'Between 4 and 5 o\'clock: (5 * 4) * (12/11) = 240 / 11 = 21 and 9/11 min past 4.'
      }
    ],
    commonTraps: [
      'Treating 1700, 1800, 1900 as leap years (they are not leap years because century years must be divisible by 400).',
      'Forgetting that clock hands coincide only 22 times in 24 hours (due to 11 to 1 o\'clock overlap).'
    ],
    examTrends: {
      prelimsWeightage: '1 to 2 Questions',
      mainsWeightage: '1 Question',
      recommendedTimePerQuestion: '25-40 seconds'
    }
  },
  'mensuration': {
    categoryId: 'mensuration',
    topicName: 'Mensuration (2D & 3D)',
    overview: 'Formulas for geometric perimeters, areas, surface areas, and volumes. Crucial for Bank PO and SSC CGL Tier 2.',
    keyFormulas: [
      {
        name: '2D Master Formulas',
        formula: 'Circle: Area = πr², Circumference = 2πr | Equilateral Triangle: Area = (√3/4)a², Height = (√3/2)a | Rhombus: Area = 1/2 × d1 × d2, Side = 1/2 √(d1² + d2²)',
        description: 'Sector Area = (θ/360) × πr²; Arc Length = (θ/360) × 2πr.',
        example: 'Rhombus with diagonals 12cm and 16cm: Area = 1/2 * 12 * 16 = 96 cm²; Side = 1/2 √(144+256) = 10 cm.'
      },
      {
        name: '3D Cylinder, Cone & Sphere',
        formula: 'Cylinder: Vol = πr²h, CSA = 2πrh, TSA = 2πr(r+h) | Cone: Vol = 1/3 πr²h, CSA = πrl (where l = √(r²+h²)) | Sphere: Vol = 4/3 πr³, Surface Area = 4πr²',
        description: 'Hemisphere: Vol = 2/3 πr³, CSA = 2πr², TSA = 3πr².',
        example: 'Cone with r=6, h=8: l = √(36+64) = 10. Volume = 1/3 * π * 36 * 8 = 96π. CSA = π * 6 * 10 = 60π.'
      },
      {
        name: 'Melting & Recasting 3D Solids',
        formula: 'Number of New Spheres (n) × Volume_small = Total Volume_initial',
        description: 'Conservation of total volume when solid objects are melted or reshaped.',
        example: 'Melting metallic sphere of radius 6cm into small spheres of radius 2cm: n = (4/3 π 6^3) / (4/3 π 2^3) = (6/2)^3 = 27 spheres.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Divisibility by 11 (The π-Test)',
        technique: 'Since π = 22/7 has a factor of 11, any mensuration answer involving π (cylinder, cone, sphere, circle) MUST be divisible by 11 (difference of sum of alternate digits is 0 or multiple of 11).',
        speedAdvantage: 'Eliminate 3 out of 4 options in 3 seconds without calculating.'
      }
    ],
    commonTraps: [
      'Confusing Curved Surface Area (CSA) with Total Surface Area (TSA) of a cylinder (2πrh vs 2πr(r+h)).',
      'Forgetting that TSA of a solid hemisphere includes the base circular disk (3πr², not 2πr²).'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '3 to 5 Questions (SSC CGL Mains major scoring block)',
      recommendedTimePerQuestion: '35-55 seconds'
    }
  },
  'data-interpretation': {
    categoryId: 'data-interpretation',
    topicName: 'Data Interpretation',
    overview: 'Extracting patterns and calculating percentage growths, ratios, and averages from visual charts and tabular datasets.',
    keyFormulas: [
      {
        name: 'Pie Chart Conversion Axiom',
        formula: '100% = 360° | 1% = 3.6° | 1° = (100 / 360)% = (5 / 18)%',
        description: 'To convert degrees to value: Value = (Angle in degrees / 360) × Total Amount.',
        example: 'A sector of 54° out of total budget Rs 80,000: Amount = (54 / 360) * 80000 = 0.15 * 80000 = Rs 12,000.'
      },
      {
        name: 'Percentage Increase / Decrease in Time Series',
        formula: '% Growth = [(Final Value - Initial Value) / Initial Value] × 100',
        description: 'Denominator is always the Base / Initial Period value.',
        example: 'Revenue increases from 250 Cr to 350 Cr: Growth% = (350 - 250) / 250 * 100 = 100/250 * 100 = 40%.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Fractional Cross-Multiplication for Comparing Ratios',
        technique: 'To quickly compare a/b vs c/d: Compare (a * d) vs (b * c). If ad > bc, then a/b > c/d.',
        speedAdvantage: 'Compares 4 large fraction growth rates in 5 seconds without decimal division.'
      }
    ],
    commonTraps: [
      'Using the wrong base denominator (e.g. dividing by final year instead of initial year for % growth).',
      'Misreading chart axis scale units (thousands vs millions vs lakhs).'
    ],
    examTrends: {
      prelimsWeightage: '5 to 10 Questions (1-2 sets in Bank Prelims)',
      mainsWeightage: '15 to 25 Questions (Core of SBI PO & IBPS PO Mains)',
      recommendedTimePerQuestion: '40-60 seconds per question in a set'
    }
  },
  'probability-permutation-combination': {
    categoryId: 'probability-permutation-combination',
    topicName: 'Basic Probability, Permutation and Combination',
    overview: 'Counting principles, permutations (order matters), combinations (selections where order does not matter), and classical probability.',
    keyFormulas: [
      {
        name: 'Permutation (Arrangement) vs Combination (Selection)',
        formula: 'nPr = n! / (n - r)! | nCr = n! / [r! × (n - r)!] | nCr = nC(n-r)',
        description: 'Permutation when sequence/position matters (words, ranks, codes); Combination when team/group is formed.',
        example: 'Select 3 people from 7: 7C3 = (7*6*5)/(3*2*1) = 35.'
      },
      {
        name: 'Permutations with Repeated Letters',
        formula: 'Arrangements = Total_Letters! / (p! × q! × r!)',
        description: 'Where p, q, r are frequencies of identical letters.',
        example: 'Word "MISSISSIPPI" (11 letters: 4 I, 4 S, 2 P, 1 M): 11! / (4! * 4! * 2!) = 34,650.'
      },
      {
        name: 'Classical Probability Axioms',
        formula: 'P(Event) = Favorable Outcomes / Total Sample Space | P(A or B) = P(A) + P(B) - P(A and B)',
        description: 'For independent events: P(A and B) = P(A) × P(B). Complement rule: P(At least one) = 1 - P(None).',
        example: 'Probability of getting at least one Head in 3 coin tosses = 1 - (1/2)^3 = 1 - 1/8 = 7/8.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Complement Method for "At Least One"',
        technique: 'Whenever a problem asks for probability of "at least one", always calculate 1 - P(None).',
        speedAdvantage: 'Reduces 5 lengthy addition cases to 1 quick subtraction.'
      }
    ],
    commonTraps: [
      'Using permutation (nPr) when only selection (nCr) is required.',
      'Forgetting that circular permutations of n distinct objects equals (n - 1)!, and for identical beads/necklaces equals (n - 1)! / 2.'
    ],
    examTrends: {
      prelimsWeightage: '1 to 2 Questions',
      mainsWeightage: '2 to 3 Questions',
      recommendedTimePerQuestion: '30-50 seconds'
    }
  },
  'quadratic-linear-equations': {
    categoryId: 'quadratic-linear-equations',
    topicName: 'Quadratic and Linear Equations',
    overview: 'High-frequency scoring section in Banking Prelims & Mains. Root sign heuristics allow instant comparison between x and y roots.',
    keyFormulas: [
      {
        name: 'Instant Root Sign Chart (Master Shortcut)',
        formula: 'Equation Signs: (+, +) -> Roots: (-, -) | (+, -) -> Roots: (-, +) | (-, +) -> Roots: (+, +) | (-, -) -> Roots: (+, -)',
        description: 'Look at the signs of (b, c) in ax² + bx + c = 0. The root signs are determined instantly.',
        example: 'If Eq 1 has (+,+) -> roots are (-,-); Eq 2 has (-,+) -> roots are (+,+). Therefore, y > x directly without finding numerical roots!'
      },
      {
        name: 'Roots of Quadratic Equation',
        formula: 'x = [-b ± √(b² - 4ac)] / (2a) | Sum of roots = -b/a | Product of roots = c/a',
        description: 'Discriminant Δ = b² - 4ac: Real & distinct if Δ > 0; Equal if Δ = 0; Imaginary if Δ < 0.',
        example: 'x² - 7x + 12 = 0 -> Sum = 7, Prod = 12 -> Roots are +3 and +4.'
      },
      {
        name: 'Both Constants Negative Rule (Instant CND)',
        formula: 'If constant term c is negative in BOTH equations (ax² + bx - c1 = 0 and dy² + ey - c2 = 0), answer is ALWAYS "Relationship Cannot Be Determined (CND)".',
        description: 'Both equations will have one positive and one negative root, which inevitably overlap.',
        example: 'x² + 3x - 10 = 0 and y² - 5y - 14 = 0 -> Both c < 0 -> Answer is CND in 1 second!'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Sign Elimination 2-Second Trick',
        technique: 'When constant terms c1 and c2 are negative in both equations, mark "Relationship cannot be established" immediately.',
        speedAdvantage: 'Saves 45 seconds per question on Bank PO quadratic comparison sets.'
      }
    ],
    commonTraps: [
      'Forgetting to divide roots by the leading coefficient a when comparing roots of equations with different leading coefficients.',
      'Assuming x² = 16 (x = ±4) has same roots as x = √16 (x = +4 only).'
    ],
    examTrends: {
      prelimsWeightage: '5 Questions (Fixed set in SBI PO & IBPS PO Prelims)',
      mainsWeightage: '2 to 3 Questions (High-degree equations & variable comparisons)',
      recommendedTimePerQuestion: '15-20 seconds per question with sign method'
    }
  },
  'tables-graphs-quantity-comparison': {
    categoryId: 'tables-graphs-quantity-comparison',
    topicName: 'Tables, Graphs, and Quantity Comparison',
    overview: 'Quantity I vs Quantity II comparison format and advanced Data Sufficiency testing logical deduction and arithmetic bounds.',
    keyFormulas: [
      {
        name: 'Quantity I vs Quantity II Rules',
        formula: 'Option A: Q1 > Q2 | Option B: Q1 < Q2 | Option C: Q1 ≥ Q2 | Option D: Q1 ≤ Q2 | Option E: Q1 = Q2 or Relation Cannot be Determined',
        description: 'Solve both mathematical scenarios independently, then compare numerical magnitudes strictly.',
        example: 'Q1 = Age of father (45), Q2 = Age of mother (42) -> Q1 > Q2.'
      },
      {
        name: 'Data Sufficiency Decision Matrix',
        formula: 'Statement 1 alone sufficient | Statement 2 alone sufficient | Both together required | Neither sufficient',
        description: 'Never fully calculate the numerical final answer if sufficiency is already proven logically.',
        example: 'To find circle area, Statement 1 gives radius = 7 -> Sufficient alone! Stop calculating.'
      }
    ],
    vedicShortcuts: [
      {
        title: 'Order of Magnitude Bounding',
        technique: 'Instead of finding exact square roots or complex interest sums for Q1 and Q2, establish upper and lower bounds (e.g. Q1 > 500, Q2 < 300).',
        speedAdvantage: 'Proves Q1 > Q2 in 10 seconds without full calculations.'
      }
    ],
    commonTraps: [
      'Carrying over information from Statement 1 into Statement 2 when testing Statement 2 alone in Data Sufficiency.',
      'Assuming variables are positive integers when real or negative numbers are allowed.'
    ],
    examTrends: {
      prelimsWeightage: '2 to 3 Questions',
      mainsWeightage: '5 to 7 Questions (Dominates Bank PO Mains and CAT)',
      recommendedTimePerQuestion: '40-60 seconds'
    }
  }
};
