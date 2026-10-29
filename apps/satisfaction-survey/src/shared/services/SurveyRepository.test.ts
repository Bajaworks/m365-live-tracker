/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-012
 */
import type { ISurveyDraft } from '../model/survey';
import { FakeHttp } from './fakeHttp.test-helper';
import { mapSurveyItem, odataString, SurveyRepository, SurveyRepositoryError } from './SurveyRepository';

const SITE: string = 'https://contoso.sharepoint.com/sites/encuestas';

function rawItem(overrides: { [key: string]: unknown } = {}): { [key: string]: unknown } {
  return {
    Id: 7,
    Title: '1234',
    Created: '2026-10-01T15:00:00Z',
    m365live_Resolved: 'Sí',
    m365live_Understanding: 5,
    m365live_Speed: 2,
    m365live_Skill: 4,
    m365live_Communication: 5,
    m365live_WouldRecommend: 'Sí',
    m365live_Comments: '  Amable pero lenta  ',
    m365live_Technician: { EMail: 'ana.lopez@contoso.com', Title: 'Ana López' },
    ...overrides
  };
}

const draft: ISurveyDraft = {
  ticketNumber: ' 4521 ',
  technician: { email: 'ana.lopez@contoso.com', displayName: 'Ana López' },
  resolved: 'Sí',
  scores: { Understanding: 5, Speed: 4, Skill: 5, Communication: 4 },
  wouldRecommend: 'Sí',
  comments: ''
};

describe('odataString', () => {
  it('doubles single quotes', () => {
    expect(odataString("O'Brien")).toBe("'O''Brien'");
  });
});

describe('mapSurveyItem', () => {
  it('maps a list item to a record', () => {
    const record = mapSurveyItem(rawItem());
    expect(record).toEqual({
      id: 7,
      ticketNumber: '1234',
      technician: { email: 'ana.lopez@contoso.com', displayName: 'Ana López' },
      resolved: 'Sí',
      scores: { Understanding: 5, Speed: 2, Skill: 4, Communication: 5 },
      wouldRecommend: 'Sí',
      comments: 'Amable pero lenta',
      created: new Date('2026-10-01T15:00:00Z')
    });
  });

  it('drops rows that break the contract', () => {
    expect(mapSurveyItem(rawItem({ m365live_Speed: 7 }))).toBeUndefined();
    expect(mapSurveyItem(rawItem({ m365live_Resolved: 'Quizá' }))).toBeUndefined();
    expect(mapSurveyItem(rawItem({ m365live_Technician: undefined }))).toBeUndefined();
    expect(mapSurveyItem(rawItem({ Created: 'not a date' }))).toBeUndefined();
    expect(mapSurveyItem('nope')).toBeUndefined();
  });

  it('turns an empty comment into undefined', () => {
    expect(mapSurveyItem(rawItem({ m365live_Comments: '   ' }))?.comments).toBeUndefined();
  });
});

