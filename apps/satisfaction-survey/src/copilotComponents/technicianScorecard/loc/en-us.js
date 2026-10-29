/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-009
 */
define([], function () {
  return {
    Title: '{0}’s performance',
    Loading: 'Loading…',
    PeriodMonth: 'Last month',
    PeriodQuarter: 'Last 3 months',
    PeriodSemester: 'Last 6 months',
    PeriodAll: 'All history',
    PeriodLabel: 'Period',
    Responses: '{0} surveys',
    ResponsesShort: 'surveys',
    Overall: 'Overall rating',
    OutOf5: 'of 5',
    ResolvedTitle: 'Issue resolved',
    ResolvedYes: 'Yes',
    ResolvedPartial: 'Partially',
    ResolvedNo: 'No',
    RecommendTitle: 'Would recommend',
    Strongest: 'Strength',
    Weakest: 'Can improve',
    ViewDetail: 'View details',

    Insufficient: 'Not enough data',
    InsufficientBody: 'There are only {0} survey(s) in this period; at least {1} are needed for reliable results.',
    ShowAllHistory: 'View all history',

    DistributionTitle: 'Answer distribution',
    DistributionSegment: '{0} answer(s) rated {1} ({2}) · {3}%',
    TrendTitle: 'Monthly trend',
    ShowTable: 'View as table',
    ShowChart: 'View chart',
    Month: 'Month',
    CommentsTitle: 'Recent comments',
    NoComments: 'No comments in this period.',
    LowBadge: 'Low rating',

    NotFoundTitle: 'I could not find surveys for "{0}".',
    AmbiguousTitle: 'Several technicians match "{0}". Who do you mean?',
    MissingTitle: 'Which technician’s performance do you want to see?',
    PickHint: 'Technicians with surveys:',
    NoTechnicians: 'There are no surveys yet.',

    DemoBadge: 'Demo data (offline)',
    DemoBody: 'I could not read the survey list ({0}). Showing sample data.',
    Retry: 'Retry',
    ErrNotFound: 'list not found at {0}',
    ErrForbidden: 'no permission to read the list',
    ErrNetwork: 'connection problem',
    ErrGeneric: 'error {0}',

    DimUnderstanding: 'Understanding',
    DimSpeed: 'Speed',
    DimSkill: 'Skill',
    DimCommunication: 'Communication',
    Scale1: 'Very poor',
    Scale2: 'Poor',
    Scale3: 'Fair',
    Scale4: 'Good',
    Scale5: 'Excellent',

    ModelContextSummary:
      'The scorecard shows {0}’s performance ({1}): {2} surveys. Overall {3} of 5. Understanding {4}, Speed {5}, Skill {6}, Communication {7}. Issue resolved in {8}% of cases; {9}% would recommend. Strength: {10}. Can improve: {11}.',
    ModelContextInsufficient: 'The scorecard for {0} ({1}) has only {2} survey(s): not enough data, no averages are shown.',
    ModelContextDemo: ' Note: this is demo data, not real, because the list could not be read.'
  };
});
