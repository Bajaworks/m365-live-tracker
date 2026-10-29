/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-012
 */

/**
 * Narrow HTTP port used by the data services.
 *
 * The services never import SPFx types, so they can be unit-tested with a fake.
 * Each component adapts its delegated SPHttpClient to this port
 * (see spHttpAdapter.ts) — the same pattern as Microsoft's time-off-absence sample.
 */
export interface IHttpResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type HttpHeaders = { [name: string]: string };

export interface IHttpPort {
  get(url: string, headers?: HttpHeaders): Promise<IHttpResponse>;
  post(url: string, body: string, headers?: HttpHeaders): Promise<IHttpResponse>;
}

/** JSON without OData metadata. */
export const NO_METADATA: string = 'application/json;odata=nometadata';

/**
 * Headers for SharePoint REST writes. The empty `odata-version` overrides the
 * OData v4 header SPHttpClient adds by default, which otherwise conflicts with
 * the "nometadata" verbose-style payload (as done in time-off-absence).
 */
export const WRITE_HEADERS: HttpHeaders = {
  Accept: NO_METADATA,
  'Content-Type': NO_METADATA,
  'odata-version': ''
};

export const READ_HEADERS: HttpHeaders = {
  Accept: NO_METADATA
};
