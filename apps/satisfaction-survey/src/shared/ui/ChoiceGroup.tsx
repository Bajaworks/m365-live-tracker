/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ux-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */
import * as React from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

export interface IChoiceOption<T extends string> {
  value: T;
  label: string;
}

export interface IChoiceGroupProps<T extends string> {
  /** Accessible name of the group (the question). */
  label: string;
  labelId: string;
  options: ReadonlyArray<IChoiceOption<T>>;
  value?: T;
  onChange: (value: T) => void;
  invalid?: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles({
  group: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS
  },
  option: {
    minHeight: '36px',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusXLarge,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
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
    fontWeight: tokens.fontWeightSemibold,
    ':hover': { backgroundColor: tokens.colorBrandBackgroundHover }
  },
  invalid: {
    border: `${tokens.strokeWidthThin} solid ${tokens.colorPaletteRedBorder2}`
  }
});

/**
 * Segmented single choice (radiogroup). No option is preselected: an unanswered
 * question is visibly different from an answer.
 * Keyboard: Tab enters the group, arrows move and select (roving tabindex).
 */
export function ChoiceGroup<T extends string>(props: IChoiceGroupProps<T>): React.ReactElement {
  const { label, labelId, options, value, onChange, invalid, disabled } = props;
  const styles = useStyles();
  const refs: React.MutableRefObject<Array<HTMLButtonElement | null>> = React.useRef([]);
  const selectedIndex: number = options.findIndex((o) => o.value === value);
  const focusIndex: number = selectedIndex >= 0 ? selectedIndex : 0;

  const move = (from: number, delta: number): void => {
    const next: number = (from + delta + options.length) % options.length;
    onChange(options[next].value);
    const target: HTMLButtonElement | null = refs.current[next];
    if (target) {
      target.focus();
    }
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(index, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(index, -1);
    }
  };

  return (
    <div role="radiogroup" aria-labelledby={labelId} aria-label={labelId ? undefined : label} aria-invalid={invalid || undefined} className={styles.group}>
      {options.map((option, index) => {
        const checked: boolean = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={disabled}
            className={mergeClasses(styles.option, checked && styles.selected, invalid && !checked && styles.invalid)}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
