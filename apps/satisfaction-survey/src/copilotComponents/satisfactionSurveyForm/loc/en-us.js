/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T16:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-006
 */
define([], function () {
  return {
    Title: 'Satisfaction survey',
    Subtitle: 'Your feedback helps us improve support. It takes less than a minute.',
    Loading: 'Loading…',

    TicketLabel: 'Ticket #',
    TicketPlaceholder: 'e.g. 4521',
    TechnicianLabel: 'Technician who helped you',
    TechnicianPlaceholder: 'Search by name or email',
    TechnicianSearching: 'Searching…',
    TechnicianNoResults: 'No results',
    TechnicianChange: 'Change',

    ResolvedQuestion: 'Was your issue resolved?',
    ResolvedYes: 'Yes',
    ResolvedPartial: 'Partially',
    ResolvedNo: 'No',

    RatingTitle: 'Rate the support',
    RatingHint: '1 = Very poor · 5 = Excellent',
    Scale1: 'Very poor',
    Scale2: 'Poor',
    Scale3: 'Fair',
    Scale4: 'Good',
    Scale5: 'Excellent',
    PointLabel: '{0} of 5, {1}',
    OutOf5: 'of 5',
    DimUnderstanding: 'Understanding',
    QUnderstanding: 'How well did they understand your issue?',
    DimSpeed: 'Speed',
    QSpeed: 'How quickly did they respond?',
    DimSkill: 'Skill',
    QSkill: 'How much technical skill did they show?',
    DimCommunication: 'Communication',
    QCommunication: 'How clear was the communication?',

    RecommendQuestion: 'Would you recommend this support to a colleague?',
    RecommendYes: 'Yes',
    RecommendNo: 'No',
    RecommendUnsure: 'Not sure',

    CommentOptionalLabel: 'Comments (optional)',
    CommentRequiredLabel: 'What could we have done better?',
    CommentRequiredHint: 'Required when the issue was not fully resolved or a rating is low.',
    CommentPlaceholder: 'Tell us in your own words…',

    Submit: 'Submit survey',
    Submitting: 'Submitting…',
    MissingFields: '{0} answer(s) missing before you can submit.',
    ErrRequired: 'Please answer this question.',
    ErrTooLong: 'The text is too long.',
    ErrCommentRequired: 'Tell us what we could have done better.',

    SuccessTitle: 'Thank you! Your survey was saved.',
    SuccessBody: 'Your answers help {0} and the support team improve.',
    ExistingTitle: 'You already answered the survey for this ticket.',
    ExistingBody: 'This is the answer you sent. To change it, contact the support team.',
    SummaryTicket: 'Ticket #{0}',
    SummaryResolved: 'Resolved: {0}',
    SummaryRecommend: 'Would recommend: {0}',
    SummaryComment: 'Comment',
    ViewScorecard: 'View {0}’s performance',
    FollowUpScorecard: 'How is {0} performing?',
    RateAnother: 'Rate another ticket',

    ErrNotFound: 'I could not find the survey list at {0}. Has provisioning been run?',
    ErrForbidden: 'You do not have permission to answer surveys on this site.',
    ErrNetwork: 'There was a connection problem with SharePoint.',
    ErrGeneric: 'Something went wrong ({0}).',
    Retry: 'Retry',

    ModelContextSubmitted:
      'The user submitted the satisfaction survey for ticket {0} about the support given by {1}. Result: {2}. Understanding {3}, Speed {4}, Skill {5}, Communication {6} (out of 5). Would recommend: {7}. The survey was saved.',
    ModelContextExisting:
      'The user had already answered the survey for ticket {0} about {1}; the form shows that answer and nothing new was saved.'
  };
});
