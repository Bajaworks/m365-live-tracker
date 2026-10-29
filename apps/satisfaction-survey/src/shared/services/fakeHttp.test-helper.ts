/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-012
 */
import type { HttpHeaders, IHttpPort, IHttpResponse } from './httpPort';

export interface IRecordedCall {
  method: 'GET' | 'POST';
  url: string;
  body?: string;
  headers?: HttpHeaders;
}

export type FakeRoute = (call: IRecordedCall) => { status: number; body?: unknown } | undefined;

/** Test double for IHttpPort: routes decide the response, every call is recorded. */
export class FakeHttp implements IHttpPort {
  public readonly calls: IRecordedCall[] = [];
  private readonly _routes: FakeRoute[];

  public constructor(routes: FakeRoute[]) {
    this._routes = routes;
  }

  public get(url: string, headers?: HttpHeaders): Promise<IHttpResponse> {
    return this._handle({ method: 'GET', url, headers });
  }

  public post(url: string, body: string, headers?: HttpHeaders): Promise<IHttpResponse> {
    return this._handle({ method: 'POST', url, body, headers });
  }

  private _handle(call: IRecordedCall): Promise<IHttpResponse> {
    this.calls.push(call);
    for (const route of this._routes) {
      const result: { status: number; body?: unknown } | undefined = route(call);
      if (result) {
        return Promise.resolve({
          ok: result.status >= 200 && result.status < 300,
          status: result.status,
          json: (): Promise<unknown> => Promise.resolve(result.body)
        });
      }
    }
    return Promise.resolve({ ok: false, status: 404, json: (): Promise<unknown> => Promise.resolve({}) });
  }
}
