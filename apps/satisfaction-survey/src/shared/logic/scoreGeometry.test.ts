/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import { clampScore, fillRadius, guideRadii } from './scoreGeometry';

describe('scoreGeometry', () => {
  const R: number = 100;

  it('a 1 shows only the contour (no fill)', () => {
    expect(fillRadius(1, R)).toBe(0);
  });

  it('a 5 fills the whole circle', () => {
    expect(fillRadius(5, R)).toBe(R);
  });

  it('scales by area: a 3 fills half the area', () => {
    expect(fillRadius(3, R)).toBeCloseTo(R * Math.sqrt(0.5), 6);
    const area3: number = Math.PI * Math.pow(fillRadius(3, R), 2);
    const areaFull: number = Math.PI * R * R;
    expect(area3 / areaFull).toBeCloseTo(0.5, 6);
  });

  it('clamps out-of-range values to [1, 5]', () => {
    expect(fillRadius(0, R)).toBe(0);
    expect(fillRadius(7, R)).toBe(R);
    expect(clampScore(NaN)).toBe(1);
  });

  it('returns guide contours for 2, 3 and 4 in increasing order', () => {
    const radii: number[] = guideRadii(R);
    expect(radii.length).toBe(3);
    expect(radii[0]).toBeCloseTo(R * 0.5, 6);
    expect(radii[0]).toBeLessThan(radii[1]);
    expect(radii[1]).toBeLessThan(radii[2]);
    expect(radii[2]).toBeLessThan(R);
  });
});
