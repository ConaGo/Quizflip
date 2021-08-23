import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useForm } from '@libs/components';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import {
  CREATE_QUESTION,
  client,
  DELETE_ALL_QUESTIONS,
  GET_ALL_CATEGORIES,
  CREATE_QUESTIONS,
} from '@libs/data-access';
import { useQuery, useMutation } from '@apollo/client';

export const QuestionAdmin = () => {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [createQuestions, { error }] = useMutation(CREATE_QUESTIONS);

  const [deleteAllQuestions] = useMutation(DELETE_ALL_QUESTIONS);
  const { data, loading } = useQuery(GET_ALL_CATEGORIES);
  const [loadingState, setloadingState] = useState({
    createQuestion: false,
    deleteAllQuestions: false,
  });
  const formatQuestion = (e) => {
    const tags = e.category.split(': ');

    const ret: CreateQuestionDto = {
      type: e.type,
      category: tags[0],
      tags: tags[1] ? [tags[1]] : [],
      difficulty: e.difficulty,
      question: e.question,
      correctAnswer: e.correct_answer,
      incorrectAnswers: e.incorrect_answers,
      language: 'english',
      authorId: 2,
    };
    return ret;
  };
  const postQuestion = async (e) => {
    const input = formatQuestion(e);
    const data = await createQuestion({ variables: { input: input } });
    console.log(JSON.stringify(data, undefined, 2));
  };
  const handlePostQuestionToDb = async (start: number, end: number) => {
    setloadingState({ ...loadingState, createQuestion: true });
    const json = await (await fetch('/question.json')).json();
    for (let i = start; i < end; i++) {
      await postQuestion(json[i]);
    }
    setloadingState({ ...loadingState, createQuestion: false });
  };
  const handlePostManyQuestionToDb = async () => {
    setloadingState({ ...loadingState, createQuestion: true });

    const json = await (await fetch('/question.json')).json();
    const input = json.map((e) => formatQuestion(e));
    console.log(input[0]);
    const res = await createQuestions({
      variables: {
        input: [
          {
            type: 'boolean',
            category: 'Entertainment',
            tags: ['Board Games'],
            difficulty: 'easy',
            question: 'Snakes and Ladders was originally created in India?',
            correctAnswer: 'True',
            incorrectAnswers: ['False'],
            language: 'english',
            authorId: 2,
          },
          {
            type: 'boolean',
            category: 'Entertainment',
            tags: ['Board Games'],
            difficulty: 'easy',
            question: 'Snakes and Ladders was originally created in India?',
            correctAnswer: 'True',
            incorrectAnswers: ['False'],
            language: 'english',
            authorId: 2,
          },
        ],
      },
    });
    console.log(error);

    setloadingState({ ...loadingState, createQuestion: false });
  };

  const handleDeleteAllQuestions = async () => {
    setloadingState({ ...loadingState, deleteAllQuestions: true });
    await deleteAllQuestions();
    setloadingState({ ...loadingState, deleteAllQuestions: false });
  };
  const [counter, setCounter] = useState(0);
  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <p>{error?.message}</p>
      <p>{loading}</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handlePostManyQuestionToDb()}
      >
        {loadingState.createQuestion
          ? 'Loading...'
          : 'seed all 4050 question into db'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handlePostQuestionToDb(counter, counter + 10);
          setCounter(counter + 10);
        }}
      >
        {loadingState.createQuestion
          ? 'Loading...'
          : 'seed questions ' + counter + ' - ' + (counter + 10) + 'into db'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handlePostQuestionToDb(counter, counter + 1);
          setCounter(counter + 1);
        }}
      >
        {loadingState.createQuestion
          ? 'Loading...'
          : 'seed questions ' + counter + 'into db'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDeleteAllQuestions()}
      >
        {loadingState.deleteAllQuestions
          ? 'Loading...'
          : 'delete all Questions'}
      </Button>
    </>
  );
};
