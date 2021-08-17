import { GraphQLClient, gql } from 'graphql-request';
import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useForm } from '@libs/components';
import { Button } from '@material-ui/core';
import { useState } from 'react';

export const QuestionAdmin = () => {
  const endpoint = 'http://localhost:3070/graphql';

  const graphQLClient = new GraphQLClient(endpoint);

  const mutationCreateQuestion = gql`
    mutation createQuestion($input: CreateQuestionInput!) {
      createQuestion(createQuestionInput: $input) {
        type
      }
    }
  `;
  const postQuestion = (e) => {
    const tags = e.category.split(': ');

    const i: CreateQuestionDto = {
      type: e.type,
      tags: [tags[0]],
      subTags: tags[1] ? tags[1] : [],
      difficulty: e.difficulty,
      question: e.question,
      correctAnswer: e.correct_answer,
      incorrectAnswers: e.incorrect_answers,
      language: 'english',
      authorId: 1,
    };

    graphQLClient.request(mutationCreateQuestion, { input: i }).then((data) => {
      console.log(JSON.stringify(data, undefined, 2));
    });
  };

  const handleGetQuestionToDb = (start: number, end: number) => {
    fetch('/question.json')
      .then((response) => response.json())
      .then((json) => {
        for (let i = start; i < end; i++) {
          postQuestion(json[i]);
        }
      });
  };

  const mutationDeleteAllQuestions = gql`
    mutation {
      removeAllQuestions
    }
  `;

  const handleDeleteAllQuestions = () => {
    graphQLClient.request(mutationDeleteAllQuestions).then((data) => {
      console.log(JSON.stringify(data, undefined, 2));
    });
  };
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
  const [counter, setCounter] = useState(0);
  console.log(handlers);
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleGetQuestionToDb(0, 4050)}
      >
        seed all 4050 question into db
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleGetQuestionToDb(counter, counter + 10);
          setCounter(counter + 10);
        }}
      >
        seed questions {counter} - {counter + 10} into db
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleGetQuestionToDb(counter, counter + 1);
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
