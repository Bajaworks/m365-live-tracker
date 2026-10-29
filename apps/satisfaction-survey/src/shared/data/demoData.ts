/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-005
 *
 * Offline demo fallback (technical-spec §12): when the survey list cannot be
 * read, the scorecard shows the bundled sample data with a visible
 * "Datos de demostración" badge. Never used for writes.
 */
import sampleData from './sample-surveys.json';
import {
  isRecommendValue,
  isResolvedValue,
  isScore,
  type IPerson,
  type ISurveyRecord,
  type Score
} from '../model/survey';

interface ISampleItem {
  ticket: string;
  tech: string;
  daysAgo: number;
  hour: number;
  minute: number;
  resolved: string;
  scores: { [key: string]: number };
  recommend: string;
  comments: string;
}

/** Profile used for the demo: T1 (communicates very well, slow to respond). */
export const DEMO_PROFILE: string = 'T1';

const DAY_MS: number = 24 * 60 * 60 * 1000;

/** Sample records of one profile, re-labelled with the requested person. */
export function buildDemoRecords(person: IPerson, now: Date, profile: string = DEMO_PROFILE): ISurveyRecord[] {
  const items: ISampleItem[] = (sampleData as unknown as { items: ISampleItem[] }).items;
  const today: number = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const records: ISurveyRecord[] = [];
  items.forEach((item, index) => {
    const s: { [key: string]: number } = item.scores;
    if (
      item.tech !== profile ||
      !isResolvedValue(item.resolved) ||
      !isRecommendValue(item.recommend) ||
      !isScore(s.Understanding) ||
      !isScore(s.Speed) ||
      !isScore(s.Skill) ||
      !isScore(s.Communication)
    ) {
      return;
    }
    records.push({
      id: -(index + 1),
      ticketNumber: item.ticket,
      technician: person,
      resolved: item.resolved,
      scores: {
        Understanding: s.Understanding as Score,
        Speed: s.Speed as Score,
        Skill: s.Skill as Score,
        Communication: s.Communication as Score
      },
      wouldRecommend: item.recommend,
      comments: item.comments || undefined,
      created: new Date(today - item.daysAgo * DAY_MS + (item.hour * 60 + item.minute) * 60 * 1000)
    });
  });
  return records.sort((a, b) => b.created.getTime() - a.created.getTime());
}
