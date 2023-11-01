import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GET_MESSAGES_FOR_CHATROOM } from '../../Apollo/query/chat';
import { useQuery } from '@apollo/client';
import toast, { Toaster } from "react-hot-toast";
import Router from 'next/router';
import ReactDOM from 'react-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { BiMessageRoundedAdd } from 'react-icons/bi';
import { AiFillLock } from 'react-icons/ai';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiFillUnlock } from 'react-icons/ai';
import { AiOutlineLogout } from 'react-icons/ai';
import { PopupContainer } from './styles';
import { HeaderPopup, User } from './styles';
import { GET_CHATROOMS_FOR_USER } from '../../Apollo/query/chat';
import { GET_FRIENDS } from '../../Apollo/query/friend';
import { useUserInfoState } from '../../context/userContext';
import AddUser from './addUser';
import Message from '../chat2/message';
import { PiGameControllerFill } from 'react-icons/pi';

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
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 20px;
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

const DropdownMenu = styled.div`
    position: absolute;
    background-color: #f9f9f9;
    min-width: 100px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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
const MesssageHeader = styled.p`
    font-size: 12px;
    color: #000;
    margin-bottom: 5px;
    border-radius: 5px;
    `;


const Conversation = () => {
    const router = useRouter();
    const [popupAdd, setPopupAdd] = useState(false);
    const [popup, setPopup] = useState(false);
    const [listUser, setListUser] = useState<object[] | null>(null);
    const [listFriend, setListFriend] = useState<object[] | null>(null);
    const { id } = router.query;
    const [state, setState] = useState<object>({
        name: '',
        password: '',
        unLockChat: null
    });
    const [password, setPassword] = useState<string | null>(null);
    const {id : userId, socket} = useUserInfoState();
    const [unLockChat, setUnLockChat] = useState<boolean | null>(null);
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [tempPassword, setTempPassword] = useState<string>("");
    const [listMutedUser, setListMutedUser] = useState<object[] | null>(null);
    const [messages, setMessages] = useState<null | object[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [event, setEvent] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [groupName, setGroupName] = useState<string | null>(null);
    const { data, loading: loading2, error: error2, refetch } = useQuery(GET_MESSAGES_FOR_CHATROOM, {
        variables: {
            chatRoomId: Number(id),
            password: password,
        },
        
        skip: !password && !isPublic
    });
    const { loading: loading3, error: error3, data: userData, refetch: refetch3 } = useQuery(GET_CHATROOMS_FOR_USER, {
        variables: {
            userId: userId
        },
        skip: !userId
    })

    console.log(JSON.stringify(error3, null, 2));
    console.log(JSON.stringify(error2, null, 2));
    const { loading, error, data: friendsData } = useQuery(GET_FRIENDS, {
        variables: {
            userId: userId
        }, 
        skip: !userId
    })
    console.log(JSON.stringify(error, null, 2));
    

    useEffect(() => {
        if (userData && userData.getChatRoomsForUser) {
            const groupName2 = userData.getChatRoomsForUser.filter((item: any) => item.id === Number(id))
            console.log("groupName2 ", groupName2);
    
            const currentChatRoom = groupName2[0];
            
            setListUser(currentChatRoom?.users);
            setIsPublic(!currentChatRoom?.password); // If password exists, it's private, otherwise public
            setListMutedUser(currentChatRoom?.mutedUsers);
            if (currentChatRoom?.password &&( unLockChat === null || unLockChat === true ||( data && data.getAllMessagesFromChatRoom && data.getAllMessagesFromChatRoom.length === 0))) {
                console.log("kkkkkkk")
                setUnLockChat(false);
            } else {
                setUnLockChat(true);
            }
            console.log("currentChatRoom.mutedUsers ", currentChatRoom)
            const isMuted = currentChatRoom?.mutedUsers?.some((mutedUser: any) => mutedUser.id === userId);
           console.log("isMuted ", isMuted)
            setIsMuted(isMuted);

    
            // Update state in one go
            setState(prevState => ({
                ...prevState,
                name: currentChatRoom?.name || "",
                password: currentChatRoom?.password || ""
            }));
            // setMessages([]);
            setGroupName(currentChatRoom?.name 
                ? currentChatRoom.name 
                : currentChatRoom?.users.map((user: any) => user.firstName).join(", "));
            
            console.log("groupName2[0].password ", currentChatRoom?.password);
            console.log("groupName2[0].name ", currentChatRoom?.name);
            console.log("userData.getChatRoomsForUser ", userData?.getChatRoomsForUser);
            console.log("listUsers ", listUser)
        }
        // refetch();
        // refetch3();
    }, [userData, id]);
    
    useEffect(() => {
        socket.emit('join', `channel_${id}`);
        socket.emit('join', `friend_2`);
        // socket.emit('join', `game_`);
        socket.on('message::receive::user::add', (message) => {
            console.log("message 22 ", message)
            setMessages(prevMessages => [...(prevMessages || []), message]);
        });
        socket.on('admin::mute::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::UnMute::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::ban::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::join::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::remove::user::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('user::addUser::add', (message) => {
            console.log("message 22 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::update::chat::add', (message) => {
            console.log("message 221 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('admin::setPrivate::chat::add', (message) => {
            console.log("message 221 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('game::launch::add', (message) => {
            console.log("message 221 ", message)
            refetch();
            setEvent(message);
        });
        socket.on('game::create::add', (message) => {
            console.log("message 221 ", message)
            refetch();
            setEvent(message);
        });
        // Rejoindre un canal spécifique (par exemple, 'channel_1')
        refetch();
        return () => {
            // Lorsque le composant est démonté, arrêtez d'écouter les messages et quittez le canal
            socket.off('message::receive::user::add');
            socket.off('admin::mute::add');
            socket.off('admin::UnMute::add');
            socket.off('admin::ban::add');
            socket.off('admin::join::add');
            socket.off('admin::remove::user::add');
            socket.off('user::addUser::add');
            socket.off('admin::update::chat::add');
            socket.off('admin::setPrivate::chat::add');
            socket.off('game::create::add');
            socket.off('game::launch::add');
            socket.emit('leave', `channel_${id}`);
            socket.emit('leave', `friend_3`);
        };
    }, [socket, id]);

    const isThere = ( id: number) => {
        return listMutedUser?.some((mutedUser: any) => { return mutedUser.id === id });
    }

    useEffect(() => {
        console.log("messages", messages)
    }, [messages])
    
    useEffect(() => {
        console.log("data 333", data);
        
        if (data && data.getAllMessagesFromChatRoom && data.getAllMessagesFromChatRoom.length > 0) {
            console.log("data.getAllMessagesFromChatRoom", data.getAllMessagesFromChatRoom)
            setMessages(prevMessages => [...(prevMessages || []), ...(data.getAllMessagesFromChatRoom || [])]);

        console.log("messages", messages)
            const userArray = data.getAllMessagesFromChatRoom[0].chatRoom?.users.map((user) => user.firstName);
            console.log("userArray ", userArray);
    
            let name = data.getAllMessagesFromChatRoom.chatRoom?.name || userArray?.join(", ");
            name && setGroupName(name);
        } else if (data && data.getAllMessagesFromChatRoom && data.getAllMessagesFromChatRoom.length === 0) {
            console.log("ALERT");
            setMessages([]);
        }
    
        if (friendsData && friendsData.friendByUserId) {
            console.log("friendsData.getUserAll 2", friendsData.friendByUserId);
            setListFriend(friendsData.friendByUserId);
        }
    
        console.log("userId ", userId);
    
    }, [data, event, friendsData, password, id]);

    if (typeof id === "undefined") {
        return null;
    }

    const senMessageUser = () => {

        if (currentMessage){ 
            console.log("currentMessage ", currentMessage)
            const data = {
                content: currentMessage,
                userId: userId,
                roomId: Number(id)
            }
            socket.emit('message::user:add', {
                ...data,
                // Ajoutez d'autres champs comme l'id et le hash si nécessaire
            });
            console.log("messages 1", messages)
        }
    }


    const handleAction = (action: string, userId1: number) => {
        console.log("action ", action)
        const data = {
            adminId: userId,
            userId: userId1,
            chatRoomId: Number(id)
        }
        
        switch(action) {
            
            case 'admin':
                socket.emit('admin::join', {
                    ...data,
                });
                break;
            case 'user':
                // Code pour rétrograder l'utilisateur en tant qu'utilisateur normal
                break;
            case 'delete':
                socket.emit('message::user:add', {
                    ...data,
                    // Ajoutez d'autres champs comme l'id et le hash si nécessaire
                });
                break;
            case 'block':
                socket.emit('admin::ban', {
                    ...data,
                });
                break;
            case 'mute':
                console.log("data mute", data)
                socket.emit('admin::mute', {
                    ...data,
                });
                break;
            case 'unmute':
                socket.emit('admin::UnMute', {
                    ...data,
                });
                break;
            case 'remove':
                socket.emit('admin::remove::user', {
                    ...data,
                });
                break;
            default:
                // Autres actions ou erreurs
                break;
        }
        setPopup(false);
        setShowDropdown(false);
    }

    const handleAddUser = (selectedUsers: object[]) => {
        const data = {
            adminId: userId,
            chatRoomId: Number(id),
            userId: selectedUsers
        }
        console.log("data ", data)
        socket.emit('user::addUser', {
            ...data,
        });
        setPopupAdd(false);
    }

    const updateGroupName = () => {
        if (state.name !== ""){

        const data = {
            chatRoomId: Number(id),
            adminId: userId,
            updateChatDto: {
            name: state.name,
            }
        }
        console.log("data ", data)
        socket.emit('admin::update::chat', {
            ...data,
        });
        refetch3();
        }
    }

    const updatePassword = () => {
        if (state.password !== ""){

        const data = {
            chatRoomId: Number(id),
            adminId: userId,
            password: state.password,
        }
        console.log("data ", data)
        socket.emit('admin::setPrivate::chat', {
            ...data,
        });
        refetch3();
        }
    }

    const SendInviteGame = () => {
        const player2 = listUser?.filter((user: any) => user.id !== userId)
        if (!listUser || player2?.length === 0) return;

        console.log("userId ", userId);
        
        // At this point, TypeScript knows player2 can't be undefined, 
        // but you might still need to assert the type to access the 'id' property
        const firstPlayer = player2[0] as any;
        
        const data = {
            message:" Rejoigner la partie",
            userId: userId,
            roomId: Number(id),
            player2Id: firstPlayer.id,
            player1Id: userId,
        };
        
        console.log("data we ", data);
        
        socket.emit('game::create', {
            ...data,
        });
    }
    
    return (
        <Container>
            <Header>
                <h1>{groupName && groupName}</h1>
                <div style={{display:'flex', gap:'20px'}}>
                    { listUser?.length === 2 && <PiGameControllerFill color='black' size={30} onClick={SendInviteGame} />}
                    <BiMessageRoundedAdd color='black' size={30} onClick={() => setPopupAdd(!popupAdd)}/>
                    <AiOutlineInfoCircle color='black' size={30} onClick={() => setPopup(!popup)}/>
                </div>
            </Header>
            <ChatArea>
                {messages?.map((message: any) => {
                    return (
                        <>
                       {
                        message.isInvite ?
                        <button 
                        onClick={() => {
                            Router.push("/game")
                        }}>Join the partie</button>
                        : (
                            <Message 
                        key={message.id}
                        id={message?.id}
                        date={message?.createdAt}
                        sent={message?.user?.id === userId}
                        author={message?.user?.firstName}
                        isPrimary={message?.user?.id === userId}
                        message={message?.content}
                         />
                        )
                       } 
                       
                        </>
                    );
                })}
                {event && <MesssageHeader>{event}</MesssageHeader>}
            </ChatArea>
            <Footer>
                {
                !isMuted && (
                        <>
                <input 
                type="text" 
                placeholder="Type your message..." 
                onChange={(e: any) => setCurrentMessage(e.target.value)}/>
                <button className="send-button" onClick={senMessageUser}>
                    Send <FaPaperPlane />
                </button>
                        </>
                    )
                }
            </Footer>
            {popup ?
                <PopupContainer style={{ display: 'flex', flexDirection: 'column', }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection:'column'}}>
                        <h2>Nom du Groupe</h2>
                        <div>
                        <input 
                        type="text" 
                        value={state.name} 
                        placeholder="Nom du groupe" 
                        onChange={(e: any) => setState(prevState => ({ ...prevState, name: e.target.value }))}
                        />
                        <button onClick={updateGroupName}>Valider</button>
                        </div>
                    </div>

                    {isPublic ? (
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <AiFillUnlock color='black' size={30} />
                            <h3>Public</h3>
                            <input 
                            type="password" 
                            value={state.password} 
                            placeholder="Définir un mot de passe" 
                            onChange={(e: any) => setState(prevState => ({ ...prevState, password: e.target.value }))}
                            />
                            <button onClick={updatePassword}>Valider</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <AiFillLock color='black' size={30} />
                            <h3>Privé</h3>
                            <input type="password" placeholder="Changer le mot de passe" />
                        </div>
                    )}

                    <h3>Membres</h3>
                    <div style={{ overflowY: 'auto', flexGrow: 1, display:'flex', flexDirection:'column', gap:'15px'}}> 
                        {listUser?.map((user: any) => (
                            <div key={user.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <h3>{user.firstName}</h3>
                                {showDropdown && selectedUserId === user.id ? (
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => handleAction("remove", user.id)}>Supprimer</DropdownItem>
                                        <DropdownItem onClick={() => handleAction("admin", user.id)}>Admin</DropdownItem>
                                        <DropdownItem onClick={() => handleAction("block", user.id)}>Bloquer</DropdownItem>
                                        <DropdownItem onClick={() => handleAction(!isThere(user.id) ? "mute" : "unmute", user.id)}>
                                            {!isThere(user.id) ? "Muet" : "Unmuted"}
                                        </DropdownItem>

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
                :  listFriend && popupAdd && (
                    <AddUser friends={listFriend} handleAction={handleAddUser} setPopup={setPopupAdd}/>
                )
                }
                {unLockChat === false && ( 
                    <PopupContainer>
                    <input
                        type="password"
                        value={tempPassword}
                        placeholder="Mot de passe"
                        onChange={(e: any) => setTempPassword(e.target.value)}
                    />
                       <button onClick={() => {
                        if(tempPassword) {
                            setPassword(tempPassword);
                            setTimeout(() => {
                            refetch();
                            }, 1000)
                            
                            setUnLockChat(true);
                        }
                    }}>Valider</button>

                    </PopupContainer>
                )}
        </Container>
    );
}

export default Conversation;
