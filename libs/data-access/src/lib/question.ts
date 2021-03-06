//import { gql } from '@apollo/client';
import { gql } from 'graphql-request';

export const QUESTION_FULL = gql`
  fragment QuestionFull on Question {
    id
    type
    category
    tags
    question
    correctAnswers
    incorrectAnswers
  }
`;

export const CREATE_QUESTION = gql`
  mutation createQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      type
    }
  }
`;
export const CREATE_QUESTIONS = gql`
  mutation createQuestions($input: [CreateQuestionInput!]!) {
    createQuestions(input: $input) {
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

export const GET_USER_QUESTIONS = gql`
  ${QUESTION_FULL}
  query getuserQuestions {
    userQuestions {
      ...QuestionFull
    }
  }
`;

export const GET_RANDOM_QUESTIONS = gql`
  query getRandomQuestions($count: Int!) {
    randomQuestions(count: $count) {
      id
      type
      category
      tags
      question
      answers
    }
  }
`;
