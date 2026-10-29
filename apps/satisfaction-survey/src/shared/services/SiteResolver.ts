/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-011
 */
import { DEFAULT_SITE_PATH, SITE_STORAGE_ENTITY } from '../config/settings';
import { READ_HEADERS, type IHttpPort, type IHttpResponse } from './httpPort';

/**
 * Finds the site that holds the "Encuestas" list (RF-19).
 *
 * Inside Microsoft 365 Copilot there is no current SharePoint page and
 * pageContext.web.absoluteUrl is the tenant ROOT, so only its origin is used.
 * The site path is the compiled-in DEFAULT_SITE_PATH unless an admin set the
 * SITE_STORAGE_ENTITY tenant property (a path or a full URL).
 */

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Combines the ambient origin with a server-relative path; a full URL wins as-is. */
export function resolveSiteUrl(ambientWebUrl: string, sitePathOrUrl: string): string {
  const ambient: string = trimTrailingSlashes((ambientWebUrl || '').trim());
  const path: string = (sitePathOrUrl || '').trim();

  if (path.length === 0) {
    return ambient;
  }
  if (/^https?:\/\//i.test(path)) {
    return trimTrailingSlashes(path);
  }

  const origin: RegExpExecArray | null = /^(https?:\/\/[^/]+)/i.exec(ambient);
  if (!origin) {
    return ambient;
  }
  const normalized: string = path.charAt(0) === '/' ? path : `/${path}`;
  return origin[1] + trimTrailingSlashes(normalized);
}

/**
 * Reads the tenant property. Never throws: any failure returns the fallback,
 * so rendering is never blocked.
 */
export async function resolveSitePath(
  http: IHttpPort,
  ambientWebUrl: string,
  fallbackPath: string = DEFAULT_SITE_PATH
): Promise<string> {
  const ambient: string = trimTrailingSlashes((ambientWebUrl || '').trim());
  if (ambient.length === 0) {
    return fallbackPath;
  }

  try {
    const response: IHttpResponse = await http.get(
      `${ambient}/_api/web/GetStorageEntity('${SITE_STORAGE_ENTITY}')`,
      READ_HEADERS
    );
    if (!response.ok) {
      return fallbackPath;
    }
    const body: unknown = await response.json();
    const value: unknown = body && typeof body === 'object' ? (body as { Value?: unknown }).Value : undefined;
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  } catch {
    // Best effort: fall back to the default path.
  }
  return fallbackPath;
}

/** Ambient web URL → absolute URL of the survey site. */
export async function resolveSurveySiteUrl(http: IHttpPort, ambientWebUrl: string): Promise<string> {
  const path: string = await resolveSitePath(http, ambientWebUrl);
  return resolveSiteUrl(ambientWebUrl, path);
}
