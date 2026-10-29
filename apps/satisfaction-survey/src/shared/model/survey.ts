/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-010
 */

/** Choice values exactly as stored in the SharePoint list. */
export type ResolvedValue = 'Sí' | 'Parcialmente' | 'No';
export type RecommendValue = 'Sí' | 'No' | 'No estoy seguro';
export type DimensionKey = 'Understanding' | 'Speed' | 'Skill' | 'Communication';
export type Score = 1 | 2 | 3 | 4 | 5;
export type Period = 'month' | 'quarter' | 'semester' | 'all';

export const RESOLVED_VALUES: ReadonlyArray<ResolvedValue> = ['Sí', 'Parcialmente', 'No'];
export const RECOMMEND_VALUES: ReadonlyArray<RecommendValue> = ['Sí', 'No', 'No estoy seguro'];
export const PERIODS: ReadonlyArray<Period> = ['month', 'quarter', 'semester', 'all'];

export interface IDimensionDefinition {
  key: DimensionKey;
  /** Key in the loc strings for the one-word label (Comprensión…). */
  labelKey: string;
  /** Key in the loc strings for the survey question. */
  questionKey: string;
}

/** Canonical order: also used to break ties (strongest / weakest). */
export const DIMENSIONS: ReadonlyArray<IDimensionDefinition> = [
  { key: 'Understanding', labelKey: 'DimUnderstanding', questionKey: 'QUnderstanding' }, // Comprensión
  { key: 'Speed', labelKey: 'DimSpeed', questionKey: 'QSpeed' }, // Rapidez
  { key: 'Skill', labelKey: 'DimSkill', questionKey: 'QSkill' }, // Habilidad
  { key: 'Communication', labelKey: 'DimCommunication', questionKey: 'QCommunication' } // Comunicación
];

export const DIMENSION_KEYS: ReadonlyArray<DimensionKey> = DIMENSIONS.map((d) => d.key);

export interface IPerson {
  email: string;
  displayName: string;
}

export interface ICurrentUser extends IPerson {
  /** Site user Id in the survey site. */
  id: number;
}

/** What the form holds while the user is answering. */
export interface ISurveyDraft {
  ticketNumber: string;
  technician?: IPerson;
  resolved?: ResolvedValue;
  scores: Partial<Record<DimensionKey, Score>>;
  wouldRecommend?: RecommendValue;
  comments: string;
}

/** A stored survey response. */
export interface ISurveyRecord {
  id: number;
  ticketNumber: string;
  technician: IPerson;
  resolved: ResolvedValue;
  scores: Record<DimensionKey, Score>;
  wouldRecommend: RecommendValue;
  comments?: string;
  created: Date;
}

export interface IDimensionSummary {
  /** Average 1–5 (0 when there are no responses). */
  avg: number;
  /** Count of responses per score: index 0 = score 1 … index 4 = score 5. */
  distribution: [number, number, number, number, number];
}

export interface IMonthlyPoint {
  /** YYYY-MM (UTC). */
  month: string;
  n: number;
  byDimension: Record<DimensionKey, number>;
}

export interface IRecentComment {
  text: string;
  created: Date;
  /** True when any dimension of that response is low (≤ LOW_SCORE_THRESHOLD). */
  low: boolean;
}

export interface IScorecardSummary {
  n: number;
  /** n < MIN_RESPONSES. */
  insufficient: boolean;
  /** Average of the four dimension averages. */
  overall: number;
  byDimension: Record<DimensionKey, IDimensionSummary>;
  /** Percentages 0–100. */
  resolved: Record<ResolvedValue, number>;
  /** % of "Sí". */
  recommendPct: number;
  /** Undefined when n = 0. */
  strongest?: DimensionKey;
  weakest?: DimensionKey;
  monthly: IMonthlyPoint[];
  recentComments: IRecentComment[];
}

export function isResolvedValue(value: unknown): value is ResolvedValue {
  return typeof value === 'string' && RESOLVED_VALUES.indexOf(value as ResolvedValue) >= 0;
}

export function isRecommendValue(value: unknown): value is RecommendValue {
  return typeof value === 'string' && RECOMMEND_VALUES.indexOf(value as RecommendValue) >= 0;
}

export function isScore(value: unknown): value is Score {
  return typeof value === 'number' && value >= 1 && value <= 5 && Math.floor(value) === value;
}

export function isPeriod(value: unknown): value is Period {
  return typeof value === 'string' && PERIODS.indexOf(value as Period) >= 0;
}
