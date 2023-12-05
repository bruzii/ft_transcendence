import { useQuery } from '@apollo/client';
import { Box, Container, Title } from "../../themes/styles";
import { GET_ALL_GAME_AS_PLAYER1, GET_ALL_GAME_AS_PLAYER2 } from '../../Apollo/query/game';
import { useEffect, useState } from "react";
import { useUserInfoState } from '../../context/userContext';
import styled from "styled-components";
import Accordion from './accordeon';
  
const Statistic = styled.p`
  /* styles pour vos statistiques */
`;

const GameList = styled.ul`
  list-style: none;
  /* styles supplémentaires si nécessaire */
`;

const GameItem = styled.li`
display: flex;
flex-direction: column;
align-items: center;
gap: 10px;
  margin-bottom: 10px;
  /* styles supplémentaires pour chaque élément de jeu */
`;

const History = () => {
  const { id: userId } = useUserInfoState();
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);

  const {
    loading: loading1,
    error: error1,
    data: data1
  } = useQuery(GET_ALL_GAME_AS_PLAYER1, { variables: { id: userId } });

  const {
    loading: loading2,
    error: error2,
    data: data2
  } = useQuery(GET_ALL_GAME_AS_PLAYER2, { variables: { id: userId } });

  useEffect(() => {
    if (data1 && data2) {
      const winsAsPlayer1 = data1.gameAllForUserPlayer1.reduce((acc, game) => acc + (game.winnerId === userId ? 1 : 0), 0);
      const winsAsPlayer2 = data2.gameAllForUserPlayer2.reduce((acc, game) => acc + (game.winnerId === userId ? 1 : 0), 0);
      const lossesAsPlayer1 = data1.gameAllForUserPlayer1.length - winsAsPlayer1;
      const lossesAsPlayer2 = data2.gameAllForUserPlayer2.length - winsAsPlayer2;

      setTotalWins(winsAsPlayer1 + winsAsPlayer2);
      setTotalLosses(lossesAsPlayer1 + lossesAsPlayer2);
    }
  }, [userId, data1, data2]);

  const renderGameDetails = (game, playerNumber) => (
    <GameItem key={`${game.startedAt}-${playerNumber}`}>
      <div style={{color:'black'}}>Date: {new Date(game.startedAt).toLocaleDateString()}</div>
      <div style={{display:'flex', width:'100%'}}>
        <div style={{color:'black'}}>{game.player1.firstName} {game[`scorePlayer${playerNumber}`]} - {game[`scorePlayer${playerNumber === 1 ? 2 : 1}`]} {game?.player2.firstName}</div>
        {/* <div style={{color:'black'}}>Gagnant: {game.winner ? game.winner.firstName : 'En cours'}</div> */}
      </div>
    </GameItem>
  );

  if (loading1 || loading2) return <Container><Box>Chargement...</Box></Container>;
  if (error1 || error2) return <Container><Box>Erreur lors du chargement de l'historique des jeux.</Box></Container>;

  return (
    <Container>
      <Box>
        <Title>Historique des événements</Title>
        <Statistic>Total des victoires: {totalWins}</Statistic>
        <Statistic>Total des défaites: {totalLosses}</Statistic>
        <h2>Parties</h2>
        <GameList>
          {data1 && data1.gameAllForUserPlayer1.map(game => renderGameDetails(game, 1))}
          {data2 && data2.gameAllForUserPlayer2.map(game => renderGameDetails(game, 2))}
        </GameList>
      </Box>
    </Container>
  );
};

export default History;
