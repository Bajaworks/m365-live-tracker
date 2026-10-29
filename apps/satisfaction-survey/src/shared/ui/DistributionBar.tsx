/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-007
 */
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

export interface IDistributionBarProps {
  /** Dimension name (row label). */
  label: string;
  /** Counts for scores 1..5. */
  counts: ReadonlyArray<number>;
  /** Ordinal colors for scores 1..5. */
  colors: ReadonlyArray<string>;
  /** Point labels (Muy malo … Excelente) for tooltips / screen readers. */
  scaleLabels: ReadonlyArray<string>;
  /** "{0} respuestas con {1} ({2})" style formatter for one segment. */
  describe: (count: number, score: number, scaleLabel: string, pct: number) => string;
}

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '110px minmax(0, 1fr)',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 480px)': { gridTemplateColumns: 'minmax(0, 1fr)' }
  },
  label: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 },
  bar: {
    display: 'flex',
    gap: '2px',
    height: '20px',
    // the surface shows through the 2px gaps between segments
    backgroundColor: 'transparent'
  },
  segment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '2px',
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'default',
    ':first-child': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
    ':last-child': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
    ':hover': { outline: `2px solid ${tokens.colorNeutralForeground1}`, outlineOffset: '1px' }
  },
  empty: {
    flexGrow: 1,
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground3
  }
});

/** Relative luminance-ish check to choose readable ink on a segment. */
function inkFor(hex: string): string {
  const n: number = parseInt(hex.slice(1), 16);
  const r: number = (n >> 16) & 255;
  const g: number = (n >> 8) & 255;
  const b: number = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0b0b0b' : '#ffffff';
}

/**
 * Stacked horizontal bar of the 1–5 answers for one dimension. Segments keep a
 * 2px gap, rounded data-ends, a count label when wide enough and a native
 * tooltip (hover) with the full description.
 */
export function DistributionBar(props: IDistributionBarProps): React.ReactElement {
  const { label, counts, colors, scaleLabels, describe } = props;
  const styles = useStyles();
  const total: number = counts.reduce((a, b) => a + b, 0);

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.bar} role="img" aria-label={`${label}: ${counts.map((c, i) => describe(c, i + 1, scaleLabels[i], total ? (c * 100) / total : 0)).join('; ')}`}>
        {total === 0 && <span className={styles.empty} />}
        {counts.map((count, i) => {
          if (count === 0) {
            return undefined;
          }
          const pct: number = (count * 100) / total;
          return (
            <span
              key={i}
              className={styles.segment}
              style={{ flexGrow: count, backgroundColor: colors[i], color: inkFor(colors[i]) }}
              title={describe(count, i + 1, scaleLabels[i], pct)}
            >
              {pct >= 12 ? count : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
