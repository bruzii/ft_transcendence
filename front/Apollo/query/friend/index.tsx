import { gql } from '@apollo/client';

export const GET_FRIENDS = gql`
    query getFriends($userId: Int!) {
        friendByUserId(userId: $userId) {
            lastName
            firstName
            id
        }
    }
`;


export const GET_FRIENDS_PENDING = gql`
    query getFriendPrending($userId: Int!) {
        getFriendPrending(userId: $userId) {
            lastName
            firstName
            id
        }
    }
`;