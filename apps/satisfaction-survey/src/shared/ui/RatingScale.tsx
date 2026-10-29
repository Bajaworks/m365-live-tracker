/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ux-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */
import * as React from 'react';
import { Caption1, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { Score } from '../model/survey';

export interface IRatingScaleProps {
  /** One-word dimension name (Comprensión). */
  label: string;
  /** The question shown under the name. */
  question: string;
  /** Label for each point, index 0 = score 1 (Muy malo … Excelente). */
  scaleLabels: ReadonlyArray<string>;
  value?: Score;
  onChange: (value: Score) => void;
  invalid?: boolean;
  errorText?: string;
  disabled?: boolean;
  idPrefix: string;
  /** Accessible name of each point, e.g. (4, "Bueno") → "4 de 5, Bueno". */
  formatPointLabel?: (score: Score, label: string) => string;
}

const SCORES: ReadonlyArray<Score> = [1, 2, 3, 4, 5];

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalXXS,
    '@media (max-width: 480px)': { gridTemplateColumns: 'minmax(0, 1fr)' }
  },
  text: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  name: { fontWeight: tokens.fontWeightSemibold, color: tokens.colorNeutralForeground1 },
  question: { color: tokens.colorNeutralForeground2 },
  scale: { display: 'flex', gap: tokens.spacingHorizontalXS },
  point: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusCircular,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
    ':focus-visible': {
      outline: `${tokens.strokeWidthThick} solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px'
    }
  },
  selected: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandBackground}`,
    ':hover': { backgroundColor: tokens.colorBrandBackgroundHover }
  },
  invalidPoint: { border: `${tokens.strokeWidthThin} solid ${tokens.colorPaletteRedBorder2}` },
  feedback: { gridColumn: '1 / -1', minHeight: '16px' },
  chosen: { color: tokens.colorBrandForeground1 },
  error: { color: tokens.colorPaletteRedForeground1 }
});

/**
 * 1–5 scale as an accessible radiogroup: no preselected value, every point has
 * its own label (announced as "Comprensión, 4 de 5, Bueno"), arrow keys move.
 */
export function RatingScale(props: IRatingScaleProps): React.ReactElement {
  const { label, question, scaleLabels, value, onChange, invalid, errorText, disabled, idPrefix } = props;
  const formatPointLabel: (score: Score, label: string) => string =
    props.formatPointLabel || ((score: Score, text: string) => `${score} de 5, ${text}`);
  const styles = useStyles();
  const refs: React.MutableRefObject<Array<HTMLButtonElement | null>> = React.useRef([]);
  const labelId: string = `${idPrefix}-label`;
  const focusIndex: number = value ? value - 1 : 0;

  const select = (index: number): void => {
    const bounded: number = Math.max(0, Math.min(4, index));
    onChange(SCORES[bounded]);
    const target: HTMLButtonElement | null = refs.current[bounded];
    if (target) {
      target.focus();
    }
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(index + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      select(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      select(4);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.text} id={labelId}>
        <span className={styles.name}>{label}</span>
        <Caption1 className={styles.question}>{question}</Caption1>
      </div>
      <div role="radiogroup" aria-labelledby={labelId} aria-invalid={invalid || undefined} className={styles.scale}>
        {SCORES.map((score, index) => {
          const checked: boolean = value === score;
          return (
            <button
              key={score}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={formatPointLabel(score, scaleLabels[index])}
              title={scaleLabels[index]}
              tabIndex={index === focusIndex ? 0 : -1}
              disabled={disabled}
              className={mergeClasses(styles.point, checked && styles.selected, invalid && !value && styles.invalidPoint)}
              onClick={() => onChange(score)}
              onKeyDown={(e) => onKeyDown(index, e)}
            >
              {score}
            </button>
          );
        })}
      </div>
      <Caption1 className={mergeClasses(styles.feedback, invalid && !value ? styles.error : styles.chosen)} aria-live="polite">
        {value ? scaleLabels[value - 1] : invalid ? errorText : ' '}
      </Caption1>
    </div>
  );
}
