import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($userName: String!, $lastName: String!, $email: String!, $password: String!) {
    createUser(userName: $userName, lastName: $lastName, email: $email, password: $password) {
      token
      role
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    LoginUser(email: $email, password: $password) {
    id
    token
    role
    }
  }
`;

export const UPDATE_USER = gql`
mutation updateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    userName
    email
    lastName
  }
}

`;
