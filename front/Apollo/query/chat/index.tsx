import { gql } from '@apollo/client';

export const GET_MESSAGES_FOR_CHATROOM = gql`
  query getAllMessagesFromChatRoom($chatRoomId: Int!) {
    getAllMessagesFromChatRoom(chatRoomId: $chatRoomId) {
    id
    content
    createdAt
    user {
      firstName
      lastName
      email
    }
    chatRoom {
        id
        name
        password
        users {
            id
            firstName
            lastName
            email
        }
    }
  }
}
`;

export const GET_CHATROOMS_FOR_USER = gql`
query getChatRoomsForUser($userId: Int!) {
    getChatRoomsForUser(userId: $userId) {
      id
      name

      users {
        id
        firstName
        lastName
        email
      }
      messages {
        content
      }
    }
  }
`
;