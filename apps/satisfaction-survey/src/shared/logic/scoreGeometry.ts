/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */

/**
 * Geometry of the score circle.
 *
 * The outer contour is a 5 and the centre is a 1. The fill grows from the centre
 * with an AREA proportional to (value − 1) / 4, so the perceived size matches the
 * number: a 3 fills half the circle's area (radius R·√0.5), not half its radius.
 */

export function clampScore(value: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return 1;
  }
  return Math.min(5, Math.max(1, value));
}

/** Radius of the filled disc for a score (1 → 0, 5 → outerRadius). */
export function fillRadius(value: number, outerRadius: number): number {
  const fraction: number = (clampScore(value) - 1) / 4;
  return outerRadius * Math.sqrt(fraction);
}

/** Radii of the faint guide contours for the scores 2, 3 and 4. */
export function guideRadii(outerRadius: number): number[] {
  return [2, 3, 4].map((score) => fillRadius(score, outerRadius));
}
