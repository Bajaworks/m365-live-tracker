/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ux-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-004, T-005, T-007, T-008
 */
import * as React from 'react';
import {
  Body1,
  Button,
  Caption1,
  Divider,
  Field,
  FluentProvider,
  IdPrefixProvider,
  Input,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Subtitle2,
  Textarea,
  Title3,
  tokens
} from '@fluentui/react-components';
import { ArrowClockwise16Regular, ChartMultiple20Regular, Send20Regular } from '@fluentui/react-icons';

import { COMMENT_MAX_LENGTH, TICKET_MAX_LENGTH } from '../../../shared/config/settings';
import { firstName, format } from '../../../shared/logic/text';
import { validateSurvey, type ISurveyValidationResult } from '../../../shared/logic/validation';
import {
  DIMENSIONS,
  type DimensionKey,
  type IPerson,
  type ISurveyDraft,
  type ISurveyRecord,
  type RecommendValue,
  type ResolvedValue,
  type Score
} from '../../../shared/model/survey';
import { pickBestMatch } from '../../../shared/services/PeopleService';
import { ChoiceGroup, type IChoiceOption } from '../../../shared/ui/ChoiceGroup';
import { PersonField } from '../../../shared/ui/PersonField';
import { RatingScale } from '../../../shared/ui/RatingScale';
import { themeFor, themeToCssVars } from '../../../shared/ui/themeVars';
import type { ICopilotSurveyStrings, ISatisfactionSurveyFormProps, ISurveyAnswer } from './ISatisfactionSurveyFormProps';
import { SurveySummary } from './SurveySummary';
import { errorMessage, existingContext, submittedContext, validationMessage } from './surveyText';

type Phase = 'form' | 'submitting' | 'existing' | 'submitted';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    boxSizing: 'border-box'
  },
  header: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  subtle: { color: tokens.colorNeutralForeground2 },
  context: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 1fr) minmax(0, 2fr)',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': { gridTemplateColumns: 'minmax(0, 1fr)' }
  },
  section: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  sectionTitle: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  ratings: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: tokens.spacingHorizontalM },
  actions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  error: { color: tokens.colorPaletteRedForeground1 }
});

const DIMENSION_TEXT: { [key: string]: { label: keyof ICopilotSurveyStrings; question: keyof ICopilotSurveyStrings } } = {
  Understanding: { label: 'DimUnderstanding', question: 'QUnderstanding' },
  Speed: { label: 'DimSpeed', question: 'QSpeed' },
  Skill: { label: 'DimSkill', question: 'QSkill' },
  Communication: { label: 'DimCommunication', question: 'QCommunication' }
};

function emptyDraft(ticket?: string): ISurveyDraft {
  return { ticketNumber: (ticket || '').trim(), technician: undefined, scores: {}, comments: '' };
}

function toAnswer(record: ISurveyRecord | ISurveyDraft): ISurveyAnswer | undefined {
  const r: ISurveyDraft & Partial<ISurveyRecord> = record as ISurveyDraft & Partial<ISurveyRecord>;
  if (!r.technician || !r.resolved || !r.wouldRecommend) {
    return undefined;
  }
  const scores: Partial<Record<DimensionKey, Score>> = r.scores;
  if (DIMENSIONS.some((d) => scores[d.key] === undefined)) {
    return undefined;
  }
  return {
    ticketNumber: r.ticketNumber.trim(),
    technician: r.technician,
    resolved: r.resolved,
    scores: scores as Record<DimensionKey, Score>,
    wouldRecommend: r.wouldRecommend,
    comments: (r.comments || '').trim() || undefined
  };
}

