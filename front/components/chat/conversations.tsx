import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GET_MESSAGES_FOR_CHATROOM } from '../../Apollo/query/chat';
import { useQuery } from '@apollo/client';
import { parse } from 'path';
import io from 'socket.io-client';
import toast, { Toaster } from "react-hot-toast";
import { MessageProps } from '../../constants/types';
import { use } from 'echarts';
import { FiMoreVertical } from 'react-icons/fi';
import { BiMessageRoundedAdd } from 'react-icons/bi';
import { AiFillLock } from 'react-icons/ai';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiFillUnlock } from 'react-icons/ai';
import { AiOutlineLogout } from 'react-icons/ai';
import { set } from 'react-hook-form';
import { PopupContainer } from './styles';

const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #333;
    color: white;
    width: 100%;
    background-color: #f5f5f5;
`;

const ChatArea = styled.div`
    height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 20px;
`;

const Message = styled.div`
    margin-bottom: 15px;
    .sender {
        font-weight: bold;
        color: #666;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;

    .send-button {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        padding: 5px 10px;
        display: flex;
        align-items: center;
    }
`;

const StyledSelect = styled.select`
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  appearance: none;
  background-color: #f5f5f5;
  &:hover {
    background-color: #e8e8e8;
  }
  &:focus {
    outline: none;
    border-color: #aaa;
  }
`;

const DropdownMenu = styled.div`
    position: absolute;
    background-color: #f9f9f9;
    min-width: 100px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    right: 0;
    top: 30px;
    cursor: pointer;
`;

const DropdownItem = styled.div`
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    font-size: 12px;

    display: block;
`;

const Conversation = () => {
    const router = useRouter();
    const [user, setUser] = useState(2);
    const [popup, setPopup] = useState(false);
    const [listUser, setListUser] = useState<object[] | null>(null);
    const [socket] = useState(() => io('http://localhost:3000'))
    const { id } = router.query;
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [messages, setMessages] = useState<null | object[]>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [groupName, setGroupName] = useState<string | null>(null);
    const { data, loading, error } = useQuery(GET_MESSAGES_FOR_CHATROOM, {
        variables: {
            chatRoomId: Number(id),
        },
        skip: typeof id === "undefined",
    });
    console.log(JSON.stringify(error, null, 2));

    useEffect(() => {
        // Lorsque le composant est monté, écoutez les nouveaux messages
        socket.emit('join', `channel_${id}`);
        socket.on('message::receive::user::add', (message) => {
            // setMessages(prevMessages => [...prevMessages, message]);
            console.log("message 22 ", message)
            setMessages(prevMessages => [...(prevMessages || []), message]);
        });

        // Rejoindre un canal spécifique (par exemple, 'channel_1')

        return () => {
            // Lorsque le composant est démonté, arrêtez d'écouter les messages et quittez le canal
            socket.off('message::receive::user::add');
            socket.emit('leave', `channel_${id}`);
        };
    }, [socket]);

    useEffect(() => {
        if (data && data.getAllMessagesFromChatRoom) {
            console.log("data ", data);
            setMessages(data.getAllMessagesFromChatRoom);
            setIsPublic(data.getAllMessagesFromChatRoom[0].chatRoom?.password ? false : true)
            setListUser(data.getAllMessagesFromChatRoom[0].chatRoom?.users);
            const userArray = data?.getAllMessagesFromChatRoom[0].chatRoom?.users.map((user: any) => { console.log(user); return user.firstName});
            console.log("userArray ", userArray)
            let name : string | null = null;
            data.getAllMessagesFromChatRoom.chatRoom?.name ? name = data.getAllMessagesFromChatRoom.chatRoom?.name : name = userArray?.join(", ");
            name && setGroupName(name);
        }   
    }, [data]);
    if (typeof id === "undefined") {
        return null;
    }

    const senMessageUser = () => {

        if (currentMessage){ 
            console.log("currentMessage ", currentMessage)
            const data = {
                content: currentMessage,
                userId: user,
                roomId: Number(id)
            }
            socket.emit('message::user:add', {
                ...data,
                // Ajoutez d'autres champs comme l'id et le hash si nécessaire
            });
            console.log("messages 1", messages)
        }
    }

    useEffect(() => {
        console.log("messages ", messages)
    }, [messages])

    const handleAction = (action: string, userId: number) => {
        switch(action) {
            case 'admin':
                // Code pour promouvoir l'utilisateur en tant qu'administrateur
                break;
            case 'user':
                // Code pour rétrograder l'utilisateur en tant qu'utilisateur normal
                break;
            case 'delete':
                // Code pour supprimer l'utilisateur
                break;
            case 'block':
                // Code pour bloquer l'utilisateur
                break;
            case 'mute':
                break;
                case 'mute':
                // Code pour mettre l'utilisateur en muet
                break;
            default:
                // Autres actions ou erreurs
                break;
        }
    }
    
    
    return (
        <Container>
            <Header>
                <h1>{groupName && groupName}</h1>
                <div style={{display:'flex', gap:'20px'}}>
                    <BiMessageRoundedAdd color='black' size={30} onClick={() => setPopup(!popup)}/>
                    <AiOutlineInfoCircle color='black' size={30} onClick={() => setPopup(!popup)}/>
                   
                </div>
            </Header>
            <ChatArea>
                {/* Sample Messages */}
                {messages?.map((message: any) => {
                    return (
                        <Message key={message.id}>
                            <div className="sender">{message?.user?.firstName}</div>
                            {message.content}
                        </Message>
                    );
                })}
            </ChatArea>
            <Footer>
                <input 
                type="text" 
                placeholder="Type your message..." 
                onChange={(e: any) => setCurrentMessage(e.target.value)}/>
                <button className="send-button" onClick={senMessageUser}>
                    Send <FaPaperPlane />
                </button>
            </Footer>
            {popup && 
                <PopupContainer style={{ display: 'flex', flexDirection: 'column', }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>{groupName}</h2>
                        <input type="text" value={groupName} placeholder="Nom du groupe" onChange={(e: any) => setGroupName(e.target.value)} />
                    </div>

                    {isPublic ? (
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <AiFillUnlock color='black' size={30} />
                            <h3>Public</h3>
                            <input type="password" placeholder="Définir un mot de passe" />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <AiFillLock color='black' size={30} />
                            <h3>Privé</h3>
                            <input type="password" placeholder="Changer le mot de passe" />
                        </div>
                    )}

                    <h3>Membres</h3>
                    <div style={{ overflowY: 'auto', flexGrow: 1, }}> 
                        {listUser?.map((user: any) => (
                            <div key={user.id} style={{ position: 'relative', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between'}}>
                                <h3>{user.firstName}</h3>
                                {showDropdown && selectedUserId === user.id ? (
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => handleAction("delete", user.id)}>Supprimer</DropdownItem>
                                        <DropdownItem onClick={() => handleAction("admin", user.id)}>Admin</DropdownItem>
                                        <DropdownItem onClick={() => handleAction("block", user.id)}>Bloquer</DropdownItem>
                                        <DropdownItem onClick={() => handleAction("mute", user.id)}>Muet</DropdownItem>
                                    </DropdownMenu>
                                ) : null}
                                <FiMoreVertical onClick={() => {
                                    setSelectedUserId(user.id);
                                    setShowDropdown(!showDropdown);
                                }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', alignSelf: 'flex-start' }}>
                        <AiOutlineLogout color='red' size={30} onClick={() => {/* Handle Logout */}} />
                    </div>
                </PopupContainer>
                }
        </Container>
    );
}

export default Conversation;
