/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-004
 */
import type { IPerson } from '../model/survey';
import { normalizeName } from '../services/PeopleService';

export type TechnicianMatch =
  | { kind: 'match'; person: IPerson }
  | { kind: 'ambiguous'; options: IPerson[] }
  | { kind: 'notFound'; suggestions: IPerson[] }
  | { kind: 'missing'; suggestions: IPerson[] };

/**
 * Finds which technician (among those with surveys) the tool argument means.
 * Order: exact email → exact name (accents/case ignored) → every word of the
 * query contained in the name. Never guesses between several candidates.
 */
export function matchTechnician(query: string | undefined, technicians: IPerson[]): TechnicianMatch {
  const q: string = normalizeName(query || '');
  if (!q) {
    return { kind: 'missing', suggestions: technicians };
  }

  const byEmail: IPerson[] = technicians.filter((p) => p.email.toLowerCase() === q);
  if (byEmail.length === 1) {
    return { kind: 'match', person: byEmail[0] };
  }

  const exact: IPerson[] = technicians.filter((p) => normalizeName(p.displayName) === q);
  if (exact.length === 1) {
    return { kind: 'match', person: exact[0] };
  }

  const words: string[] = q.split(' ');
  const partial: IPerson[] = technicians.filter((p) => {
    const haystack: string = `${normalizeName(p.displayName)} ${p.email.toLowerCase()}`;
    return words.every((w) => haystack.indexOf(w) >= 0);
  });
  if (partial.length === 1) {
    return { kind: 'match', person: partial[0] };
  }
  if (partial.length > 1) {
    return { kind: 'ambiguous', options: partial };
  }
  return { kind: 'notFound', suggestions: technicians };
}
