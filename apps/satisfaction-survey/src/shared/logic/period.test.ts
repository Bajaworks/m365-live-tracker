/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import { monthKey, periodStart, subtractMonthsUtc } from './period';

describe('period', () => {
  const now: Date = new Date('2026-10-24T15:00:00Z');

  it('month / quarter / semester go back 1 / 3 / 6 months', () => {
    expect(periodStart('month', now)?.toISOString()).toBe('2026-09-24T15:00:00.000Z');
    expect(periodStart('quarter', now)?.toISOString()).toBe('2026-07-24T15:00:00.000Z');
    expect(periodStart('semester', now)?.toISOString()).toBe('2026-04-24T15:00:00.000Z');
  });

  it('all has no lower bound', () => {
    expect(periodStart('all', now)).toBeUndefined();
  });

  it('clamps to the end of shorter months', () => {
    expect(subtractMonthsUtc(new Date('2026-03-31T00:00:00Z'), 1).toISOString()).toBe(
      '2026-02-28T00:00:00.000Z'
    );
    expect(subtractMonthsUtc(new Date('2026-05-31T00:00:00Z'), 3).toISOString()).toBe(
      '2026-02-28T00:00:00.000Z'
    );
  });

  it('crosses year boundaries', () => {
    expect(subtractMonthsUtc(new Date('2026-02-15T00:00:00Z'), 3).toISOString()).toBe(
      '2025-11-15T00:00:00.000Z'
    );
  });

  it('formats month keys in UTC with two digits', () => {
    expect(monthKey(new Date('2026-03-01T00:00:00Z'))).toBe('2026-03');
    expect(monthKey(new Date('2026-12-31T23:59:59Z'))).toBe('2026-12');
  });
});
