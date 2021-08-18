import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useForm } from '@libs/components';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import {
  CREATE_QUESTION,
  client,
  DELETE_ALL_QUESTIONS,
} from '@libs/data-access';
import { useQuery, useMutation } from '@apollo/client';

export const QuestionAdmin = () => {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [deletAllQuestions] = useMutation(DELETE_ALL_QUESTIONS);
  const [loading, setLoading] = useState({
    createQuestion: false,
    deleteAllQuestions: false,
  });
  const postQuestion = async (e) => {
    const tags = e.category.split(': ');

    const input: CreateQuestionDto = {
      type: e.type,
      category: tags[0],
      tags: tags[1] ? tags[1] : [],
      difficulty: e.difficulty,
      question: e.question,
      correctAnswer: e.correct_answer,
      incorrectAnswers: e.incorrect_answers,
      language: 'english',
      authorId: 1,
    };

    const data = await createQuestion({ variables: { input: input } });
    console.log(JSON.stringify(data, undefined, 2));
  };

  const handlePostQuestionToDb = async (start: number, end: number) => {
    setLoading({ ...loading, createQuestion: true });
    const json = await (await fetch('/question.json')).json();
    for (let i = start; i < end; i++) {
      await postQuestion(json[i]);
    }
    setLoading({ ...loading, createQuestion: false });
  };

  const handleDeleteAllQuestions = async () => {
    setLoading({ ...loading, deleteAllQuestions: true });
    await deletAllQuestions();
    setLoading({ ...loading, deleteAllQuestions: false });
  };

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
  const [counter, setCounter] = useState(0);
  console.log(handlers);
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handlePostQuestionToDb(0, 4050)}
      >
        seed all 4050 question into db
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handlePostQuestionToDb(counter, counter + 10);
          setCounter(counter + 10);
        }}
      >
        seed questions {counter} - {counter + 10} into db
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handlePostQuestionToDb(counter, counter + 1);
          setCounter(counter + 1);
        }}
      >
        seed question {counter} into db
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeleteAllQuestions}
      >
        delete all Questions
      </Button>
    </>
  );
};
