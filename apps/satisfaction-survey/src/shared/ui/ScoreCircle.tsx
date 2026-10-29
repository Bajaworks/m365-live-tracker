/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-002
 */
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { clampScore, fillRadius, guideRadii } from '../logic/scoreGeometry';

export interface IScoreCircleProps {
  /** 1–5 (may be a decimal average). */
  value: number;
  /** One-word dimension name, shown under the circle. */
  label: string;
  /** Diameter in px. */
  size?: number;
  /** Decimals shown in the number (0 for a single answer, 1 for averages). */
  decimals?: number;
  /** Hide the number (e.g. "datos insuficientes"). */
  hideValue?: boolean;
  /** Text after the number for screen readers ("de 5" / "of 5"). */
  outOfText?: string;
  /** Locale for the decimal separator (es-MX → 4.3, es-ES → 4,3). */
  locale?: string;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
    minWidth: 0
  },
  value: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center'
  }
});

export function formatScore(value: number, decimals: number, locale?: string): string {
  return value.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * The outer contour is a 5 and the centre is a 1. The fill grows from the
 * centre with an AREA proportional to (value − 1) / 4, so a 1 shows only the
 * contour and a 5 is completely filled. Faint guide contours mark 2, 3 and 4.
 * The number is always shown: meaning never depends on colour or size alone.
 */
export function ScoreCircle(props: IScoreCircleProps): React.ReactElement {
  const { value, label, size = 72, decimals = 1, hideValue, outOfText = 'de 5', locale } = props;
  const styles = useStyles();
  const stroke: number = 2;
  const outer: number = size / 2 - stroke;
  const center: number = size / 2;
  const clamped: number = clampScore(value);
  const fill: number = fillRadius(clamped, outer);
  const text: string = formatScore(clamped, decimals, locale);

  return (
    <div className={styles.root}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={hideValue ? label : `${label}: ${text} ${outOfText}`}
      >
        {/* Guides first: the fill covers them, so they only show the part still missing to reach 5. */}
        {guideRadii(outer).map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={tokens.colorNeutralStroke2}
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        ))}
        {!hideValue && fill > 0 && <circle cx={center} cy={center} r={fill} fill={tokens.colorBrandBackground} />}
        <circle cx={center} cy={center} r={outer} fill="none" stroke={tokens.colorNeutralStrokeAccessible} strokeWidth={stroke} />
      </svg>
      {!hideValue && (
        <span className={styles.value} style={{ fontSize: Math.max(14, Math.round(size / 4)) }}>
          {text}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  );
}
