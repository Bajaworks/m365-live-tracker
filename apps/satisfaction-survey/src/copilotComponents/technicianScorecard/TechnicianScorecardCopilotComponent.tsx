/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + engineering-ai-engineer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-003, T-009
 *
 * Copilot UX component for the ShowTechnicianScorecard tool.
 *
 * Lifecycle:
 *  1. onInit()   — resolves the survey site and builds the data services. Never
 *                  throws: failures are shown in the UI with a Retry button.
 *  2. render()   — mounts React. The host calls it again on theme / display-mode
 *                  changes (inline ⇄ fullscreen) and on a new tool invocation;
 *                  new arguments reset the view.
 *  3. onTeardown — unmounts React.
 */
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { BaseCopilotComponent, createCopilotTextContent, type SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';

import { DEFAULT_SITE_PATH } from '../../shared/config/settings';
import { DEFAULT_PERIOD } from '../../shared/logic/period';
import { isPeriod, type Period } from '../../shared/model/survey';
import type { IHttpPort } from '../../shared/services/httpPort';
import { PeopleService } from '../../shared/services/PeopleService';
import { resolveSiteUrl, resolveSurveySiteUrl } from '../../shared/services/SiteResolver';
import { createSpHttpPort } from '../../shared/services/spHttpAdapter';
import { SurveyRepository } from '../../shared/services/SurveyRepository';
import TechnicianScorecard from './components/TechnicianScorecard';
import type { IScorecardServices, ITechnicianScorecardProps } from './components/ITechnicianScorecardProps';
import type { ITechnicianScorecardCopilotComponentProperties } from './TechnicianScorecardCopilotComponentProperties';

import * as strings from 'TechnicianScorecardCopilotComponentStrings';

const RESIZE_THRESHOLD: number = 8;

export default class TechnicianScorecardCopilotComponent extends BaseCopilotComponent<ITechnicianScorecardCopilotComponentProperties> {
  private _root: Root | undefined;
  private _services: IScorecardServices | undefined;
  private _initError: unknown;
  private _siteUrl: string = '';
  private _lastHeight: number = 0;
  private _resizeTimer: number | undefined;

  protected async onInit(): Promise<void> {
    await this._initServices();
  }

  protected render(): void {
    const properties: Partial<ITechnicianScorecardCopilotComponentProperties> = this.properties || {};
    const period: Period = isPeriod(properties.period) ? properties.period : DEFAULT_PERIOD;
    const props: ITechnicianScorecardProps = {
      technician: properties.technician,
      period,
      invocationKey: JSON.stringify({ t: properties.technician || '', p: period }),
      services: this._services,
      initError: this._initError,
      siteUrl: this._siteUrl,
      onRetryInit: this._retry,
      hostContext: this.hostContext,
      targetDocument: this.context.domElement.ownerDocument,
      strings,
      locale: this._locale(),
      onRequestDisplayMode: this._requestDisplayMode,
      onModelContext: this._updateModelContext,
      onContentHeight: this._onContentHeight
    };

    if (!this._root) {
      this._root = createRoot(this.context.domElement);
    }
    this._root.render(React.createElement(TechnicianScorecard, props));
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
      this._services = { siteUrl, repository: new SurveyRepository(http, siteUrl), people: new PeopleService(http, siteUrl) };
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

  private _requestDisplayMode = async (mode: SPCopilotDisplayMode): Promise<void> => {
    await this.requestDisplayModeAsync(mode);
  };

  private _updateModelContext = async (text: string, structured: { [key: string]: unknown }): Promise<void> => {
    await this.context.copilotBridge.updateModelContextAsync({
      content: [createCopilotTextContent(text)],
      structuredContent: structured
    });
  };

  /** Fits the inline card to its content (fullscreen is sized by the host). */
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
      this._lastHeight = height;
      this.requestSizeChangeAsync(width, Math.min(Math.ceil(height), maxHeight)).catch(() => undefined);
    }, 150);
  };
}
