/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-011
 */
import type { IHttpPort } from './httpPort';
import { FakeHttp } from './fakeHttp.test-helper';
import { resolveSitePath, resolveSiteUrl, resolveSurveySiteUrl } from './SiteResolver';

const ROOT: string = 'https://contoso.sharepoint.com';

describe('resolveSiteUrl', () => {
  it('takes only the origin of the ambient web', () => {
    expect(resolveSiteUrl(`${ROOT}/sites/other/`, '/sites/encuestas')).toBe(`${ROOT}/sites/encuestas`);
  });

  it('accepts a path without a leading slash', () => {
    expect(resolveSiteUrl(ROOT, 'sites/encuestas/')).toBe(`${ROOT}/sites/encuestas`);
  });

  it('uses a full URL as-is', () => {
    expect(resolveSiteUrl(ROOT, 'https://fabrikam.sharepoint.com/sites/x/')).toBe(
      'https://fabrikam.sharepoint.com/sites/x'
    );
  });

  it('falls back to the ambient web when there is no path', () => {
    expect(resolveSiteUrl(`${ROOT}/`, '')).toBe(ROOT);
  });
});

describe('resolveSitePath', () => {
  it('uses the tenant property when it has a value', async () => {
    const http: FakeHttp = new FakeHttp([
      (c) => (c.url.indexOf("GetStorageEntity('SatisfactionSurveySite')") >= 0 ? { status: 200, body: { Value: ' /sites/hr ' } } : undefined)
    ]);
    await expect(resolveSitePath(http, ROOT)).resolves.toBe('/sites/hr');
    expect(http.calls[0].url).toBe(`${ROOT}/_api/web/GetStorageEntity('SatisfactionSurveySite')`);
  });

  it('falls back to /sites/encuestas when the property is empty', async () => {
    const http: FakeHttp = new FakeHttp([() => ({ status: 200, body: { Value: null } })]);
    await expect(resolveSitePath(http, ROOT)).resolves.toBe('/sites/encuestas');
  });

  it('falls back when the call fails or throws', async () => {
    await expect(resolveSitePath(new FakeHttp([() => ({ status: 500 })]), ROOT)).resolves.toBe('/sites/encuestas');
    const throwing: IHttpPort = {
      get: () => Promise.reject(new Error('offline')),
      post: () => Promise.reject(new Error('offline'))
    };
    await expect(resolveSitePath(throwing, ROOT)).resolves.toBe('/sites/encuestas');
  });

  it('resolves the full survey site URL', async () => {
    await expect(resolveSurveySiteUrl(new FakeHttp([]), ROOT)).resolves.toBe(`${ROOT}/sites/encuestas`);
  });
});
