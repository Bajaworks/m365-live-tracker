/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-003
 *
 * Tool arguments for ShowTechnicianScorecard (RF-10). Exported as JSON Schema;
 * the manifest references the compiled default export.
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  technician: z
    .string()
    .max(120)
    .describe('Nombre o correo del técnico de soporte a consultar, tal como lo dijo el usuario (p. ej. "Ana López" o "ana.lopez@contoso.com").'),
  period: z
    .enum(['month', 'quarter', 'semester', 'all'])
    .optional()
    .describe('Periodo según la fecha de la encuesta: month = último mes, quarter = últimos 3 meses (predeterminado), semester = últimos 6 meses, all = todo el historial.')
});

export type ITechnicianScorecardCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
