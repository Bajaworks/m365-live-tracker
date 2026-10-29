/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-004, T-008
 *
 * Copilot UX component for the OpenSatisfactionSurvey tool.
 *
 * Lifecycle:
 *  1. onInit()   — resolves the survey site (tenant property or /sites/encuestas),
 *                  builds the data services and loads the signed-in user. Never
 *                  throws: a failure is shown in the UI with a Retry button.
 *  2. render()   — mounts React into context.domElement. The host calls it again
 *                  on theme / display-mode changes and on a new tool invocation;
 *                  a change in the tool arguments resets the form.
 *  3. onTeardown — unmounts React.
 */
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { BaseCopilotComponent, createCopilotTextContent } from '@microsoft/sp-copilot-component';

import { DEFAULT_SITE_PATH } from '../../shared/config/settings';
import type { IHttpPort } from '../../shared/services/httpPort';
import { PeopleService } from '../../shared/services/PeopleService';
import { resolveSiteUrl, resolveSurveySiteUrl } from '../../shared/services/SiteResolver';
import { createSpHttpPort } from '../../shared/services/spHttpAdapter';
import { SurveyRepository } from '../../shared/services/SurveyRepository';
import SatisfactionSurveyForm from './components/SatisfactionSurveyForm';
import type { ISatisfactionSurveyFormProps, ISurveyServices } from './components/ISatisfactionSurveyFormProps';
import type { ISatisfactionSurveyFormCopilotComponentProperties } from './SatisfactionSurveyFormCopilotComponentProperties';

import * as strings from 'SatisfactionSurveyFormCopilotComponentStrings';

/** Minimum height change (px) worth asking the host to resize for. */
const RESIZE_THRESHOLD: number = 8;

export default class SatisfactionSurveyFormCopilotComponent extends BaseCopilotComponent<ISatisfactionSurveyFormCopilotComponentProperties> {
  private _root: Root | undefined;
  private _services: ISurveyServices | undefined;
  private _initError: unknown;
  private _siteUrl: string = '';
  private _lastHeight: number = 0;
  private _resizeTimer: number | undefined;

  protected async onInit(): Promise<void> {
    await this._initServices();
  }

  protected render(): void {
    const properties: ISatisfactionSurveyFormCopilotComponentProperties = this.properties || {};
    const props: ISatisfactionSurveyFormProps = {
      initialTicket: properties.ticketNumber,
      initialTechnician: properties.technician,
      // A new tool call with different arguments resets the form.
      invocationKey: JSON.stringify({ t: properties.ticketNumber || '', p: properties.technician || '' }),
      services: this._services,
      initError: this._initError,
      siteUrl: this._siteUrl,
      onRetryInit: this._retry,
      hostContext: this.hostContext,
      targetDocument: this.context.domElement.ownerDocument,
      strings,
      locale: this._locale(),
      onFollowUp: this._sendFollowUp,
      onModelContext: this._updateModelContext,
      onContentHeight: this._onContentHeight
    };

    if (!this._root) {
      this._root = createRoot(this.context.domElement);
    }
    this._root.render(React.createElement(SatisfactionSurveyForm, props));
  }

  protected async onTeardown(): Promise<void> {
    if (this._resizeTimer !== undefined) {
      window.clearTimeout(this._resizeTimer);
    }
    this._root?.unmount();
    this._root = undefined;
  }

  private async _initServices(): Promise<void> {
    this._services = undefined;
    this._initError = undefined;
    const ambientWebUrl: string = this.context.pageContext.web.absoluteUrl;
    this._siteUrl = resolveSiteUrl(ambientWebUrl, DEFAULT_SITE_PATH);
    try {
      const http: IHttpPort = createSpHttpPort(this.context.spHttpClient);
      const siteUrl: string = await resolveSurveySiteUrl(http, ambientWebUrl);
      this._siteUrl = siteUrl;
      const repository: SurveyRepository = new SurveyRepository(http, siteUrl);
      const currentUser = await repository.getCurrentUser();
      this._services = { siteUrl, repository, people: new PeopleService(http, siteUrl), currentUser };
    } catch (error) {
      this._initError = error;
    }
  }

  private _locale(): string | undefined {
    const culture: { currentUICultureName?: string } | undefined = this.context.pageContext.cultureInfo;
    return culture && culture.currentUICultureName ? culture.currentUICultureName : undefined;
  }

  private _retry = (): void => {
    this._services = undefined;
    this._initError = undefined;
    this.render();
    this._initServices()
      .then(() => this.render())
      .catch(() => this.render());
  };

  private _sendFollowUp = async (text: string): Promise<void> => {
    await this.context.copilotBridge.sendFollowUpMessageAsync([createCopilotTextContent(text)]);
  };

  private _updateModelContext = async (text: string, structured: { [key: string]: unknown }): Promise<void> => {
    await this.context.copilotBridge.updateModelContextAsync({
      content: [createCopilotTextContent(text)],
      structuredContent: structured
    });
  };

  /** Asks the host to fit the inline card to the form (debounced). */
  private _onContentHeight = (height: number): void => {
    if (this.hostContext.displayMode === 'fullscreen' || Math.abs(height - this._lastHeight) < RESIZE_THRESHOLD) {
      return;
    }
    if (this._resizeTimer !== undefined) {
      window.clearTimeout(this._resizeTimer);
    }
    this._resizeTimer = window.setTimeout(() => {
      this._resizeTimer = undefined;
      const dimensions = this.hostContext.containerDimensions;
      const maxHeight: number = dimensions && dimensions.maxHeight ? dimensions.maxHeight : height;
      const width: number = (dimensions && dimensions.width) || this.context.domElement.clientWidth;
      const target: number = Math.min(Math.ceil(height), maxHeight);
      this._lastHeight = height;
      this.requestSizeChangeAsync(width, target).catch(() => undefined);
    }, 150);
  };
}
