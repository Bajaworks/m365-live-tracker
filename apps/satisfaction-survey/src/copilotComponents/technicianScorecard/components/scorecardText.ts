/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-008
 */
import { MIN_RESPONSES } from '../../../shared/config/settings';
import { format } from '../../../shared/logic/text';
import type { DimensionKey, IPerson, IScorecardSummary, Period } from '../../../shared/model/survey';
import { SurveyRepositoryError } from '../../../shared/services/SurveyRepository';
import type { IScorecardStrings } from './ITechnicianScorecardProps';

export function periodLabel(period: Period, strings: IScorecardStrings): string {
  switch (period) {
    case 'month':
      return strings.PeriodMonth;
    case 'semester':
      return strings.PeriodSemester;
    case 'all':
      return strings.PeriodAll;
    default:
      return strings.PeriodQuarter;
  }
}

export function dimensionLabel(key: DimensionKey, strings: IScorecardStrings): string {
  switch (key) {
    case 'Understanding':
      return strings.DimUnderstanding;
    case 'Speed':
      return strings.DimSpeed;
    case 'Skill':
      return strings.DimSkill;
    default:
      return strings.DimCommunication;
  }
}

/** One decimal, locale-aware (es-MX 4.3 · es-ES 4,3). */
export function formatAverage(value: number, locale?: string): string {
  return value.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatPct(value: number): string {
  return String(Math.round(value));
}

/** "2026-09" → "sep 26" in the user's language. */
export function monthLabel(month: string, locale?: string): string {
  const parts: string[] = month.split('-');
  const date: Date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, 15));
  return date.toLocaleDateString(locale, { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

/** Short reason for the demo fallback banner. */
export function readErrorReason(error: unknown, strings: IScorecardStrings, siteUrl: string): string {
  if (error instanceof SurveyRepositoryError) {
    switch (error.code) {
      case 'notFound':
        return format(strings.ErrNotFound, siteUrl);
      case 'forbidden':
        return strings.ErrForbidden;
      case 'network':
        return strings.ErrNetwork;
      default:
        return format(strings.ErrGeneric, error.status || error.code);
    }
  }
  return format(strings.ErrGeneric, error instanceof Error ? error.message : String(error));
}

export interface IModelContext {
  text: string;
  structured: { [key: string]: unknown };
}

/**
 * What Copilot is told about the scorecard on screen (updateModelContextAsync),
 * so follow-up questions are answered with the real numbers — never comments
 * or respondents.
 */
export function scorecardContext(
  person: IPerson,
  period: Period,
  summary: IScorecardSummary,
  demo: boolean,
  strings: IScorecardStrings,
  locale?: string
): IModelContext {
  const label: string = periodLabel(period, strings);
  const demoNote: string = demo ? strings.ModelContextDemo : '';
  if (summary.insufficient) {
    return {
      text: format(strings.ModelContextInsufficient, person.displayName, label, summary.n) + demoNote,
      structured: { event: 'scorecardShown', technician: person.displayName, period, n: summary.n, insufficient: true, minResponses: MIN_RESPONSES, demo }
    };
  }
  const avg = (key: DimensionKey): string => formatAverage(summary.byDimension[key].avg, locale);
  return {
    text:
      format(
        strings.ModelContextSummary,
        person.displayName,
        label,
        summary.n,
        formatAverage(summary.overall, locale),
        avg('Understanding'),
        avg('Speed'),
        avg('Skill'),
        avg('Communication'),
        formatPct(summary.resolved.Sí),
        formatPct(summary.recommendPct),
        summary.strongest ? dimensionLabel(summary.strongest, strings) : '-',
        summary.weakest ? dimensionLabel(summary.weakest, strings) : '-'
      ) + demoNote,
    structured: {
      event: 'scorecardShown',
      technician: person.displayName,
      period,
      n: summary.n,
      overall: Math.round(summary.overall * 10) / 10,
      averages: {
        Understanding: Math.round(summary.byDimension.Understanding.avg * 10) / 10,
        Speed: Math.round(summary.byDimension.Speed.avg * 10) / 10,
        Skill: Math.round(summary.byDimension.Skill.avg * 10) / 10,
        Communication: Math.round(summary.byDimension.Communication.avg * 10) / 10
      },
      resolvedPct: Math.round(summary.resolved.Sí),
      recommendPct: Math.round(summary.recommendPct),
      strongest: summary.strongest,
      weakest: summary.weakest,
      demo
    }
  };
}
