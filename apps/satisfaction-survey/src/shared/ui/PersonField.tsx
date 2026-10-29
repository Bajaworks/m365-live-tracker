/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ux-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */
import * as React from 'react';
import { Button, Combobox, makeStyles, Option, Persona, Spinner, tokens } from '@fluentui/react-components';
import { Dismiss16Regular } from '@fluentui/react-icons';
import type { IPerson } from '../model/survey';
import type { IPeopleService } from '../services/PeopleService';

export interface IPersonFieldStrings {
  placeholder: string;
  searching: string;
  noResults: string;
  change: string;
}

export interface IPersonFieldProps {
  id: string;
  value?: IPerson;
  /** Text to search with when there is no value yet (e.g. the tool parameter). */
  initialQuery?: string;
  onChange: (value: IPerson | undefined) => void;
  people: IPeopleService;
  strings: IPersonFieldStrings;
  invalid?: boolean;
  disabled?: boolean;
  ariaLabelledBy?: string;
}

const useStyles = makeStyles({
  selected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1
  },
  combo: { width: '100%' }
});

/**
 * Person picker backed by the SharePoint People Picker. Shows the photo of the
 * chosen technician; the initials are the fallback when the photo cannot load.
 */
export function PersonField(props: IPersonFieldProps): React.ReactElement {
  const { id, value, initialQuery, onChange, people, strings, invalid, disabled, ariaLabelledBy } = props;
  const styles = useStyles();
  const [query, setQuery] = React.useState<string>(initialQuery || '');
  const [options, setOptions] = React.useState<IPerson[]>([]);
  const [searching, setSearching] = React.useState<boolean>(false);

  React.useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  // Debounced search while typing.
  React.useEffect(() => {
    if (value || query.trim().length < 2) {
      setOptions([]);
      return undefined;
    }
    let cancelled: boolean = false;
    setSearching(true);
    const timer: number = window.setTimeout(() => {
      people
        .search(query)
        .then(
          (found) => {
            if (!cancelled) {
              setOptions(found);
              setSearching(false);
            }
          },
          () => {
            if (!cancelled) {
              setOptions([]);
              setSearching(false);
            }
          }
        );
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, value, people]);

  if (value) {
    return (
      <div className={styles.selected}>
        <Persona
          name={value.displayName}
          secondaryText={value.email}
          avatar={{ image: { src: people.photoUrl(value.email) }, color: 'colorful' }}
        />
        {!disabled && (
          <Button
            appearance="subtle"
            size="small"
            icon={<Dismiss16Regular />}
            aria-label={`${strings.change}: ${value.displayName}`}
            onClick={() => {
              setQuery('');
              onChange(undefined);
            }}
          >
            {strings.change}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Combobox
      id={id}
      className={styles.combo}
      freeform
      disabled={disabled}
      placeholder={strings.placeholder}
      value={query}
      aria-labelledby={ariaLabelledBy}
      aria-invalid={invalid || undefined}
      onChange={(event) => setQuery(event.target.value)}
      onOptionSelect={(_event, data) => {
        const person: IPerson | undefined = options.filter((p) => p.email === data.optionValue)[0];
        if (person) {
          onChange(person);
        }
      }}
    >
      {searching && (
        <Option key="__searching" value="" text={strings.searching} disabled>
          <Spinner size="extra-tiny" label={strings.searching} />
        </Option>
      )}
      {!searching && query.trim().length >= 2 && options.length === 0 && (
        <Option key="__empty" value="" text={strings.noResults} disabled>
          {strings.noResults}
        </Option>
      )}
      {options.map((person) => (
        <Option key={person.email} value={person.email} text={person.displayName}>
          <Persona name={person.displayName} secondaryText={person.email} size="small" avatar={{ color: 'colorful' }} />
        </Option>
      ))}
    </Combobox>
  );
}
