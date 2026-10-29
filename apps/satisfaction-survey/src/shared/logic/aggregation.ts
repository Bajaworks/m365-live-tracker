/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import { LOW_SCORE_THRESHOLD, MIN_RESPONSES, RECENT_COMMENTS } from '../config/settings';
import {
  DIMENSION_KEYS,
  RESOLVED_VALUES,
  type DimensionKey,
  type IDimensionSummary,
  type IMonthlyPoint,
  type IRecentComment,
  type IScorecardSummary,
  type ISurveyRecord,
  type ResolvedValue
} from '../model/survey';
import { monthKey } from './period';

export interface ISummarizeOptions {
  minResponses?: number;
  recentComments?: number;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  let sum: number = 0;
  values.forEach((v) => {
    sum += v;
  });
  return sum / values.length;
}

function percentage(part: number, total: number): number {
  return total === 0 ? 0 : (part * 100) / total;
}

function emptyByDimension<T>(factory: () => T): Record<DimensionKey, T> {
  const result: Partial<Record<DimensionKey, T>> = {};
  DIMENSION_KEYS.forEach((key) => {
    result[key] = factory();
  });
  return result as Record<DimensionKey, T>;
}

export function isLowResponse(record: ISurveyRecord): boolean {
  return DIMENSION_KEYS.some((key) => record.scores[key] <= LOW_SCORE_THRESHOLD);
}

/** Highest / lowest average; ties go to the first dimension in canonical order. */
function pickExtreme(
  byDimension: Record<DimensionKey, IDimensionSummary>,
  better: (candidate: number, current: number) => boolean
): DimensionKey {
  let chosen: DimensionKey = DIMENSION_KEYS[0];
  DIMENSION_KEYS.forEach((key) => {
    if (better(byDimension[key].avg, byDimension[chosen].avg)) {
      chosen = key;
    }
  });
  return chosen;
}

function buildMonthly(records: ISurveyRecord[]): IMonthlyPoint[] {
  const groups: { [month: string]: ISurveyRecord[] } = {};
  records.forEach((record) => {
    const key: string = monthKey(record.created);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(record);
  });

  return Object.keys(groups)
    .sort()
    .map((month) => {
      const items: ISurveyRecord[] = groups[month];
      return {
        month,
        n: items.length,
        byDimension: averagesByDimension(items)
      };
    });
}

function averagesByDimension(items: ISurveyRecord[]): Record<DimensionKey, number> {
  const result: Partial<Record<DimensionKey, number>> = {};
  DIMENSION_KEYS.forEach((key) => {
    result[key] = average(items.map((r) => r.scores[key]));
  });
  return result as Record<DimensionKey, number>;
}

function buildRecentComments(records: ISurveyRecord[], limit: number): IRecentComment[] {
  return records
    .filter((r) => !!r.comments && r.comments.trim().length > 0)
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .slice(0, limit)
    .map((r) => ({ text: (r.comments || '').trim(), created: r.created, low: isLowResponse(r) }));
}

/**
 * Consolidates a technician's responses for the scorecard.
 * Pure: the caller filters by technician and period beforehand.
 */
export function summarize(records: ISurveyRecord[], options: ISummarizeOptions = {}): IScorecardSummary {
  const minResponses: number = options.minResponses !== undefined ? options.minResponses : MIN_RESPONSES;
  const recentLimit: number = options.recentComments !== undefined ? options.recentComments : RECENT_COMMENTS;
  const n: number = records.length;

  const byDimension: Record<DimensionKey, IDimensionSummary> = emptyByDimension<IDimensionSummary>(() => ({
    avg: 0,
    distribution: [0, 0, 0, 0, 0]
  }));

  DIMENSION_KEYS.forEach((key) => {
    const values: number[] = records.map((r) => r.scores[key]);
    byDimension[key].avg = average(values);
    values.forEach((v) => {
      byDimension[key].distribution[v - 1] += 1;
    });
  });

  const resolvedCounts: Record<ResolvedValue, number> = { Sí: 0, Parcialmente: 0, No: 0 };
  let recommendYes: number = 0;
  records.forEach((r) => {
    resolvedCounts[r.resolved] += 1;
    if (r.wouldRecommend === 'Sí') {
      recommendYes += 1;
    }
  });

  const resolved: Record<ResolvedValue, number> = { Sí: 0, Parcialmente: 0, No: 0 };
  RESOLVED_VALUES.forEach((value) => {
    resolved[value] = percentage(resolvedCounts[value], n);
  });

  return {
    n,
    insufficient: n < minResponses,
    overall: n === 0 ? 0 : average(DIMENSION_KEYS.map((key) => byDimension[key].avg)),
    byDimension,
    resolved,
    recommendPct: percentage(recommendYes, n),
    strongest: n === 0 ? undefined : pickExtreme(byDimension, (c, cur) => c > cur),
    weakest: n === 0 ? undefined : pickExtreme(byDimension, (c, cur) => c < cur),
    monthly: buildMonthly(records),
    recentComments: buildRecentComments(records, recentLimit)
  };
}
