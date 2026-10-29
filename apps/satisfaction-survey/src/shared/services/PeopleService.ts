/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */
import type { IPerson } from '../model/survey';
import { WRITE_HEADERS, type IHttpPort, type IHttpResponse } from './httpPort';

/** Lower-case, accent-free, single-spaced text for name matching. */
export function normalizeName(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

interface IPickerEntity {
  Key?: string;
  DisplayText?: string;
  EntityData?: { Email?: string };
}

/** Claims key "i:0#.f|membership|user@contoso.com" → "user@contoso.com". */
function emailFromKey(key: string): string {
  const parts: string[] = key.split('|');
  const last: string = parts[parts.length - 1];
  return last.indexOf('@') > 0 ? last : '';
}

/** Parses the People Picker response (its `value` is a JSON string). */
export function parsePeoplePickerResponse(body: unknown): IPerson[] {
  const raw: unknown = body && typeof body === 'object' ? (body as { value?: unknown }).value : undefined;
  if (typeof raw !== 'string') {
    return [];
  }
  let entities: IPickerEntity[];
  try {
    const parsed: unknown = JSON.parse(raw);
    entities = Array.isArray(parsed) ? (parsed as IPickerEntity[]) : [];
  } catch {
    return [];
  }
  const people: IPerson[] = [];
  entities.forEach((entity) => {
    const email: string = (entity.EntityData && entity.EntityData.Email) || emailFromKey(entity.Key || '');
    if (email) {
      people.push({ email, displayName: entity.DisplayText || email });
    }
  });
  return people;
}

/**
 * Picks the person a free-text parameter refers to ("Ana López" or an email).
 * Returns undefined when it is ambiguous, so the UI asks instead of guessing.
 */
export function pickBestMatch(query: string, candidates: IPerson[]): IPerson | undefined {
  const q: string = normalizeName(query);
  if (!q || candidates.length === 0) {
    return undefined;
  }
  const byEmail: IPerson[] = candidates.filter((p) => p.email.toLowerCase() === q);
  if (byEmail.length === 1) {
    return byEmail[0];
  }
  const exact: IPerson[] = candidates.filter((p) => normalizeName(p.displayName) === q);
  if (exact.length === 1) {
    return exact[0];
  }
  return candidates.length === 1 ? candidates[0] : undefined;
}

export interface IPeopleService {
  search(query: string): Promise<IPerson[]>;
  photoUrl(email: string): string;
}

/** People search through the SharePoint People Picker (no Graph permissions needed). */
export class PeopleService implements IPeopleService {
  private readonly _http: IHttpPort;
  private readonly _siteUrl: string;

  public constructor(http: IHttpPort, siteUrl: string) {
    this._http = http;
    this._siteUrl = siteUrl.replace(/\/+$/, '');
  }

  public async search(query: string): Promise<IPerson[]> {
    const text: string = (query || '').trim();
    if (text.length < 2) {
      return [];
    }
    const body: string = JSON.stringify({
      queryParams: {
        QueryString: text,
        MaximumEntitySuggestions: 8,
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        PrincipalSource: 15,
        PrincipalType: 1
      }
    });
    const response: IHttpResponse = await this._http.post(
      `${this._siteUrl}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`,
      body,
      WRITE_HEADERS
    );
    if (!response.ok) {
      return [];
    }
    return parsePeoplePickerResponse(await response.json());
  }

  public photoUrl(email: string): string {
    return `${this._siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=${encodeURIComponent(email)}`;
  }
}
