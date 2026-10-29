/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-005, T-006, T-007, T-008
 */
import * as React from 'react';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  makeStyles,
  mergeClasses,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Subtitle2,
  tokens
} from '@fluentui/react-components';
import { ArrowExpand20Regular, Warning16Regular } from '@fluentui/react-icons';

import { MIN_RESPONSES } from '../../../shared/config/settings';
import { format } from '../../../shared/logic/text';
import { DIMENSIONS, PERIODS, type IScorecardSummary, type Period, type ResolvedValue } from '../../../shared/model/survey';
import { ChoiceGroup, type IChoiceOption } from '../../../shared/ui/ChoiceGroup';
import { DistributionBar } from '../../../shared/ui/DistributionBar';
import { ScoreCircle } from '../../../shared/ui/ScoreCircle';
import { TrendChart } from '../../../shared/ui/TrendChart';
import type { IVizPalette } from '../../../shared/ui/vizPalette';
import type { IScorecardStrings } from './ITechnicianScorecardProps';
import { dimensionLabel, formatAverage, formatPct, monthLabel, periodLabel } from './scorecardText';

export interface IScorecardViewProps {
  summary: IScorecardSummary;
  period: Period;
  onPeriodChange: (period: Period) => void;
  strings: IScorecardStrings;
  palette: IVizPalette;
  locale?: string;
}

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  circlesInline: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: tokens.spacingHorizontalS },
  circlesFull: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }
  },
  kpis: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXXL, alignItems: 'flex-end' },
  kpi: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  kpiValue: { fontSize: tokens.fontSizeHero700, fontWeight: tokens.fontWeightSemibold, lineHeight: tokens.lineHeightHero700, color: tokens.colorNeutralForeground1 },
  kpiValueSmall: { fontSize: tokens.fontSizeBase500, fontWeight: tokens.fontWeightSemibold, color: tokens.colorNeutralForeground1 },
  muted: { color: tokens.colorNeutralForeground2 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center' },
  footer: { display: 'flex', justifyContent: 'flex-end' },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: tokens.spacingHorizontalXXL,
    '@media (max-width: 800px)': { gridTemplateColumns: 'minmax(0, 1fr)' }
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusLarge,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`
  },
  resolvedBar: { display: 'flex', gap: '2px', height: '12px' },
  resolvedSeg: {
    ':first-child': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
    ':last-child': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }
  },
  legendRow: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalM, fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 },
  dot: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', marginRight: '4px', verticalAlign: 'middle' },
  comments: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, margin: 0, padding: 0, listStyle: 'none' },
  comment: {
    paddingLeft: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  commentLow: { borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteRedBorder2}` }
});

function InsufficientNotice(props: { summary: IScorecardSummary; period: Period; onPeriodChange: (p: Period) => void; strings: IScorecardStrings }): React.ReactElement {
  const { summary, period, onPeriodChange, strings } = props;
  return (
    <MessageBar intent="warning">
      <MessageBarBody>
        <MessageBarTitle>{strings.Insufficient}</MessageBarTitle>
        {format(strings.InsufficientBody, summary.n, MIN_RESPONSES)}
      </MessageBarBody>
      {period !== 'all' && (
        <MessageBarActions>
          <Button onClick={() => onPeriodChange('all')}>{strings.ShowAllHistory}</Button>
        </MessageBarActions>
      )}
    </MessageBar>
  );
}

