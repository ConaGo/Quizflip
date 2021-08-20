import Joi from '../../joi.extensions';

export type QuestionType = 'boolean' | 'multiple';
export const AQuestionType = ['boolean', 'multiple'];
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export const AQuestionDifficulty = ['easy', 'medium', 'hard'];
export type QuestionCategory =
  | 'Sports'
  | 'Entertainment'
  | 'Animals'
  | 'Geography';
export const AQuestionCategory = [
  'Sports',
  'Entertainment',
  'Animals',
  'Geography',
];
export type QuestionSubTagEntertainment =
  | 'Board Games'
  | 'Video Games'
  | 'Film';
export const AQuestionSubTagEntertainment = [
  'Board Games',
  'Video Games',
  'Film',
];
export type Language = 'english' | 'german';
export const ALanguage = ['english', 'german'];

export class CreateQuestionDto {
  readonly type: QuestionType;
  readonly category: string;
  readonly tags?: string[];
  readonly difficulty: QuestionDifficulty;
  readonly question: string;
  readonly correctAnswer: string;
  readonly incorrectAnswers: string[];
  readonly language: Language;
  readonly authorId: number;
}
export const tagsValidator = Joi.array()
  .unique()
  .items(Joi.string().alphanum().min(3).max(15));
export const createQuestionFormData: Joi.object<CreateQuestionDto> = Joi.object<CreateQuestionDto>(
  {
    type: Joi.string()
      .valid(...AQuestionType)
      .required(),
    category: Joi.string().required().messages({
      'string.base': 'please provide a category',
      'string.empty': 'please provide a category',
    }),
    tags: tagsValidator,
    difficulty: Joi.string()
      .valid(...AQuestionDifficulty)
      .required(),
    question: Joi.string().required(),
    correctAnswer: Joi.string().required(),
    incorrectAnswers: Joi.array().items(Joi.string()),
    language: Joi.string()
      .valid(...ALanguage)
      .required(),
    authorId: Joi.number().required(),
  }
);