describe('SurveyRepository', () => {
  it('creates a response: ensureuser, then POST with the prefixed fields', async () => {
    const http: FakeHttp = new FakeHttp([
      (c) => (c.url.endsWith('/_api/web/ensureuser') ? { status: 200, body: { Id: 12 } } : undefined),
      (c) => (c.method === 'POST' && c.url.endsWith('/items') ? { status: 201, body: { Id: 99 } } : undefined)
    ]);
    const repo: SurveyRepository = new SurveyRepository(http, `${SITE}/`);

    await expect(repo.create(draft)).resolves.toBe(99);

    expect(JSON.parse(http.calls[0].body || '{}')).toEqual({ logonName: 'ana.lopez@contoso.com' });
    expect(http.calls[1].url).toBe(`${SITE}/_api/web/lists/getbytitle('Encuestas')/items`);
    expect(JSON.parse(http.calls[1].body || '{}')).toEqual({
      Title: '4521',
      m365live_TechnicianId: 12,
      m365live_Resolved: 'Sí',
      m365live_WouldRecommend: 'Sí',
      m365live_Comments: '',
      m365live_Understanding: 5,
      m365live_Speed: 4,
      m365live_Skill: 5,
      m365live_Communication: 4
    });
    expect(http.calls[1].headers).toEqual({
      Accept: 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      'odata-version': ''
    });
  });

  it('refuses to write an incomplete survey', async () => {
    const http: FakeHttp = new FakeHttp([]);
    const repo: SurveyRepository = new SurveyRepository(http, SITE);
    await expect(repo.create({ ...draft, resolved: undefined })).rejects.toMatchObject({ code: 'invalid' });
    expect(http.calls.length).toBe(0);
  });

  it('maps HTTP errors to readable codes', async () => {
    const repo: SurveyRepository = new SurveyRepository(new FakeHttp([() => ({ status: 403 })]), SITE);
    const error: unknown = await repo.create(draft).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SurveyRepositoryError);
    expect((error as SurveyRepositoryError).code).toBe('forbidden');
    expect((error as SurveyRepositoryError).status).toBe(403);
  });

  it('reports network failures', async () => {
    const repo: SurveyRepository = new SurveyRepository(
      { get: () => Promise.reject(new Error('offline')), post: () => Promise.reject(new Error('offline')) },
      SITE
    );
    await expect(repo.getCurrentUser()).rejects.toMatchObject({ code: 'network' });
  });

  it('looks for an existing response by ticket and author', async () => {
    const http: FakeHttp = new FakeHttp([() => ({ status: 200, body: { value: [rawItem()] } })]);
    const repo: SurveyRepository = new SurveyRepository(http, SITE);
    const existing = await repo.findExisting(" 12'34 ", 5);
    expect(existing?.id).toBe(7);
    expect(decodeURIComponent(http.calls[0].url)).toContain("$filter=Title eq '12''34' and AuthorId eq 5");
  });

  it('filters by technician and Created for a period, skipping bad rows', async () => {
    const http: FakeHttp = new FakeHttp([
      () => ({ status: 200, body: { value: [rawItem(), rawItem({ Id: 8, m365live_Skill: 0 })] } })
    ]);
    const repo: SurveyRepository = new SurveyRepository(http, SITE);
    const records = await repo.getByTechnician('ana.lopez@contoso.com', 'quarter', new Date('2026-10-24T00:00:00Z'));
    expect(records.map((r) => r.id)).toEqual([7]);
    const url: string = decodeURIComponent(http.calls[0].url);
    expect(url).toContain("m365live_Technician/EMail eq 'ana.lopez@contoso.com'");
    expect(url).toContain("Created ge datetime'2026-07-24T00:00:00.000Z'");
    expect(url).toContain('$expand=m365live_Technician');
    expect(url).toContain('$orderby=Created desc');
  });

  it('does not filter by date for period "all"', async () => {
    const http: FakeHttp = new FakeHttp([() => ({ status: 200, body: { value: [] } })]);
    await new SurveyRepository(http, SITE).getByTechnician('ana.lopez@contoso.com', 'all');
    expect(decodeURIComponent(http.calls[0].url)).not.toContain('Created ge');
  });

  it('lists distinct technicians sorted by name', async () => {
    const http: FakeHttp = new FakeHttp([
      () => ({
        status: 200,
        body: {
          value: [
            { m365live_Technician: { EMail: 'Luis.Ramirez@contoso.com', Title: 'Luis Ramírez' } },
            { m365live_Technician: { EMail: 'ana.lopez@contoso.com', Title: 'Ana López' } },
            { m365live_Technician: { EMail: 'luis.ramirez@contoso.com', Title: 'Luis Ramírez' } },
            {}
          ]
        }
      })
    ]);
    const people = await new SurveyRepository(http, SITE).listTechnicians();
    expect(people.map((p) => p.displayName)).toEqual(['Ana López', 'Luis Ramírez']);
  });
});
