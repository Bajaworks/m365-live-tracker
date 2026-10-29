/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ux-architect
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-004, T-005, T-006, T-009
 */
import * as React from 'react';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  FluentProvider,
  IdPrefixProvider,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  Persona,
  Spinner,
  Title3,
  tokens
} from '@fluentui/react-components';
import { ArrowClockwise16Regular } from '@fluentui/react-icons';

import { buildDemoRecords } from '../../../shared/data/demoData';
import { summarize } from '../../../shared/logic/aggregation';
import { periodStart } from '../../../shared/logic/period';
import { matchTechnician, type TechnicianMatch } from '../../../shared/logic/technicianMatch';
import { format } from '../../../shared/logic/text';
import type { IPerson, IScorecardSummary, ISurveyRecord, Period } from '../../../shared/model/survey';
import { themeFor, themeToCssVars } from '../../../shared/ui/themeVars';
import { vizPalette } from '../../../shared/ui/vizPalette';
import type { ITechnicianScorecardProps } from './ITechnicianScorecardProps';
import { periodLabel, readErrorReason, scorecardContext } from './scorecardText';
import { ScorecardDetail, ScorecardInline } from './ScorecardViews';

type State =
  | { kind: 'loading' }
  | { kind: 'pick'; match: TechnicianMatch }
  | { kind: 'ready'; person: IPerson; records: ISurveyRecord[]; demoReason?: string }
  | { kind: 'error'; message: string };

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
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: tokens.spacingHorizontalM },
  muted: { color: tokens.colorNeutralForeground2 },
  pickList: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  pickButton: { justifyContent: 'flex-start' }
});

