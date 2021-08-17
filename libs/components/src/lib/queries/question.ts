import { GraphQLClient, gql } from 'graphql-request';
import { CreateQuestionDto } from '@libs/shared-types';

export const CreateQuestion = gql`
  mutation createQuestion($i: CreateQuestionInput) {
    Question
  }
`;
