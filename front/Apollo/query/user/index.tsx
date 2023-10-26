import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query userOne($id: Int!) {
    userOne(id: $id) {
    id
    lastName
    firstName
    email
    xp
    userName
    TwoFA
    }
  }
`;

export const GET_USER_ALL = gql`
  query userAll {
    userAll {
      lastName
      id
      firstName
      friends{
        friendId
        friend{
          lastName
        }
      }
    }
  }
`;