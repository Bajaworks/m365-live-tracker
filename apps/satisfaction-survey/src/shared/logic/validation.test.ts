/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-013
 */
import type { ISurveyDraft } from '../model/survey';
import { isCommentRequired, validateSurvey } from './validation';

function completeDraft(overrides: Partial<ISurveyDraft> = {}): ISurveyDraft {
  return {
    ticketNumber: '4521',
    technician: { email: 'ana.lopez@contoso.com', displayName: 'Ana López' },
    resolved: 'Sí',
    scores: { Understanding: 5, Speed: 4, Skill: 5, Communication: 4 },
    wouldRecommend: 'Sí',
    comments: '',
    ...overrides
  };
}

describe('validateSurvey', () => {
  it('flags every required field on an empty draft', () => {
    const result = validateSurvey({ ticketNumber: '', scores: {}, comments: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      ticketNumber: 'required',
      technician: 'required',
      resolved: 'required',
      Understanding: 'required',
      Speed: 'required',
      Skill: 'required',
      Communication: 'required',
      wouldRecommend: 'required'
    });
  });

  it('accepts a complete positive answer without a comment', () => {
    const result = validateSurvey(completeDraft());
    expect(result.valid).toBe(true);
    expect(result.commentRequired).toBe(false);
  });

  it('requires a comment when the issue was partially resolved', () => {
    const result = validateSurvey(completeDraft({ resolved: 'Parcialmente' }));
    expect(result.commentRequired).toBe(true);
    expect(result.errors.comments).toBe('commentRequired');
  });

  it('requires a comment when the issue was not resolved', () => {
    expect(isCommentRequired(completeDraft({ resolved: 'No' }))).toBe(true);
  });

  it('requires a comment when any dimension is 2 or lower', () => {
    const draft: ISurveyDraft = completeDraft({
      scores: { Understanding: 5, Speed: 2, Skill: 5, Communication: 4 }
    });
    expect(validateSurvey(draft).errors.comments).toBe('commentRequired');
    expect(validateSurvey({ ...draft, comments: 'Tardó dos días.' }).valid).toBe(true);
  });

  it('does not require a comment for a 3', () => {
    const draft: ISurveyDraft = completeDraft({
      scores: { Understanding: 3, Speed: 3, Skill: 3, Communication: 3 }
    });
    expect(validateSurvey(draft).valid).toBe(true);
  });

  it('treats a whitespace-only ticket or comment as empty', () => {
    expect(validateSurvey(completeDraft({ ticketNumber: '   ' })).errors.ticketNumber).toBe('required');
    expect(validateSurvey(completeDraft({ resolved: 'No', comments: '   ' })).errors.comments).toBe(
      'commentRequired'
    );
  });

  it('rejects values that are too long', () => {
    expect(validateSurvey(completeDraft({ ticketNumber: 'x'.repeat(51) })).errors.ticketNumber).toBe(
      'tooLong'
    );
    expect(validateSurvey(completeDraft({ comments: 'x'.repeat(2001) })).errors.comments).toBe('tooLong');
  });
});
