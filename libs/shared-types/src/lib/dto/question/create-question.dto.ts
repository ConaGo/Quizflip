import Joi from '../../joi.extensions';

export type QuestionType = 'boolean' | 'multiple';
export const AQuestionType = ['boolean', 'multiple'];
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export const AQuestionDifficulty = ['easy', 'medium', 'hard'];
export type QuestionTag = 'Sports' | 'Entertainment' | 'Animals' | 'Geography';
export const AQuestionTag = ['Sports', 'Entertainment', 'Animals', 'Geography'];
export type QuestionSubTagEntertainment =
  | 'Board Games'
  | 'Video Games'
  | 'Film';
export const AQuestionSubTagEntertainment = [
  'Board Games',
  'Video Games',
  'Film',
];
export type QuestionSubTag = QuestionSubTagEntertainment;
export const AQuestionSubTag = [...AQuestionSubTagEntertainment];
export type Language = 'english' | 'german';
export const ALanguage = ['english', 'german'];

export class CreateQuestionDto {
  readonly type: QuestionType;
  readonly tags: QuestionTag[];
  readonly subTags?: QuestionSubTag[];
  readonly difficulty: QuestionDifficulty;
  readonly question: string;
  readonly correctAnswer: string;
  readonly incorrectAnswers: string[];
  readonly language: Language;
}
export const createQuestionFormData = Joi.object<CreateQuestionDto>({
  type: Joi.string()
    .valid(...AQuestionType)
    .required(),
  tags: Joi.array()
    .items(Joi.string().valid(...AQuestionTag))
    .required()
    .messages({ 'string.empty': 'please provide at least one tag' }),
  subTags: Joi.array().items(Joi.string().valid(...AQuestionSubTag)),
  difficulty: Joi.string()
    .valid(...AQuestionDifficulty)
    .required(),
  question: Joi.string().required(),
  correctAnswer: Joi.string().required(),
  incorrectAnswers: Joi.array().items(Joi.string()),
  language: Joi.string()
    .valid(...ALanguage)
    .required(),
});
