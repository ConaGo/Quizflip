import { useForm } from '@libs/components';
import { useState } from 'react';

type QuestionType = 'boolean' | 'multiple';
export const QuestionForm = () => {
  const [type, setType] = useState<QuestionType>('multiple');
  return;
};

const BooleanQuestionForm = () => {
  const {
    isSuccess,
    isFailed,
    isLoading,
    handlers,
    onSubmit,
    errors,
  } = useForm(
    {
      nameOrEmail: '',
      password: '',
    },
    'login',
    'web'
  );
  return;
};
