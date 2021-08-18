import { useForm } from '@libs/components';
import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useState } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
type QuestionType = 'boolean' | 'multiple';
export const QuestionForm = () => {
  const [type, setType] = useState<QuestionType>('multiple');
  return <BooleanQuestionForm></BooleanQuestionForm>;
};

const BooleanQuestionForm = () => {
  const defaultValues: CreateQuestionDto = {
    type: 'boolean',
    category: '',
    tags: [],
    difficulty: 'medium',
    question: '',
    correctAnswer: '',
    incorrectAnswers: [],
    language: 'english',
    authorId: 1,
  };
  const {
    isSuccess,
    isFailed,
    isLoading,
    handlers,
    onSubmit,
    errors,
  } = useForm(defaultValues, createQuestionFormData);
  console.log(handlers);
  return (
    <>
      <Typography variant="h4">Create A New Question</Typography>
      <TextField label="Category"></TextField>
    </>
  );
};
