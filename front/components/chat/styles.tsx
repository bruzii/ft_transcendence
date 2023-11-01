import styled from "styled-components";

export const PopupContainer = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    top: 50%;
    left: 50%;
    min-width: 50%;
    gap: 20px;
    min-height: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 30;
`;

export const HeaderPopup = styled.div`
    display: flex;
    flex: 0 0 auto;
    height: auto;   /* ou une hauteur spécifique si vous le souhaitez */
    flex-direction: row;
    justify-content: space-between;
`;

export const UserChoicePopup = styled.div`
    display: flex;
    flex: 1;
    max-height: 50vh;
    flex-direction: column;  /* Changé de row à column pour lister les noms d'utilisateurs verticalement */
    justify-content: flex-start;  /* Aligner les noms d'utilisateurs en haut */
    overflow-y: auto;
    padding: 20px 0px;
    & > *:not(:last-child) {  /* Sélectionne tous les éléments enfants sauf le dernier */
        margin-bottom: 25px;  /* Ajoute une marge en bas pour tous les éléments enfants sauf le dernier */
    }
`;

export const User = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.2rem;
    &hover {
        cursor: pointer;
        background: #eee;
    }
`;


export const Container = styled.div`
display: flex;
position: relative;
flex-direction: row;
width: 100%;
min-height: 100vh;
align-items: flex-start;
color: #000;
background: rgba(255, 255, 255, 0.50);
`;

export const ChatContainer = styled.div`
display: flex;
flex-direction: column;
width: 35%;
height: 100%;
min-height: 100vh;
align-items: flex-start;
color: #000;
background: rgba(255, 255, 255, 0.50);
`;

export const ActionContainer = styled.div`
display: flex;
flex-direction: column;
width: 65%;
height: 100%;
min-height: 100vh;
align-items: center;
justify-content: center;
color: #000;
border-left: 1px solid #000;
background: rgba(255, 255, 255, 0.50);
`;

export const HeaderRoom = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 100%;
align-items: flex-start;
padding: 10px 20px;
justify-content: space-around;

color: #000;
background: rgba(255, 255, 255, 0.50);
&:hover {
    background: rgba(255, 255, 255, 0.80);
    cursor: pointer;
}
`;

export const Title = styled.h1`
display: flex;
justify-content: space-around;
color: #000;
width: 100%;
align-items: center;
font-family: HomepageBaukasten;
font-size: 30px;
font-style: normal;
font-weight: 400;
line-height: 150%; /* 45px */
letter-spacing: 1.2px;
text-transform: uppercase;
`;

export const MessageHeaher = styled.div`
display: flex;
flex-direction: column;

`

