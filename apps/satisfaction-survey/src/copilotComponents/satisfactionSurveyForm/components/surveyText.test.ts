/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-008
 */
import { firstName, format } from '../../../shared/logic/text';
import { SurveyRepositoryError } from '../../../shared/services/SurveyRepository';
import type { ICopilotSurveyStrings, ISurveyAnswer } from './ISatisfactionSurveyFormProps';
import { errorMessage, existingContext, recommendLabel, resolvedLabel, submittedContext } from './surveyText';

// Jest runs in Node (no @types/node in an SPFx project).
declare const __dirname: string;

// The real Spanish strings (AMD module) evaluated without a loader.
const strings: ICopilotSurveyStrings = (function load(): ICopilotSurveyStrings {
  let result: ICopilotSurveyStrings | undefined;
  const define = (_deps: string[], factory: () => ICopilotSurveyStrings): void => {
    result = factory();
  };
  const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-require-imports
  const path = require('path'); // eslint-disable-line @typescript-eslint/no-require-imports
  const source: string = fs.readFileSync(path.join(__dirname, '..', 'loc', 'es-es.js'), 'utf8');
  new Function('define', source)(define); // eslint-disable-line no-new-func
  return result as ICopilotSurveyStrings;
})();

const answer: ISurveyAnswer = {
  ticketNumber: '4521',
  technician: { email: 'ana.lopez@contoso.com', displayName: 'Ana López' },
  resolved: 'Parcialmente',
  scores: { Understanding: 5, Speed: 2, Skill: 4, Communication: 5 },
  wouldRecommend: 'No estoy seguro',
  comments: 'Tardó en responder.'
};

describe('text helpers', () => {
  it('formats placeholders and leaves missing ones', () => {
    expect(format('{0} de {1}', 4, 5)).toBe('4 de 5');
    expect(format('{0} y {1}', 'a')).toBe('a y {1}');
  });

  it('extracts the first name', () => {
    expect(firstName('  Ana   López ')).toBe('Ana');
  });
});

describe('surveyText', () => {
  it('maps stored values to labels', () => {
    expect(resolvedLabel('Parcialmente', strings)).toBe('Parcialmente');
    expect(recommendLabel('No estoy seguro', strings)).toBe('No estoy seguro');
  });

  it('tells the model exactly what was saved', () => {
    const ctx = submittedContext(answer, strings);
    expect(ctx.text).toBe(
      'El usuario envió la encuesta de satisfacción del ticket 4521 sobre la atención de Ana López. Resultado: Parcialmente. Comprensión 5, Rapidez 2, Habilidad 4, Comunicación 5 (de 5). Recomendaría el soporte: No estoy seguro. La encuesta quedó guardada.'
    );
    expect(ctx.structured).toMatchObject({ event: 'surveySubmitted', ticketNumber: '4521', resolved: 'Parcialmente' });
    expect(ctx.text).not.toContain('Tardó'); // the comment is never sent to the model
  });

  it('says nothing new was saved for an existing answer', () => {
    expect(existingContext(answer, strings).text).toContain('no se guardó nada nuevo');
  });

  it('turns errors into actionable sentences', () => {
    const site: string = 'https://contoso.sharepoint.com/sites/encuestas';
    expect(errorMessage(new SurveyRepositoryError('notFound', 'x', 404), strings, site)).toContain(site);
    expect(errorMessage(new SurveyRepositoryError('forbidden', 'x', 403), strings, site)).toBe(strings.ErrForbidden);
    expect(errorMessage(new SurveyRepositoryError('network', 'x'), strings, site)).toBe(strings.ErrNetwork);
    expect(errorMessage(new SurveyRepositoryError('server', 'x', 503), strings, site)).toBe('Algo salió mal (503).');
    expect(errorMessage(new Error('boom'), strings, site)).toBe('Algo salió mal (boom).');
  });
});