export default function SatisfactionSurveyForm(props: ISatisfactionSurveyFormProps): React.ReactElement {
  const {
    initialTicket,
    initialTechnician,
    invocationKey,
    services,
    initError,
    siteUrl,
    onRetryInit,
    hostContext,
    targetDocument,
    strings,
    locale,
    onFollowUp,
    onModelContext,
    onContentHeight
  } = props;
  const styles = useStyles();
  const theme = themeFor(hostContext.theme);
  const rootRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [draft, setDraft] = React.useState<ISurveyDraft>(() => emptyDraft(initialTicket));
  const [technicianQuery, setTechnicianQuery] = React.useState<string>(initialTechnician || '');
  const [touched, setTouched] = React.useState<{ [field: string]: boolean }>({});
  const [phase, setPhase] = React.useState<Phase>('form');
  const [shownAnswer, setShownAnswer] = React.useState<ISurveyAnswer | undefined>(undefined);
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);

  // New tool invocation → start over with the new arguments.
  React.useEffect(() => {
    setDraft(emptyDraft(initialTicket));
    setTechnicianQuery(initialTechnician || '');
    setTouched({});
    setPhase('form');
    setShownAnswer(undefined);
    setSubmitError(undefined);
  }, [invocationKey]);

  // Resolve the technician named in the tool arguments (only if unambiguous).
  React.useEffect(() => {
    if (!services || !initialTechnician) {
      return undefined;
    }
    let cancelled: boolean = false;
    services.people.search(initialTechnician).then(
      (found) => {
        const match: IPerson | undefined = pickBestMatch(initialTechnician, found);
        if (!cancelled && match) {
          setDraft((d) => (d.technician ? d : { ...d, technician: match }));
        }
      },
      () => undefined
    );
    return () => {
      cancelled = true;
    };
  }, [services, invocationKey]);

  // Already answered? Checked while typing the ticket (debounced) — RF-08.
  React.useEffect(() => {
    const ticket: string = draft.ticketNumber.trim();
    if (!services || phase !== 'form' || ticket.length === 0) {
      return undefined;
    }
    let cancelled: boolean = false;
    const timer: number = window.setTimeout(() => {
      services.repository.findExisting(ticket, services.currentUser.id).then(
        (existing) => {
          const answer: ISurveyAnswer | undefined = existing ? toAnswer(existing) : undefined;
          if (!cancelled && answer) {
            setShownAnswer(answer);
            setPhase('existing');
            const ctx = existingContext(answer, strings);
            onModelContext(ctx.text, ctx.structured).catch(() => undefined);
          }
        },
        () => undefined
      );
    }, 600);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [draft.ticketNumber, services, phase]);

  // Report the content height so the inline card fits the form.
  React.useEffect(() => {
    const element: HTMLDivElement | null = rootRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer: ResizeObserver = new ResizeObserver(() => onContentHeight(element.scrollHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, [onContentHeight]);

  const validation: ISurveyValidationResult = validateSurvey(draft);
  const missing: number = Object.keys(validation.errors).length;

  const update = (patch: Partial<ISurveyDraft>, field: string): void => {
    setDraft((d) => ({ ...d, ...patch }));
    setTouched((t) => ({ ...t, [field]: true }));
    setSubmitError(undefined);
  };

  const errorFor = (field: keyof ISurveyValidationResult['errors']): string | undefined =>
    touched[field] ? validationMessage(validation.errors[field], strings) : undefined;

  const submit = async (): Promise<void> => {
    if (!services) {
      return;
    }
    if (!validation.valid) {
      const all: { [field: string]: boolean } = {};
      Object.keys(validation.errors).forEach((k) => {
        all[k] = true;
      });
      setTouched((t) => ({ ...t, ...all }));
      return;
    }
    setPhase('submitting');
    setSubmitError(undefined);
    try {
      const existing: ISurveyRecord | undefined = await services.repository.findExisting(
        draft.ticketNumber,
        services.currentUser.id
      );
      const existingAnswer: ISurveyAnswer | undefined = existing ? toAnswer(existing) : undefined;
      if (existingAnswer) {
        setShownAnswer(existingAnswer);
        setPhase('existing');
        return;
      }
      await services.repository.create(draft);
      const answer: ISurveyAnswer | undefined = toAnswer(draft);
      setShownAnswer(answer);
      setPhase('submitted');
      if (answer) {
        const ctx = submittedContext(answer, strings);
        onModelContext(ctx.text, ctx.structured).catch(() => undefined);
      }
    } catch (error) {
      setSubmitError(errorMessage(error, strings, services.siteUrl));
      setPhase('form');
    }
  };

  const rateAnother = (): void => {
    setDraft(emptyDraft());
    setTechnicianQuery('');
    setTouched({});
    setShownAnswer(undefined);
    setPhase('form');
  };

  const resolvedOptions: ReadonlyArray<IChoiceOption<ResolvedValue>> = [
    { value: 'Sí', label: strings.ResolvedYes },
    { value: 'Parcialmente', label: strings.ResolvedPartial },
    { value: 'No', label: strings.ResolvedNo }
  ];
  const recommendOptions: ReadonlyArray<IChoiceOption<RecommendValue>> = [
    { value: 'Sí', label: strings.RecommendYes },
    { value: 'No', label: strings.RecommendNo },
    { value: 'No estoy seguro', label: strings.RecommendUnsure }
  ];
  const scaleLabels: ReadonlyArray<string> = [strings.Scale1, strings.Scale2, strings.Scale3, strings.Scale4, strings.Scale5];

  const renderBody = (): React.ReactNode => {
    if (!services) {
      if (initError) {
        return (
          <MessageBar intent="error">
            <MessageBarBody>{errorMessage(initError, strings, siteUrl)}</MessageBarBody>
            <MessageBarActions>
              <Button icon={<ArrowClockwise16Regular />} onClick={onRetryInit}>
                {strings.Retry}
              </Button>
            </MessageBarActions>
          </MessageBar>
        );
      }
      return <Spinner size="small" label={strings.Loading} />;
    }

    if ((phase === 'submitted' || phase === 'existing') && shownAnswer) {
      const name: string = shownAnswer.technician.displayName;
      return (
        <>
          <MessageBar intent={phase === 'submitted' ? 'success' : 'info'}>
            <MessageBarBody>
              <MessageBarTitle>{phase === 'submitted' ? strings.SuccessTitle : strings.ExistingTitle}</MessageBarTitle>
              {phase === 'submitted' ? format(strings.SuccessBody, firstName(name)) : strings.ExistingBody}
            </MessageBarBody>
          </MessageBar>
          <SurveySummary answer={shownAnswer} strings={strings} people={services.people} locale={locale} />
          <div className={styles.actions}>
            <Button
              appearance="primary"
              icon={<ChartMultiple20Regular />}
              onClick={() => {
                onFollowUp(format(strings.FollowUpScorecard, name)).catch(() => undefined);
              }}
            >
              {format(strings.ViewScorecard, firstName(name))}
            </Button>
            <Button appearance="secondary" onClick={rateAnother}>
              {strings.RateAnother}
            </Button>
          </div>
        </>
      );
    }

    const busy: boolean = phase === 'submitting';
    const commentLabel: string = validation.commentRequired ? strings.CommentRequiredLabel : strings.CommentOptionalLabel;

    return (
      <>
        <div className={styles.context}>
          <Field
            label={strings.TicketLabel}
            required
            validationMessage={errorFor('ticketNumber')}
            validationState={errorFor('ticketNumber') ? 'error' : 'none'}
          >
            <Input
              value={draft.ticketNumber}
              placeholder={strings.TicketPlaceholder}
              maxLength={TICKET_MAX_LENGTH}
              disabled={busy}
              onChange={(_e, data) => update({ ticketNumber: data.value }, 'ticketNumber')}
            />
          </Field>
          <Field
            label={{ children: strings.TechnicianLabel, id: 'survey-technician-label' }}
            required
            validationMessage={errorFor('technician')}
            validationState={errorFor('technician') ? 'error' : 'none'}
          >
            <PersonField
              id="survey-technician"
              ariaLabelledBy="survey-technician-label"
              value={draft.technician}
              initialQuery={technicianQuery}
              people={services.people}
              disabled={busy}
              invalid={!!errorFor('technician')}
              strings={{
                placeholder: strings.TechnicianPlaceholder,
                searching: strings.TechnicianSearching,
                noResults: strings.TechnicianNoResults,
                change: strings.TechnicianChange
              }}
              onChange={(person) => update({ technician: person }, 'technician')}
            />
          </Field>
        </div>

        <Divider />

        <div className={styles.section}>
          <Subtitle2 id="survey-resolved-label">{strings.ResolvedQuestion}</Subtitle2>
          <ChoiceGroup<ResolvedValue>
            label={strings.ResolvedQuestion}
            labelId="survey-resolved-label"
            options={resolvedOptions}
            value={draft.resolved}
            disabled={busy}
            invalid={!!errorFor('resolved')}
            onChange={(value) => update({ resolved: value }, 'resolved')}
          />
          {errorFor('resolved') && <Caption1 className={styles.error}>{errorFor('resolved')}</Caption1>}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Subtitle2>{strings.RatingTitle}</Subtitle2>
            <Caption1 className={styles.subtle}>{strings.RatingHint}</Caption1>
          </div>
          <div className={styles.ratings}>
            {DIMENSIONS.map((d) => (
              <RatingScale
                key={d.key}
                idPrefix={`survey-${d.key}`}
                label={strings[DIMENSION_TEXT[d.key].label]}
                question={strings[DIMENSION_TEXT[d.key].question]}
                scaleLabels={scaleLabels}
                value={draft.scores[d.key]}
                disabled={busy}
                invalid={!!errorFor(d.key)}
                errorText={errorFor(d.key)}
                formatPointLabel={(score, text) => format(strings.PointLabel, score, text)}
                onChange={(score) => update({ scores: { ...draft.scores, [d.key]: score } }, d.key)}
              />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <Subtitle2 id="survey-recommend-label">{strings.RecommendQuestion}</Subtitle2>
          <ChoiceGroup<RecommendValue>
            label={strings.RecommendQuestion}
            labelId="survey-recommend-label"
            options={recommendOptions}
            value={draft.wouldRecommend}
            disabled={busy}
            invalid={!!errorFor('wouldRecommend')}
            onChange={(value) => update({ wouldRecommend: value }, 'wouldRecommend')}
          />
          {errorFor('wouldRecommend') && <Caption1 className={styles.error}>{errorFor('wouldRecommend')}</Caption1>}
        </div>

        <Field
          label={commentLabel}
          required={validation.commentRequired}
          hint={validation.commentRequired ? strings.CommentRequiredHint : undefined}
          validationMessage={errorFor('comments')}
          validationState={errorFor('comments') ? 'error' : 'none'}
        >
          <Textarea
            value={draft.comments}
            placeholder={strings.CommentPlaceholder}
            maxLength={COMMENT_MAX_LENGTH}
            resize="vertical"
            disabled={busy}
            onChange={(_e, data) => update({ comments: data.value }, 'comments')}
          />
        </Field>

        {submitError && (
          <MessageBar intent="error">
            <MessageBarBody>{submitError}</MessageBarBody>
          </MessageBar>
        )}

        <div className={styles.footer}>
          {missing > 0 && (
            <Caption1 className={styles.subtle} aria-live="polite">
              {format(strings.MissingFields, missing)}
            </Caption1>
          )}
          <Button
            appearance="primary"
            icon={busy ? <Spinner size="tiny" /> : <Send20Regular />}
            disabled={busy || missing > 0}
            onClick={() => {
              submit().catch(() => undefined);
            }}
          >
            {busy ? strings.Submitting : strings.Submit}
          </Button>
        </div>
      </>
    );
  };

  return (
    <IdPrefixProvider value="satisfaction-survey-">
      <FluentProvider theme={theme} targetDocument={targetDocument} style={themeToCssVars(theme)}>
        <div ref={rootRef} className={styles.root}>
          <div className={styles.header}>
            <Title3 as="h2">{strings.Title}</Title3>
            <Body1 className={styles.subtle}>{strings.Subtitle}</Body1>
          </div>
          {renderBody()}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
