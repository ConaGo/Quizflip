import { useForm } from '@libs/components';
import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import axios from 'axios';
import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
type QuestionType = 'boolean' | 'multiple';
export const QuestionForm = () => {
  const [type, setType] = useState<QuestionType>('multiple');
  return <BooleanQuestionForm></BooleanQuestionForm>;
};

const BooleanQuestionForm = () => {
  const defaultValues: CreateQuestionDto = {
    type: 'boolean',
    tags: [],
    subTags: [],
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
  } = useForm(defaultValues, createQuestionFormData, 'login', 'web');
  console.log(handlers);
  return <h1>CreatorHub</h1>;
};
