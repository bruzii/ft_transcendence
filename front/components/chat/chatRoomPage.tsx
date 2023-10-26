import styled from "styled-components"
import { MessageProps } from "../../constants/types";
import { useEffect, useState } from "react";
import Router from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS } from "../../Apollo/query/friend";
import { FlexCol } from "../../themes/styles";
import Conversation from "./conversations";
import { CREATE_CHATROOM } from "../../Apollo/mutations/chat";
import { useRouter } from "next/router";
import { BiEdit } from 'react-icons/bi';
const PopupContainer = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    top: 50%;
    left: 50%;
    min-width: 50%;
    min-height: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 100;
`;

const HeaderPopup = styled.div`
    display: flex;
    flex: 0 0 auto;
    height: auto;   /* ou une hauteur spécifique si vous le souhaitez */
    flex-direction: row;
    justify-content: space-between;
`;

const UserChoicePopup = styled.div`
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

const User = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.2rem;
    &hover {
        cursor: pointer;
        background: #eee;
    }
`;


const Container = styled.div`
display: flex;
position: relative;
flex-direction: row;
width: 100%;
min-height: 100vh;
align-items: flex-start;
color: #000;
background: rgba(255, 255, 255, 0.50);
`;

const ChatContainer = styled.div`
display: flex;
flex-direction: column;
width: 35%;
height: 100%;
min-height: 100vh;
align-items: flex-start;
color: #000;
background: rgba(255, 255, 255, 0.50);
`;

const ActionContainer = styled.div`
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

const HeaderRoom = styled.div`
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

const Title = styled.h1`
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

const MessageHeaher = styled.div`
display: flex;
flex-direction: column;

`

type RoomProps = {
    data: {
        name: string;
        messages: {
            content: string;
            createdAt: string;
        }[]
    }[],
};

type SendMessage = {
    senMessageUser: (data: MessageProps) => void
}



const ChatRoomPage = (data :RoomProps) => {
    const [users, setUsers] = useState<null | [object]>(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userId, setUserId] = useState<number | null>(1)
    const [popup, setPopup] = useState(false)
    const [createChatRoomMutation, {loading: mutationLoading2, error: mutationError2, data: mutationData2, client}] = useMutation(CREATE_CHATROOM);
    const router = useRouter();
    const { id } = router.query;
    const { loading, error, data: friendsData } = useQuery(GET_FRIENDS, {
        variables: {
            userId: userId
        }, 
        skip: !userId
    })
    console.log(JSON.stringify(mutationError2, null, 2));

    const addUser = (user) => {
        setSelectedUsers([...selectedUsers, user]);
    };

    const removeUser = (userToRemove) => {
        console.log("userToRemove ", userToRemove)
        setSelectedUsers(selectedUsers.filter(user => user.id !== userToRemove.id));
    };
    console.log(JSON.stringify(error, null, 2));
    useEffect(() => {   
        console.log("friendsData ", friendsData)
        if (friendsData && friendsData.friendByUserId){
            console.log("friendsData.getUserAll ", friendsData.friendByUserId)
            setUsers(friendsData.friendByUserId)
        }
        console.log("users ", users)
    }, [friendsData, users])
    const handleDiscuss = async (data2: any) => {
        setPopup(false);

        const dataSend = data2.map((item: any) => {
            return { id: item.id, firstName: item.firstName, lastName: item.lastName};
        });
        
        console.log("dataSend", dataSend);
        
        try {
            console.log("userId ", userId);
        
            const {data} = await createChatRoomMutation({
                variables: {
                    userId: userId,
                    friends: dataSend, // use dataSend here instead of test
                }
            });
            console.log("data receive", data);
            const id = data.createChatRoom.id;
            // Router.push( {
            //     pathname: '/chat/[id]',
            //     query: { id: id },
            // })
            Router.push(`/chat?id=${id}`);
            // Réinitialiser le cache après la mutation
            await client.resetStore();
        } catch (error) {
            console.log("error ", error);
        }

    }

    const handleChangeChatRoom = (id: number) => {
        Router.push(`/chat?id=${id}`);
    }
        console.log("data 5", data)
    return (
        <Container>
            <ChatContainer>
            <Title>Chat<BiEdit onClick={( () => setPopup(!popup))}/></Title>
            {data.data.map((room: any, index: number) => (
                <HeaderRoom key={index} onClick={() => handleChangeChatRoom(room.id)}>
                    <h2>{room.name}</h2>
                    <h4>{room?.messages[0]?.content}</h4>
                </HeaderRoom>

            ))}
            </ChatContainer>
            <ActionContainer>
                {id ? <Conversation/> : <button onClick={() => setPopup(true)}>Envoyer un message</button>}

            </ActionContainer>
            {popup && 
                <PopupContainer>
                    <HeaderPopup>
                        <FlexCol>
                            <h2>Nouveau Message</h2>
                            <div style={{ textAlign: 'left', width: '100%' }}>
                                A: {selectedUsers.map(user => (
                                    <span key={user.id}>
                                        {user.firstName} 
                                        <button onClick={() => removeUser(user)}>x</button>
                                    </span>
                                ))}
                            </div>
                        </FlexCol>
                    </HeaderPopup>
                    <UserChoicePopup>
                        {users?.map(user => (
                            <div key={user.id} onClick={() => addUser(user)}>
                                <User>{user.firstName} {user.lastName}</User>
                            </div>
                        ))}
                    </UserChoicePopup>
                    <button onClick={() => handleDiscuss(selectedUsers)}>Discuter</button>
                </PopupContainer>}
                
        </Container>
    )
    }

export default ChatRoomPage