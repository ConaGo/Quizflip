import { gql } from '@apollo/client';

export const CREATE_QUESTION = gql`
  mutation createQuestion($input: CreateQuestionInput!) {
    createQuestion(createQuestionInput: $input) {
      type
    }
  }
`;

export const DELETE_ALL_QUESTIONS = gql`
  mutation {
    removeAllQuestions
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query {
    categories
  }
`;
