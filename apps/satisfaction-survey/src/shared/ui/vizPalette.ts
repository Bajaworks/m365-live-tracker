/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-007
 *
 * Chart colors, validated with the dataviz validator on the Fluent surfaces
 * (light #ffffff, dark #292929) on 2026-10-24:
 *  - Categorical (one per dimension, fixed order — color follows the dimension,
 *    never its rank): adjacent CVD ΔE ≥ 9.1 light / 8.4 dark, normal-vision ≥ 22.9 / 19.8.
 *    Light: two slots are below 3:1 contrast → relief is mandatory: every line
 *    is direct-labelled and a table view exists.
 *  - Ordinal ramp for scores 1→5 (one hue, monotone lightness, light end ≥ 2:1).
 *    On dark the ramp runs dark→light so that 5 is always the most salient.
 *  - Status (resolved Sí / Parcialmente / No): fixed, always with a text label.
 */
import type { DimensionKey } from '../model/survey';

export interface IVizPalette {
  dimension: Record<DimensionKey, string>;
  /** index 0 = score 1 … index 4 = score 5 */
  scoreRamp: [string, string, string, string, string];
  status: { good: string; warning: string; critical: string };
}

const LIGHT: IVizPalette = {
  dimension: { Understanding: '#2a78d6', Speed: '#eb6834', Skill: '#1baf7a', Communication: '#eda100' },
  scoreRamp: ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#0d366b'],
  status: { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b' }
};

const DARK: IVizPalette = {
  dimension: { Understanding: '#3987e5', Speed: '#d95926', Skill: '#199e70', Communication: '#c98500' },
  scoreRamp: ['#256abf', '#3987e5', '#6da7ec', '#9ec5f4', '#cde2fb'],
  status: { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b' }
};

export function vizPalette(hostTheme: string | undefined): IVizPalette {
  return hostTheme === 'dark' ? DARK : LIGHT;
}
