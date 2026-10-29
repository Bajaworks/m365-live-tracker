/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-008
 */

/** "Hola {0}, tienes {1}" + args → filled string. Missing args stay as-is. */
export function format(template: string, ...args: Array<string | number>): string {
  return template.replace(/\{(\d+)\}/g, (match: string, index: string) => {
    const value: string | number | undefined = args[Number(index)];
    return value === undefined ? match : String(value);
  });
}

/** First name for friendly copy ("Ana López" → "Ana"). */
export function firstName(displayName: string): string {
  const trimmed: string = (displayName || '').trim();
  return trimmed.split(/\s+/)[0] || trimmed;
}
