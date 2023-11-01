import styled from "styled-components"
import { useEffect, useState } from "react";
import Router from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FRIENDS } from "../../Apollo/query/friend";
import { FlexCol } from "../../themes/styles";
import Conversation from "./conversations";
import { CREATE_CHATROOM } from "../../Apollo/mutations/chat";
import { useRouter } from "next/router";
import { BiEdit } from 'react-icons/bi';
import AddUser from "./addUser";
import { useUserInfoState } from "../../context/userContext";
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
    const {id: userId} = useUserInfoState();
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

    console.log(JSON.stringify(error, null, 2));
    useEffect(() => {   
        console.log("friendsData ", friendsData)
        if (friendsData && friendsData.friendByUserId){
            console.log("friendsData.getUserAll ", friendsData.friendByUserId)
            setUsers(friendsData.friendByUserId)
        }
        console.log("users ", users)
    }, [friendsData, users])

    const GetNameGroup = (dataChat: any) => {
        console.log("data 4", data)
        if (dataChat.name) {
            return dataChat.name;
        } else {
            const name = dataChat?.users?.map((item: any) => {
                return item.firstName;
            })
            return name?.join(", ");
        }
    }
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
                    <h2>{GetNameGroup(room)}</h2>
                    <h4>{room?.messages[0]?.content}</h4>
                </HeaderRoom>

            ))}
            </ChatContainer>
            <ActionContainer>
                {id ? <Conversation/> : <button onClick={() => setPopup(true)}>Envoyer un message</button>}

            </ActionContainer>
            {popup && users &&
            <AddUser friends={users} handleAction={handleDiscuss}  setPopup={setPopup}/>
            }
                
        </Container>
    )
    }

export default ChatRoomPage