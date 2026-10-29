/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */
import type { IPerson } from '../model/survey';
import { FakeHttp } from './fakeHttp.test-helper';
import { normalizeName, parsePeoplePickerResponse, PeopleService, pickBestMatch } from './PeopleService';

const ANA: IPerson = { email: 'ana.lopez@contoso.com', displayName: 'Ana López' };
const ANA2: IPerson = { email: 'ana.ruiz@contoso.com', displayName: 'Ana Ruiz' };

describe('normalizeName', () => {
  it('ignores accents, case and extra spaces', () => {
    expect(normalizeName('  Ána   LÓPEZ ')).toBe('ana lopez');
  });
});

describe('parsePeoplePickerResponse', () => {
  it('reads the JSON string in value', () => {
    const body = {
      value: JSON.stringify([
        { Key: 'i:0#.f|membership|ana.lopez@contoso.com', DisplayText: 'Ana López', EntityData: { Email: '' } },
        { Key: 'i:0#.f|membership|luis@contoso.com', DisplayText: 'Luis', EntityData: { Email: 'luis@contoso.com' } },
        { Key: 'c:0(.s|true', DisplayText: 'Everyone' }
      ])
    };
    expect(parsePeoplePickerResponse(body)).toEqual([ANA, { email: 'luis@contoso.com', displayName: 'Luis' }]);
  });

  it('tolerates bad payloads', () => {
    expect(parsePeoplePickerResponse({ value: 'not json' })).toEqual([]);
    expect(parsePeoplePickerResponse(undefined)).toEqual([]);
  });
});

describe('pickBestMatch', () => {
  it('matches an email exactly', () => {
    expect(pickBestMatch('ANA.LOPEZ@contoso.com', [ANA2, ANA])).toBe(ANA);
  });

  it('matches a name without accents', () => {
    expect(pickBestMatch('ana lopez', [ANA2, ANA])).toBe(ANA);
  });

  it('returns the only candidate', () => {
    expect(pickBestMatch('Ana', [ANA])).toBe(ANA);
  });

  it('does not guess when ambiguous', () => {
    expect(pickBestMatch('Ana', [ANA, ANA2])).toBeUndefined();
  });
});

describe('PeopleService', () => {
  it('searches people only (PrincipalType 1) on the survey site', async () => {
    const http: FakeHttp = new FakeHttp([() => ({ status: 200, body: { value: '[]' } })]);
    await new PeopleService(http, 'https://contoso.sharepoint.com/sites/encuestas').search('ana');
    expect(http.calls[0].url).toBe(
      'https://contoso.sharepoint.com/sites/encuestas/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser'
    );
    expect(JSON.parse(http.calls[0].body || '{}').queryParams).toMatchObject({ QueryString: 'ana', PrincipalType: 1 });
  });

  it('does not call the server for very short queries', async () => {
    const http: FakeHttp = new FakeHttp([]);
    await expect(new PeopleService(http, 'https://x').search('a')).resolves.toEqual([]);
    expect(http.calls.length).toBe(0);
  });
});
