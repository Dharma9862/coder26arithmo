import { AptitudeQuestion } from '../types';
import { APTITUDE_CATEGORIES, TOPIC_CONCEPT_GUIDES } from './aptitudeTopics';

import { TOPIC1_NUMBER_SYSTEM_QUESTIONS } from './questions/topic1_numberSystem';
import { TOPIC2_SIMPLIFICATION_QUESTIONS } from './questions/topic2_simplification';
import { TOPIC3_HCF_LCM_QUESTIONS } from './questions/topic3_hcfLcm';
import { TOPIC4_FRACTIONS_SURDS_QUESTIONS } from './questions/topic4_fractionsSurds';
import { TOPIC5_RATIO_PROPORTION_QUESTIONS } from './questions/topic5_ratioProportion';
import { TOPIC6_PERCENTAGE_QUESTIONS } from './questions/topic6_percentage';
import { TOPIC7_AVERAGE_QUESTIONS } from './questions/topic7_average';
import { TOPIC8_PROFIT_LOSS_QUESTIONS } from './questions/topic8_profitLoss';
import { TOPIC9_INTEREST_QUESTIONS } from './questions/topic9_interest';
import { TOPIC10_PARTNERSHIP_QUESTIONS } from './questions/topic10_partnership';
import { TOPIC11_MIXTURE_ALLIGATION_QUESTIONS } from './questions/topic11_mixtureAlligation';
import { TOPIC12_TIME_WORK_QUESTIONS } from './questions/topic12_timeWork';
import { TOPIC13_SPEED_DISTANCE_QUESTIONS } from './questions/topic13_speedDistance';
import { TOPIC14_AGES_QUESTIONS } from './questions/topic14_ages';
import { TOPIC15_CLOCKS_CALENDARS_QUESTIONS } from './questions/topic15_clocksCalendars';
import { TOPIC16_MENSURATION_QUESTIONS } from './questions/topic16_mensuration';
import { TOPIC17_DATA_INTERPRETATION_QUESTIONS } from './questions/topic17_dataInterpretation';
import { TOPIC18_PROBABILITY_PERMUTATION_QUESTIONS } from './questions/topic18_probabilityPermutation';
import { TOPIC19_QUADRATIC_LINEAR_QUESTIONS } from './questions/topic19_quadraticLinear';
import { TOPIC20_TABLES_GRAPHS_QUESTIONS } from './questions/topic20_tablesGraphs';

export { APTITUDE_CATEGORIES, TOPIC_CONCEPT_GUIDES };

// Aggregate all 20 structured quantitative aptitude topic questions (520+ high-quality questions)
export const INITIAL_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  ...TOPIC1_NUMBER_SYSTEM_QUESTIONS,
  ...TOPIC2_SIMPLIFICATION_QUESTIONS,
  ...TOPIC3_HCF_LCM_QUESTIONS,
  ...TOPIC4_FRACTIONS_SURDS_QUESTIONS,
  ...TOPIC5_RATIO_PROPORTION_QUESTIONS,
  ...TOPIC6_PERCENTAGE_QUESTIONS,
  ...TOPIC7_AVERAGE_QUESTIONS,
  ...TOPIC8_PROFIT_LOSS_QUESTIONS,
  ...TOPIC9_INTEREST_QUESTIONS,
  ...TOPIC10_PARTNERSHIP_QUESTIONS,
  ...TOPIC11_MIXTURE_ALLIGATION_QUESTIONS,
  ...TOPIC12_TIME_WORK_QUESTIONS,
  ...TOPIC13_SPEED_DISTANCE_QUESTIONS,
  ...TOPIC14_AGES_QUESTIONS,
  ...TOPIC15_CLOCKS_CALENDARS_QUESTIONS,
  ...TOPIC16_MENSURATION_QUESTIONS,
  ...TOPIC17_DATA_INTERPRETATION_QUESTIONS,
  ...TOPIC18_PROBABILITY_PERMUTATION_QUESTIONS,
  ...TOPIC19_QUADRATIC_LINEAR_QUESTIONS,
  ...TOPIC20_TABLES_GRAPHS_QUESTIONS,
];
