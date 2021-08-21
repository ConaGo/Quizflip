import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useForm } from '@libs/components';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import {
  CREATE_QUESTION,
  client,
  DELETE_ALL_QUESTIONS,
  GET_ALL_CATEGORIES,
} from '@libs/data-access';
import { useQuery, useMutation } from '@apollo/client';

export const QuestionAdmin = () => {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [deleteAllQuestions] = useMutation(DELETE_ALL_QUESTIONS);
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES);
  const [loadingState, setloadingState] = useState({
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
      authorId: 2,
    };

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
        onClick={() => handlePostQuestionToDb(0, 4050)}
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
