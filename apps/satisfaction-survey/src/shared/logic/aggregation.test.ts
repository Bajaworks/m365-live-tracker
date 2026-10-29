/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import type { ISurveyRecord, RecommendValue, ResolvedValue, Score } from '../model/survey';
import { summarize } from './aggregation';

let nextId: number = 1;

function record(
  created: string,
  scores: [Score, Score, Score, Score],
  resolved: ResolvedValue = 'Sí',
  wouldRecommend: RecommendValue = 'Sí',
  comments?: string
): ISurveyRecord {
  return {
    id: nextId++,
    ticketNumber: String(1000 + nextId),
    technician: { email: 'ana.lopez@contoso.com', displayName: 'Ana López' },
    resolved,
    scores: { Understanding: scores[0], Speed: scores[1], Skill: scores[2], Communication: scores[3] },
    wouldRecommend,
    comments,
    created: new Date(created)
  };
}

describe('summarize', () => {
  it('handles no responses', () => {
    const s = summarize([]);
    expect(s.n).toBe(0);
    expect(s.insufficient).toBe(true);
    expect(s.overall).toBe(0);
    expect(s.strongest).toBeUndefined();
    expect(s.weakest).toBeUndefined();
    expect(s.monthly).toEqual([]);
    expect(s.recommendPct).toBe(0);
  });

  it('marks fewer than 5 responses as insufficient', () => {
    const items: ISurveyRecord[] = [1, 2, 3, 4].map((d) => record(`2026-10-0${d}T10:00:00Z`, [4, 4, 4, 4]));
    expect(summarize(items).insufficient).toBe(true);
    items.push(record('2026-10-05T10:00:00Z', [4, 4, 4, 4]));
    expect(summarize(items).insufficient).toBe(false);
  });

  it('computes exact averages, overall and distribution', () => {
    const s = summarize([
      record('2026-10-01T10:00:00Z', [5, 2, 4, 5]),
      record('2026-10-02T10:00:00Z', [4, 3, 4, 5]),
      record('2026-10-03T10:00:00Z', [3, 1, 4, 4])
    ]);
    expect(s.byDimension.Understanding.avg).toBeCloseTo(4, 6);
    expect(s.byDimension.Speed.avg).toBeCloseTo(2, 6);
    expect(s.byDimension.Skill.avg).toBeCloseTo(4, 6);
    expect(s.byDimension.Communication.avg).toBeCloseTo(14 / 3, 6);
    expect(s.overall).toBeCloseTo((4 + 2 + 4 + 14 / 3) / 4, 6);
    expect(s.byDimension.Speed.distribution).toEqual([1, 1, 1, 0, 0]);
    const total: number = s.byDimension.Communication.distribution.reduce((a, b) => a + b, 0);
    expect(total).toBe(3);
  });

  it('finds the strongest and weakest dimension', () => {
    const s = summarize([record('2026-10-01T10:00:00Z', [4, 2, 4, 5])]);
    expect(s.strongest).toBe('Communication');
    expect(s.weakest).toBe('Speed');
  });

  it('breaks ties with the canonical order', () => {
    const s = summarize([record('2026-10-01T10:00:00Z', [3, 3, 3, 3])]);
    expect(s.strongest).toBe('Understanding');
    expect(s.weakest).toBe('Understanding');
  });

  it('computes resolved and recommendation percentages', () => {
    const s = summarize([
      record('2026-10-01T10:00:00Z', [4, 4, 4, 4], 'Sí', 'Sí'),
      record('2026-10-02T10:00:00Z', [4, 4, 4, 4], 'Sí', 'No estoy seguro'),
      record('2026-10-03T10:00:00Z', [3, 3, 3, 3], 'Parcialmente', 'Sí', 'Faltó algo'),
      record('2026-10-04T10:00:00Z', [2, 2, 2, 2], 'No', 'No', 'No se resolvió')
    ]);
    expect(s.resolved).toEqual({ Sí: 50, Parcialmente: 25, No: 25 });
    expect(s.recommendPct).toBe(50);
  });

  it('groups the monthly trend by Created (UTC), in order', () => {
    const s = summarize([
      record('2026-09-30T23:30:00Z', [2, 2, 2, 2]),
      record('2026-08-15T10:00:00Z', [3, 3, 3, 3]),
      record('2026-09-01T10:00:00Z', [4, 4, 4, 4])
    ]);
    expect(s.monthly.map((m) => m.month)).toEqual(['2026-08', '2026-09']);
    expect(s.monthly[1].n).toBe(2);
    expect(s.monthly[1].byDimension.Skill).toBeCloseTo(3, 6);
  });

  it('lists recent comments newest first and flags low responses', () => {
    const s = summarize(
      [
        record('2026-10-01T10:00:00Z', [5, 5, 5, 5], 'Sí', 'Sí', 'Excelente'),
        record('2026-10-03T10:00:00Z', [4, 1, 4, 4], 'Sí', 'Sí', 'Muy lento'),
        record('2026-10-02T10:00:00Z', [4, 4, 4, 4], 'Sí', 'Sí', '   '),
        record('2026-10-04T10:00:00Z', [4, 4, 4, 4])
      ],
      { recentComments: 5 }
    );
    expect(s.recentComments.map((c) => c.text)).toEqual(['Muy lento', 'Excelente']);
    expect(s.recentComments[0].low).toBe(true);
    expect(s.recentComments[1].low).toBe(false);
  });
});
