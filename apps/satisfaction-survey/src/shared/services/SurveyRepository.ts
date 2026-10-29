/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-012
 */
import { FIELDS, TECHNICIAN_ID_FIELD } from '../config/fields';
import { SURVEY_LIST_TITLE } from '../config/settings';
import { periodStart } from '../logic/period';
import { validateSurvey, type ISurveyValidationResult } from '../logic/validation';
import {
  DIMENSION_KEYS,
  isRecommendValue,
  isResolvedValue,
  isScore,
  type DimensionKey,
  type ICurrentUser,
  type IPerson,
  type ISurveyDraft,
  type ISurveyRecord,
  type Period,
  type Score
} from '../model/survey';
import { READ_HEADERS, WRITE_HEADERS, type IHttpPort, type IHttpResponse } from './httpPort';

export type SurveyRepositoryErrorCode = 'invalid' | 'notFound' | 'forbidden' | 'network' | 'server' | 'unexpected';

/** Error with a code the UI can map to a localized message. */
export class SurveyRepositoryError extends Error {
  public readonly code: SurveyRepositoryErrorCode;
  public readonly status: number;

  public constructor(code: SurveyRepositoryErrorCode, message: string, status: number = 0) {
    super(message);
    this.code = code;
    this.status = status;
    // Keep instanceof working when compiled to ES5.
    Object.setPrototypeOf(this, SurveyRepositoryError.prototype);
  }
}

/** OData string literal: single quotes are doubled. */
export function odataString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function codeForStatus(status: number): SurveyRepositoryErrorCode {
  if (status === 401 || status === 403) {
    return 'forbidden';
  }
  if (status === 404) {
    return 'notFound';
  }
  if (status >= 500) {
    return 'server';
  }
  return 'unexpected';
}

