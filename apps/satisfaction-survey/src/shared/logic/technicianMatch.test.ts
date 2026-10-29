/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-004
 */
import type { IPerson } from '../model/survey';
import { buildDemoRecords } from '../data/demoData';
import { summarize } from './aggregation';
import { matchTechnician } from './technicianMatch';

const ANA: IPerson = { email: 'ana.lopez@contoso.com', displayName: 'Ana López' };
const ANA_R: IPerson = { email: 'ana.ruiz@contoso.com', displayName: 'Ana Ruiz' };
const LUIS: IPerson = { email: 'luis.ramirez@contoso.com', displayName: 'Luis Ramírez' };
const ALL: IPerson[] = [ANA, ANA_R, LUIS];

describe('matchTechnician', () => {
  it('matches an email exactly', () => {
    expect(matchTechnician('LUIS.RAMIREZ@contoso.com', ALL)).toEqual({ kind: 'match', person: LUIS });
  });

  it('matches a full name ignoring accents and case', () => {
    expect(matchTechnician('ana lopez', ALL)).toEqual({ kind: 'match', person: ANA });
  });

  it('matches a unique partial name', () => {
    expect(matchTechnician('Luis', ALL)).toEqual({ kind: 'match', person: LUIS });
    expect(matchTechnician('Ramirez', ALL)).toEqual({ kind: 'match', person: LUIS });
  });

  it('asks when several technicians fit', () => {
    expect(matchTechnician('Ana', ALL)).toEqual({ kind: 'ambiguous', options: [ANA, ANA_R] });
  });

  it('offers suggestions when nobody fits', () => {
    expect(matchTechnician('Jorge', ALL)).toEqual({ kind: 'notFound', suggestions: ALL });
  });

  it('reports a missing argument', () => {
    expect(matchTechnician('  ', ALL)).toEqual({ kind: 'missing', suggestions: ALL });
    expect(matchTechnician(undefined, ALL).kind).toBe('missing');
  });
});

describe('buildDemoRecords', () => {
  it('builds the T1 story for any person, dated relative to now', () => {
    const now: Date = new Date('2026-10-24T12:00:00Z');
    const records = buildDemoRecords(ANA, now);
    expect(records.length).toBe(30);
    expect(records.every((r) => r.technician === ANA && r.created.getTime() <= now.getTime())).toBe(true);
    const s = summarize(records);
    expect(s.strongest).toBe('Communication');
    expect(s.weakest).toBe('Speed');
  });
});
