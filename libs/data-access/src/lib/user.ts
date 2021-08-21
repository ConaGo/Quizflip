import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query {
    users {
      id
      email
      name
    }
  }
`;

export const GET_USER = gql`
  query findUserById($id: Int!) {
    findUserById(id: $id)
  }
`;

export const DELETE_USER_BY_ID = gql`
  mutation removeUser($id: Int!) {
    removeUserById(id: $id)
  }
`;

export const DELETE_USER_BY_EMAIL = gql`
  mutation removeUser($email: String!) {
    removeUserByEmail(email: $email)
  }
`;
