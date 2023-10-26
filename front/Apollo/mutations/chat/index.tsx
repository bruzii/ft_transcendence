import { gql } from '@apollo/client';




export const CREATE_CHATROOM = gql`
mutation createChatRoom($userId: Int!, $friends: [UpdateUserInput!]!){
    createChatRoom(userId: $userId, friends: $friends){
      id
    }
  }
`;


export const ADD_USER_TO_CHATROOM = gql`
    mutation addUserToChatRoom($chatRoomId: Int!, $userId: Int!) {
        addUserToChatRoom(chatRoomId: $chatRoomId, userId: $userId) {
            id
            name
        }
    }
`;



export const DELETE_CHATROOM = gql`
  mutation deleteChatRoom($chatRoomId: Int!, $userId: Int!) {
    deleteChatRoom(chatRoomId: $chatRoomId, userId: $userId) 
  }
`;