function asObject(value: unknown): { [key: string]: unknown } {
  return value && typeof value === 'object' ? (value as { [key: string]: unknown }) : {};
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Expanded person field → IPerson (undefined when missing). */
function mapPerson(value: unknown): IPerson | undefined {
  const person: { [key: string]: unknown } = asObject(value);
  const email: string = asString(person.EMail);
  if (!email) {
    return undefined;
  }
  return { email, displayName: asString(person.Title) || email };
}

/**
 * List item (nometadata JSON) → ISurveyRecord.
 * Returns undefined for rows that do not match the contract, so one bad row
 * never breaks the scorecard.
 */
export function mapSurveyItem(raw: unknown): ISurveyRecord | undefined {
  const item: { [key: string]: unknown } = asObject(raw);
  const technician: IPerson | undefined = mapPerson(item[FIELDS.technician]);
  const resolved: unknown = item[FIELDS.resolved];
  const wouldRecommend: unknown = item[FIELDS.wouldRecommend];
  const created: Date = new Date(asString(item[FIELDS.created]));

  if (typeof item.Id !== 'number' || !technician || !isResolvedValue(resolved) || !isRecommendValue(wouldRecommend)) {
    return undefined;
  }
  if (isNaN(created.getTime())) {
    return undefined;
  }

  const scores: Partial<Record<DimensionKey, Score>> = {};
  for (const key of DIMENSION_KEYS) {
    const value: unknown = item[FIELDS[key]];
    if (!isScore(value)) {
      return undefined;
    }
    scores[key] = value;
  }

  const comments: string = asString(item[FIELDS.comments]).trim();
  return {
    id: item.Id,
    ticketNumber: asString(item[FIELDS.ticket]),
    technician,
    resolved,
    scores: scores as Record<DimensionKey, Score>,
    wouldRecommend,
    comments: comments.length > 0 ? comments : undefined,
    created
  };
}

const SELECT_FIELDS: string = [
  'Id',
  FIELDS.ticket,
  FIELDS.created,
  FIELDS.resolved,
  FIELDS.Understanding,
  FIELDS.Speed,
  FIELDS.Skill,
  FIELDS.Communication,
  FIELDS.wouldRecommend,
  FIELDS.comments,
  `${FIELDS.technician}/EMail`,
  `${FIELDS.technician}/Title`
].join(',');

/**
 * Reads and writes the "Encuestas" list with the signed-in user's identity.
 * Never touches SPFx types: it only talks to IHttpPort.
 */
export class SurveyRepository {
  private readonly _http: IHttpPort;
  private readonly _siteUrl: string;

  public constructor(http: IHttpPort, siteUrl: string) {
    this._http = http;
    this._siteUrl = siteUrl.replace(/\/+$/, '');
  }

  public get siteUrl(): string {
    return this._siteUrl;
  }

  private get _itemsUrl(): string {
    return `${this._siteUrl}/_api/web/lists/getbytitle(${odataString(SURVEY_LIST_TITLE)})/items`;
  }

  /** The signed-in user as a site user of the survey site. */
  public async getCurrentUser(): Promise<ICurrentUser> {
    const body: { [key: string]: unknown } = await this._getJson(
      `${this._siteUrl}/_api/web/currentuser?$select=Id,Email,Title`
    );
    if (typeof body.Id !== 'number') {
      throw new SurveyRepositoryError('unexpected', 'currentuser returned no Id');
    }
    return { id: body.Id, email: asString(body.Email), displayName: asString(body.Title) };
  }

  /** Existing response of this user for this ticket (RF-08), if any. */
  public async findExisting(ticketNumber: string, authorId: number): Promise<ISurveyRecord | undefined> {
    const filter: string = `${FIELDS.ticket} eq ${odataString(ticketNumber.trim())} and AuthorId eq ${authorId}`;
    const items: unknown[] = await this._getItems(
      `${this._itemsUrl}?$select=${SELECT_FIELDS}&$expand=${FIELDS.technician}&$filter=${encodeURIComponent(filter)}&$top=1`
    );
    return items.length > 0 ? mapSurveyItem(items[0]) : undefined;
  }

  /** Email/UPN → site user Id (person fields are written by Id). */
  public async ensureUserId(email: string): Promise<number> {
    const response: IHttpResponse = await this._send(() =>
      this._http.post(`${this._siteUrl}/_api/web/ensureuser`, JSON.stringify({ logonName: email }), WRITE_HEADERS)
    );
    const body: { [key: string]: unknown } = asObject(await response.json());
    if (typeof body.Id !== 'number') {
      throw new SurveyRepositoryError('unexpected', `ensureuser returned no Id for ${email}`);
    }
    return body.Id;
  }

  /** Validates and creates a response. Returns the new item Id. */
  public async create(draft: ISurveyDraft): Promise<number> {
    const validation: ISurveyValidationResult = validateSurvey(draft);
    if (!validation.valid || !draft.technician) {
      throw new SurveyRepositoryError('invalid', 'The survey is not complete.');
    }

    const technicianId: number = await this.ensureUserId(draft.technician.email);
    const payload: { [key: string]: unknown } = {
      [FIELDS.ticket]: draft.ticketNumber.trim(),
      [TECHNICIAN_ID_FIELD]: technicianId,
      [FIELDS.resolved]: draft.resolved,
      [FIELDS.wouldRecommend]: draft.wouldRecommend,
      [FIELDS.comments]: (draft.comments || '').trim()
    };
    DIMENSION_KEYS.forEach((key) => {
      payload[FIELDS[key]] = draft.scores[key];
    });

    const response: IHttpResponse = await this._send(() =>
      this._http.post(this._itemsUrl, JSON.stringify(payload), WRITE_HEADERS)
    );
    const created: { [key: string]: unknown } = asObject(await response.json());
    if (typeof created.Id !== 'number') {
      throw new SurveyRepositoryError('unexpected', 'The new item has no Id.');
    }
    return created.Id;
  }

  /** Responses for one technician in a period, newest first. */
  public async getByTechnician(email: string, period: Period, now: Date = new Date()): Promise<ISurveyRecord[]> {
    const parts: string[] = [`${FIELDS.technician}/EMail eq ${odataString(email)}`];
    const from: Date | undefined = periodStart(period, now);
    if (from) {
      parts.push(`${FIELDS.created} ge datetime'${from.toISOString()}'`);
    }
    const items: unknown[] = await this._getItems(
      `${this._itemsUrl}?$select=${SELECT_FIELDS}&$expand=${FIELDS.technician}` +
        `&$filter=${encodeURIComponent(parts.join(' and '))}&$orderby=${FIELDS.created} desc&$top=5000`
    );
    const records: ISurveyRecord[] = [];
    items.forEach((raw) => {
      const record: ISurveyRecord | undefined = mapSurveyItem(raw);
      if (record) {
        records.push(record);
      }
    });
    return records;
  }

  /** Distinct technicians that have at least one response (to resolve names). */
  public async listTechnicians(): Promise<IPerson[]> {
    const items: unknown[] = await this._getItems(
      `${this._itemsUrl}?$select=${FIELDS.technician}/EMail,${FIELDS.technician}/Title&$expand=${FIELDS.technician}&$top=5000`
    );
    const byEmail: { [email: string]: IPerson } = {};
    items.forEach((raw) => {
      const person: IPerson | undefined = mapPerson(asObject(raw)[FIELDS.technician]);
      if (person) {
        byEmail[person.email.toLowerCase()] = person;
      }
    });
    return Object.keys(byEmail)
      .map((key) => byEmail[key])
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  private async _send(request: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    let response: IHttpResponse;
    try {
      response = await request();
    } catch (error) {
      throw new SurveyRepositoryError('network', error instanceof Error ? error.message : 'Network error');
    }
    if (!response.ok) {
      throw new SurveyRepositoryError(codeForStatus(response.status), `SharePoint returned ${response.status}`, response.status);
    }
    return response;
  }

  private async _getJson(url: string): Promise<{ [key: string]: unknown }> {
    const response: IHttpResponse = await this._send(() => this._http.get(url, READ_HEADERS));
    return asObject(await response.json());
  }

  private async _getItems(url: string): Promise<unknown[]> {
    const body: { [key: string]: unknown } = await this._getJson(url);
    return Array.isArray(body.value) ? body.value : [];
  }
}