/** Inline card: overall, four small circles, resolved / recommend, strongest / weakest. */
export function ScorecardInline(props: IScorecardViewProps & { canExpand: boolean; onExpand: () => void }): React.ReactElement {
  const { summary, period, onPeriodChange, strings, locale, canExpand, onExpand } = props;
  const styles = useStyles();
  const hide: boolean = summary.insufficient;

  return (
    <div className={styles.stack}>
      {hide ? (
        <InsufficientNotice summary={summary} period={period} onPeriodChange={onPeriodChange} strings={strings} />
      ) : (
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <Caption1 className={styles.muted}>{strings.Overall}</Caption1>
            <span className={styles.kpiValue}>
              {formatAverage(summary.overall, locale)} <Caption1 className={styles.muted}>{strings.OutOf5}</Caption1>
            </span>
          </div>
          <div className={styles.kpi}>
            <Caption1 className={styles.muted}>{strings.ResolvedTitle}</Caption1>
            <span className={styles.kpiValueSmall}>{formatPct(summary.resolved.Sí)}%</span>
          </div>
          <div className={styles.kpi}>
            <Caption1 className={styles.muted}>{strings.RecommendTitle}</Caption1>
            <span className={styles.kpiValueSmall}>{formatPct(summary.recommendPct)}%</span>
          </div>
        </div>
      )}

      <div className={styles.circlesInline}>
        {DIMENSIONS.map((d) => (
          <ScoreCircle
            key={d.key}
            value={summary.byDimension[d.key].avg}
            label={dimensionLabel(d.key, strings)}
            size={56}
            hideValue={hide}
            outOfText={strings.OutOf5}
            locale={locale}
          />
        ))}
      </div>

      {!hide && summary.strongest && summary.weakest && (
        <div className={styles.chips}>
          <Badge appearance="tint" color="success">
            {strings.Strongest}: {dimensionLabel(summary.strongest, strings)}
          </Badge>
          <Badge appearance="tint" color="warning">
            {strings.Weakest}: {dimensionLabel(summary.weakest, strings)}
          </Badge>
        </div>
      )}

      {canExpand && (
        <div className={styles.footer}>
          <Button appearance="primary" icon={<ArrowExpand20Regular />} onClick={onExpand}>
            {strings.ViewDetail}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Fullscreen: period selector, big circles, KPIs, distribution, trend, comments. */
export function ScorecardDetail(props: IScorecardViewProps): React.ReactElement {
  const { summary, period, onPeriodChange, strings, palette, locale } = props;
  const styles = useStyles();
  const hide: boolean = summary.insufficient;
  const scaleLabels: string[] = [strings.Scale1, strings.Scale2, strings.Scale3, strings.Scale4, strings.Scale5];
  const periodOptions: ReadonlyArray<IChoiceOption<Period>> = PERIODS.map((p) => ({ value: p, label: periodLabel(p, strings) }));
  const resolvedParts: Array<{ value: ResolvedValue; label: string; color: string }> = [
    { value: 'Sí', label: strings.ResolvedYes, color: palette.status.good },
    { value: 'Parcialmente', label: strings.ResolvedPartial, color: palette.status.warning },
    { value: 'No', label: strings.ResolvedNo, color: palette.status.critical }
  ];

  return (
    <div className={styles.stack}>
      <div className={styles.stack} style={{ gap: tokens.spacingVerticalXS }}>
        <Caption1 id="scorecard-period-label" className={styles.muted}>
          {strings.PeriodLabel}
        </Caption1>
        <ChoiceGroup<Period> label={strings.PeriodLabel} labelId="scorecard-period-label" options={periodOptions} value={period} onChange={onPeriodChange} />
      </div>

      {hide && <InsufficientNotice summary={summary} period={period} onPeriodChange={onPeriodChange} strings={strings} />}

      <div className={styles.circlesFull}>
        {DIMENSIONS.map((d) => (
          <ScoreCircle
            key={d.key}
            value={summary.byDimension[d.key].avg}
            label={dimensionLabel(d.key, strings)}
            size={112}
            hideValue={hide}
            outOfText={strings.OutOf5}
            locale={locale}
          />
        ))}
      </div>

      {!hide && (
        <>
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <Caption1 className={styles.muted}>{strings.Overall}</Caption1>
              <span className={styles.kpiValue}>
                {formatAverage(summary.overall, locale)} <Caption1 className={styles.muted}>{strings.OutOf5}</Caption1>
              </span>
            </div>
            <div className={styles.kpi}>
              <Caption1 className={styles.muted}>{strings.RecommendTitle}</Caption1>
              <span className={styles.kpiValueSmall}>{formatPct(summary.recommendPct)}%</span>
            </div>
            <div className={styles.kpi}>
              <Caption1 className={styles.muted}>{format(strings.Responses, summary.n)}</Caption1>
            </div>
            {summary.strongest && summary.weakest && (
              <div className={styles.chips}>
                <Badge appearance="tint" color="success">
                  {strings.Strongest}: {dimensionLabel(summary.strongest, strings)}
                </Badge>
                <Badge appearance="tint" color="warning">
                  {strings.Weakest}: {dimensionLabel(summary.weakest, strings)}
                </Badge>
              </div>
            )}
          </div>

          <div className={styles.grid2}>
            <section className={styles.card}>
              <Subtitle2 as="h3">{strings.DistributionTitle}</Subtitle2>
              {DIMENSIONS.map((d) => (
                <DistributionBar
                  key={d.key}
                  label={dimensionLabel(d.key, strings)}
                  counts={summary.byDimension[d.key].distribution}
                  colors={palette.scoreRamp}
                  scaleLabels={scaleLabels}
                  describe={(count, score, scaleLabel, pct) => format(strings.DistributionSegment, count, score, scaleLabel, formatPct(pct))}
                />
              ))}
              <div className={styles.legendRow}>
                {scaleLabels.map((l, i) => (
                  <span key={l}>
                    <span className={styles.dot} style={{ backgroundColor: palette.scoreRamp[i] }} />
                    {i + 1} {l}
                  </span>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <Subtitle2 as="h3">{strings.ResolvedTitle}</Subtitle2>
              <div className={styles.resolvedBar} role="img" aria-label={resolvedParts.map((p) => `${p.label} ${formatPct(summary.resolved[p.value])}%`).join(', ')}>
                {resolvedParts
                  .filter((p) => summary.resolved[p.value] > 0)
                  .map((p) => (
                    <span key={p.value} className={styles.resolvedSeg} style={{ flexGrow: summary.resolved[p.value], backgroundColor: p.color }} title={`${p.label}: ${formatPct(summary.resolved[p.value])}%`} />
                  ))}
              </div>
              <div className={styles.legendRow}>
                {resolvedParts.map((p) => (
                  <span key={p.value}>
                    <span className={styles.dot} style={{ backgroundColor: p.color }} />
                    {p.label}: <strong>{formatPct(summary.resolved[p.value])}%</strong>
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section className={styles.card}>
            <Subtitle2 as="h3">{strings.TrendTitle}</Subtitle2>
            <TrendChart
              points={summary.monthly}
              colors={palette.dimension}
              dimensionLabel={(key) => dimensionLabel(key, strings)}
              monthLabel={(m) => monthLabel(m, locale)}
              formatValue={(v) => formatAverage(v, locale)}
              strings={{ showTable: strings.ShowTable, showChart: strings.ShowChart, month: strings.Month, responses: strings.ResponsesShort, title: strings.TrendTitle }}
            />
          </section>

          <section className={styles.card}>
            <Subtitle2 as="h3">{strings.CommentsTitle}</Subtitle2>
            {summary.recentComments.length === 0 ? (
              <Body1 className={styles.muted}>{strings.NoComments}</Body1>
            ) : (
              <ul className={styles.comments}>
                {summary.recentComments.map((c, i) => (
                  <li key={i} className={mergeClasses(styles.comment, c.low && styles.commentLow)}>
                    <Body1>“{c.text}”</Body1>
                    <Caption1 className={styles.muted}>
                      {c.created.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                      {c.low && (
                        <>
                          {' · '}
                          <Warning16Regular style={{ verticalAlign: 'text-bottom' }} /> {strings.LowBadge}
                        </>
                      )}
                    </Caption1>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
