import { gql } from '@apollo/client';

export const GET_MESSAGES_FOR_CHATROOM = gql`
  query getAllMessagesFromChatRoom($chatRoomId: Int!, $password: String) {
    getAllMessagesFromChatRoom(chatRoomId: $chatRoomId, password: $password) {
    id
    content
    createdAt
    isInvite
    user {
      firstName
      lastName
      email
      id
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
        mutedUsers{
          id
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
      password
      users {
        id
        firstName
        lastName
        email
      }
      messages {
        content
      }
      mutedUsers{
        id
    }
    }
  }
`
;