/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-012
 */
import { SPHttpClient, type ISPHttpClientOptions, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { HttpHeaders, IHttpPort, IHttpResponse } from './httpPort';

function wrap(response: SPHttpClientResponse): IHttpResponse {
  return {
    ok: response.ok,
    status: response.status,
    json: (): Promise<unknown> => response.json()
  };
}

/**
 * Adapts the component's delegated SPHttpClient (signed-in user, SSO through the
 * SPFx broker) to the narrow IHttpPort. This is the only file in shared/ that
 * imports @microsoft/sp-http.
 */
export function createSpHttpPort(client: SPHttpClient): IHttpPort {
  return {
    get: async (url: string, headers?: HttpHeaders): Promise<IHttpResponse> => {
      const response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1, { headers });
      return wrap(response);
    },
    post: async (url: string, body: string, headers?: HttpHeaders): Promise<IHttpResponse> => {
      const options: ISPHttpClientOptions = { headers, body };
      const response: SPHttpClientResponse = await client.post(url, SPHttpClient.configurations.v1, options);
      return wrap(response);
    }
  };
}
