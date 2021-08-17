import { GraphQLClient, gql } from 'graphql-request';
import { createQuestionFormData, CreateQuestionDto } from '@libs/shared-types';
import { useForm } from '@libs/components';
import { Button } from '@material-ui/core';

export const QuestionAdmin = () => {
  const endpoint = 'http://localhost:3070/graphql';

  const graphQLClient = new GraphQLClient(endpoint);

  const mutation = gql`
    mutation createQuestion($input: CreateQuestionInput!) {
      createQuestion(createQuestionInput: $input) {
        type
      }
    }
  `;
  const handleGetAllQuestionToDb = () => {
    fetch('/question.json')
      .then((response) => response.json())
      .then((json) => {
        json.forEach((e) => {
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
          };
          graphQLClient.request(mutation, { input: i }).then((data) => {
            console.log(JSON.stringify(data, undefined, 2));
          });
        });
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
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetAllQuestionToDb}
      >
        seed all 4050 question into db
      </Button>
      <Button variant="contained" color="primary">
        seed all 4050 question into db
      </Button>
      <Button variant="contained" color="primary">
        seed all 4050 question into db
      </Button>
    </>
  );
};
