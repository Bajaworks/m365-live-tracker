/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-008
 */
import * as React from 'react';
import { Badge, Body1, Caption1, makeStyles, Persona, tokens } from '@fluentui/react-components';
import { DIMENSIONS } from '../../../shared/model/survey';
import { format } from '../../../shared/logic/text';
import { ScoreCircle } from '../../../shared/ui/ScoreCircle';
import type { IPeopleService } from '../../../shared/services/PeopleService';
import type { ICopilotSurveyStrings, ISurveyAnswer } from './ISatisfactionSurveyFormProps';
import { recommendLabel, resolvedLabel } from './surveyText';

export interface ISurveySummaryProps {
  answer: ISurveyAnswer;
  strings: ICopilotSurveyStrings;
  people?: IPeopleService;
  locale?: string;
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  circles: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS
  },
  badges: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  comment: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalM,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'pre-wrap'
  }
});

const DIMENSION_LABEL_KEYS: { [key: string]: keyof ICopilotSurveyStrings } = {
  Understanding: 'DimUnderstanding',
  Speed: 'DimSpeed',
  Skill: 'DimSkill',
  Communication: 'DimCommunication'
};

/** Read-only view of an answer: shared by the confirmation and "already answered". */
export function SurveySummary(props: ISurveySummaryProps): React.ReactElement {
  const { answer, strings, people, locale } = props;
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Persona
          name={answer.technician.displayName}
          secondaryText={format(strings.SummaryTicket, answer.ticketNumber)}
          avatar={{ image: people ? { src: people.photoUrl(answer.technician.email) } : undefined, color: 'colorful' }}
        />
      </div>
      <div className={styles.circles}>
        {DIMENSIONS.map((d) => (
          <ScoreCircle
            key={d.key}
            value={answer.scores[d.key]}
            label={strings[DIMENSION_LABEL_KEYS[d.key]]}
            size={52}
            decimals={0}
            outOfText={strings.OutOf5}
            locale={locale}
          />
        ))}
      </div>
      <div className={styles.badges}>
        <Badge appearance="tint" color={answer.resolved === 'Sí' ? 'success' : answer.resolved === 'No' ? 'danger' : 'warning'}>
          {format(strings.SummaryResolved, resolvedLabel(answer.resolved, strings))}
        </Badge>
        <Badge appearance="tint" color="informative">
          {format(strings.SummaryRecommend, recommendLabel(answer.wouldRecommend, strings))}
        </Badge>
      </div>
      {answer.comments && (
        <div>
          <Caption1>{strings.SummaryComment}</Caption1>
          <Body1 as="p" className={styles.comment}>
            {answer.comments}
          </Body1>
        </div>
      )}
    </div>
  );
}
