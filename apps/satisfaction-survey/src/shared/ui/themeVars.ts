/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-004
 */
import type { CSSProperties } from 'react';
import { webDarkTheme, webLightTheme, type Theme } from '@fluentui/react-components';

/** Host theme ('light' | 'dark') → Fluent theme. */
export function themeFor(hostTheme: string | undefined): Theme {
  return hostTheme === 'dark' ? webDarkTheme : webLightTheme;
}

/**
 * Fluent tokens as inline CSS variables (risk R9).
 *
 * FluentProvider normally injects the tokens through a <style> tag. Microsoft's
 * beta.2 samples found that this can silently fail inside the Copilot iframe,
 * leaving every `var(--token)` empty. Applying the same variables inline on the
 * root element is a cheap safety net: CSS variables inherit, so the whole tree
 * resolves them even if the injected sheet is missing.
 */
export function themeToCssVars(theme: Theme): CSSProperties {
  const vars: { [name: string]: string } = {};
  Object.keys(theme).forEach((key) => {
    const value: unknown = (theme as unknown as { [k: string]: unknown })[key];
    if (value !== undefined && value !== null) {
      vars[`--${key}`] = String(value);
    }
  });
  return vars as CSSProperties;
}
