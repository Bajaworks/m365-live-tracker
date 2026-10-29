/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import type { Period } from '../model/survey';

const MONTHS_BACK: Record<Exclude<Period, 'all'>, number> = {
  month: 1,
  quarter: 3,
  semester: 6
};

export const DEFAULT_PERIOD: Period = 'quarter';

function daysInMonthUtc(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Same day-of-month N months earlier (UTC), clamped to the end of shorter months. */
export function subtractMonthsUtc(date: Date, months: number): Date {
  const totalMonths: number = date.getUTCFullYear() * 12 + date.getUTCMonth() - months;
  const year: number = Math.floor(totalMonths / 12);
  const monthIndex: number = totalMonths - year * 12;
  const day: number = Math.min(date.getUTCDate(), daysInMonthUtc(year, monthIndex));
  return new Date(
    Date.UTC(
      year,
      monthIndex,
      day,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
}

/**
 * Start of the period, filtered on the survey's `Created` date.
 * Undefined means "no lower bound" (period = all).
 */
export function periodStart(period: Period, now: Date): Date | undefined {
  if (period === 'all') {
    return undefined;
  }
  return subtractMonthsUtc(now, MONTHS_BACK[period]);
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** YYYY-MM in UTC, used to group the monthly trend. */
export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`;
}
