/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-008
 */
import { summarize } from '../../../shared/logic/aggregation';
import type { IPerson, ISurveyRecord, Score } from '../../../shared/model/survey';
import type { IScorecardStrings } from './ITechnicianScorecardProps';
import { formatAverage, monthLabel, periodLabel, scorecardContext } from './scorecardText';

declare const __dirname: string;

const strings: IScorecardStrings = (function load(): IScorecardStrings {
  let result: IScorecardStrings | undefined;
  const define = (_deps: string[], factory: () => IScorecardStrings): void => {
    result = factory();
  };
  const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-require-imports
  const path = require('path'); // eslint-disable-line @typescript-eslint/no-require-imports
  new Function('define', fs.readFileSync(path.join(__dirname, '..', 'loc', 'es-es.js'), 'utf8'))(define); // eslint-disable-line no-new-func
  return result as IScorecardStrings;
})();

const ANA: IPerson = { email: 'ana.lopez@contoso.com', displayName: 'Ana López' };

function rec(scores: [Score, Score, Score, Score], comments?: string): ISurveyRecord {
  return {
    id: 1,
    ticketNumber: '1',
    technician: ANA,
    resolved: 'Sí',
    scores: { Understanding: scores[0], Speed: scores[1], Skill: scores[2], Communication: scores[3] },
    wouldRecommend: 'Sí',
    comments,
    created: new Date('2026-10-01T10:00:00Z')
  };
}

describe('scorecardText', () => {
  it('labels periods', () => {
    expect(periodLabel('quarter', strings)).toBe('Últimos 3 meses');
    expect(periodLabel('all', strings)).toBe('Todo el historial');
  });

  it('formats averages with one decimal for the locale', () => {
    expect(formatAverage(4.333, 'es-MX')).toBe('4.3');
    expect(formatAverage(4.333, 'es-ES')).toBe('4,3');
  });

  it('labels months in the user language', () => {
    expect(monthLabel('2026-09', 'en-US')).toMatch(/Sep/);
  });

  it('tells the model the numbers on screen, never the comments', () => {
    const records: ISurveyRecord[] = [1, 2, 3, 4, 5].map(() => rec([4, 2, 4, 5], 'Muy lento, pero amable'));
    const ctx = scorecardContext(ANA, 'quarter', summarize(records), false, strings, 'es-MX');
    expect(ctx.text).toBe(
      'El tablero muestra el desempeño de Ana López (Últimos 3 meses): 5 encuestas. Calificación general 3.8 de 5. Comprensión 4.0, Rapidez 2.0, Habilidad 4.0, Comunicación 5.0. Problema resuelto en el 100% de los casos; lo recomendarían el 100%. Fortaleza: Comunicación. Puede mejorar: Rapidez.'
    );
    expect(ctx.text).not.toContain('lento');
    expect(ctx.structured).toMatchObject({ strongest: 'Communication', weakest: 'Speed', demo: false });
  });

  it('says when data is insufficient and flags demo data', () => {
    const ctx = scorecardContext(ANA, 'month', summarize([rec([4, 4, 4, 4])]), true, strings, 'es-MX');
    expect(ctx.text).toContain('solo 1 encuesta(s)');
    expect(ctx.text).toContain('datos de demostración');
  });
});