export default function TechnicianScorecard(props: ITechnicianScorecardProps): React.ReactElement {
  const {
    technician,
    invocationKey,
    services,
    initError,
    siteUrl,
    onRetryInit,
    hostContext,
    targetDocument,
    strings,
    locale,
    onRequestDisplayMode,
    onModelContext,
    onContentHeight
  } = props;
  const styles = useStyles();
  const theme = themeFor(hostContext.theme);
  const palette = vizPalette(hostContext.theme);
  const fullscreen: boolean = hostContext.displayMode === 'fullscreen';
  const canExpand: boolean = !fullscreen && (hostContext.availableDisplayModes || ['fullscreen']).indexOf('fullscreen') >= 0;
  const rootRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [state, setState] = React.useState<State>({ kind: 'loading' });
  const [period, setPeriod] = React.useState<Period>(props.period);
  const [reload, setReload] = React.useState<number>(0);

  // Loads every response of one person once; the period is filtered locally,
  // so changing it never calls the tool again (ST-17 CA2).
  const loadPerson = React.useCallback(
    (person: IPerson): void => {
      if (!services) {
        return;
      }
      setState({ kind: 'loading' });
      services.repository.getByTechnician(person.email, 'all').then(
        (records) => setState({ kind: 'ready', person, records }),
        (error) =>
          setState({
            kind: 'ready',
            person,
            records: buildDemoRecords(person, new Date()),
            demoReason: readErrorReason(error, strings, services.siteUrl)
          })
      );
    },
    [services, strings]
  );

  // New tool invocation (or retry) → resolve the technician again.
  React.useEffect(() => {
    setPeriod(props.period);
    if (!services) {
      setState({ kind: 'loading' });
      return undefined;
    }
    let cancelled: boolean = false;
    setState({ kind: 'loading' });
    services.repository.listTechnicians().then(
      (people) => {
        if (cancelled) {
          return;
        }
        const match: TechnicianMatch = matchTechnician(technician, people);
        if (match.kind === 'match') {
          loadPerson(match.person);
        } else {
          setState({ kind: 'pick', match });
        }
      },
      (error) => {
        if (cancelled) {
          return;
        }
        // Offline demo fallback: show the requested name with sample data.
        const name: string = (technician || '').trim();
        if (name) {
          const person: IPerson = { email: name, displayName: name };
          setState({
            kind: 'ready',
            person,
            records: buildDemoRecords(person, new Date()),
            demoReason: readErrorReason(error, strings, services.siteUrl)
          });
        } else {
          setState({ kind: 'error', message: readErrorReason(error, strings, services.siteUrl) });
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [invocationKey, services, reload]);

  // Records → summary for the selected period.
  const summary: IScorecardSummary | undefined = React.useMemo(() => {
    if (state.kind !== 'ready') {
      return undefined;
    }
    const from: Date | undefined = periodStart(period, new Date());
    const inPeriod: ISurveyRecord[] = from ? state.records.filter((r) => r.created.getTime() >= from.getTime()) : state.records;
    return summarize(inPeriod);
  }, [state, period]);

  // Tell Copilot what is on screen, so follow-up questions use real numbers.
  React.useEffect(() => {
    if (state.kind === 'ready' && summary) {
      const ctx = scorecardContext(state.person, period, summary, !!state.demoReason, strings, locale);
      onModelContext(ctx.text, ctx.structured).catch(() => undefined);
    }
  }, [summary]);

  // Report height for the inline card.
  React.useEffect(() => {
    const element: HTMLDivElement | null = rootRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer: ResizeObserver = new ResizeObserver(() => onContentHeight(element.scrollHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, [onContentHeight]);

  const renderPick = (match: TechnicianMatch): React.ReactNode => {
    const people: IPerson[] = match.kind === 'ambiguous' ? match.options : match.kind === 'match' ? [match.person] : match.suggestions;
    const title: string =
      match.kind === 'ambiguous'
        ? format(strings.AmbiguousTitle, technician || '')
        : match.kind === 'missing'
          ? strings.MissingTitle
          : format(strings.NotFoundTitle, technician || '');
    return (
      <>
        <Title3 as="h2">{title}</Title3>
        {people.length === 0 ? (
          <Body1 className={styles.muted}>{strings.NoTechnicians}</Body1>
        ) : (
          <>
            {match.kind !== 'ambiguous' && <Caption1 className={styles.muted}>{strings.PickHint}</Caption1>}
            <div className={styles.pickList}>
              {people.map((p) => (
                <Button key={p.email} appearance="outline" className={styles.pickButton} onClick={() => loadPerson(p)}>
                  {p.displayName}
                </Button>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  const renderBody = (): React.ReactNode => {
    if (!services) {
      if (initError) {
        return (
          <MessageBar intent="error">
            <MessageBarBody>{readErrorReason(initError, strings, siteUrl)}</MessageBarBody>
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
    if (state.kind === 'loading') {
      return <Spinner size="small" label={strings.Loading} />;
    }
    if (state.kind === 'error') {
      return (
        <MessageBar intent="error">
          <MessageBarBody>{state.message}</MessageBarBody>
          <MessageBarActions>
            <Button icon={<ArrowClockwise16Regular />} onClick={() => setReload(reload + 1)}>
              {strings.Retry}
            </Button>
          </MessageBarActions>
        </MessageBar>
      );
    }
    if (state.kind === 'pick') {
      return renderPick(state.match);
    }
    if (!summary) {
      return undefined;
    }

    const viewProps = { summary, period, onPeriodChange: setPeriod, strings, palette, locale };
    return (
      <>
        <div className={styles.header}>
          <Persona
            size="large"
            name={state.person.displayName}
            secondaryText={`${periodLabel(period, strings)} · ${format(strings.Responses, summary.n)}`}
            avatar={{ image: state.demoReason ? undefined : { src: services.people.photoUrl(state.person.email) }, color: 'colorful' }}
            primaryText={<Title3 as="h2">{format(strings.Title, state.person.displayName)}</Title3>}
          />
          {state.demoReason && (
            <Badge appearance="filled" color="warning">
              {strings.DemoBadge}
            </Badge>
          )}
        </div>
        {state.demoReason && (
          <MessageBar intent="warning">
            <MessageBarBody>{format(strings.DemoBody, state.demoReason)}</MessageBarBody>
            <MessageBarActions>
              <Button icon={<ArrowClockwise16Regular />} onClick={() => setReload(reload + 1)}>
                {strings.Retry}
              </Button>
            </MessageBarActions>
          </MessageBar>
        )}
        {fullscreen ? (
          <ScorecardDetail {...viewProps} />
        ) : (
          <ScorecardInline
            {...viewProps}
            canExpand={canExpand}
            onExpand={() => {
              onRequestDisplayMode('fullscreen').catch(() => undefined);
            }}
          />
        )}
      </>
    );
  };

  return (
    <IdPrefixProvider value="technician-scorecard-">
      <FluentProvider theme={theme} targetDocument={targetDocument} style={themeToCssVars(theme)}>
        <div ref={rootRef} className={styles.root}>
          {renderBody()}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
