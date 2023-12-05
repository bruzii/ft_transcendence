import { gql } from '@apollo/client';

export const GET_ALL_GAME_AS_PLAYER1 = gql`
    query gameAllForUserPlayer1($id: Int!) {
        gameAllForUserPlayer1(id: $id) {
            winner{
                firstName
            }
            player1{
                firstName
            }
            player2{
                firstName
            }
            scorePlayer1
            scorePlayer2
            winnerId
            startedAt
            endedAt
        }
    }
`;

export const GET_ALL_GAME_AS_PLAYER2 = gql`
    query gameAllForUserPlayer2($id: Int!) {
        gameAllForUserPlayer2(id: $id) {
            winner{
                firstName
            }
            player1{
                firstName
            }
            player2{
                firstName
            }
            scorePlayer1
            scorePlayer2
            winnerId
            startedAt
            endedAt
        }
    }
`;