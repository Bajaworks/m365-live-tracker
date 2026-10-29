/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-003
 *
 * Tool arguments for OpenSatisfactionSurvey (RF-05).
 *
 * Defined with Zod and exported as JSON Schema; the manifest references the
 * compiled default export. Copilot fills these from the conversation; both are
 * optional because the agent must never invent a ticket or a name (RF-03).
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  ticketNumber: z
    .string()
    .max(50)
    .optional()
    .describe('Número o código del ticket que mencionó el usuario, sin la palabra "ticket" (p. ej. "4521"). Omitir si no lo mencionó.'),
  technician: z
    .string()
    .max(120)
    .optional()
    .describe('Nombre o correo del técnico que atendió, tal como lo dijo el usuario (p. ej. "Ana López"). Omitir si no lo mencionó.')
});

export type ISatisfactionSurveyFormCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
