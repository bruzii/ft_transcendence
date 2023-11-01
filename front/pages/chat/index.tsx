import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { GET_MESSAGES_FOR_CHATROOM, GET_CHATROOMS_FOR_USER } from "../../Apollo/query/chat"
import { useQuery } from "@apollo/client"
import { DELETE_CHATROOM, ADD_USER_TO_CHATROOM, CREATE_CHATROOM} from "../../Apollo/mutations/chat"
import ChatRoom from "./live-chat"
import ChatRoomPage from "../../components/chat/chatRoomPage"
import toast, { Toaster } from "react-hot-toast";
import { useUserInfoState } from "../../context/userContext"
type RoomProps = {
    name: string;
    messages: {
        content: string;
        createdAt: string;
    }[]
}



const ChatRoom2 = () => {
    const { id: userId, socket} = useUserInfoState();
    const [activeRoom, setChatRoomId] = useState<number | null>(null)
    const [chatRooms, setChatRooms] = useState<RoomProps[]>([])
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [event, setEvent] = useState('');
    const { loading, error, data } = useQuery(GET_CHATROOMS_FOR_USER, {
        variables: { userId: userId}, // Remplacez 1 par la valeur souhaitée
      });
      
    console.log(JSON.stringify(error, null, 2));
    const [createChatRoomMutation, {loading: mutationLoading2, error: mutationError2, data: mutationData2}] = useMutation(CREATE_CHATROOM)
    const [deleteChatRoomMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(DELETE_CHATROOM, {
        refetchQueries: [{
            query: GET_CHATROOMS_FOR_USER,
            variables: {userId: userId}
        }]
    })
    
    useEffect(() => {
        // Lorsque le composant est monté, écoutez les nouveaux messages
        socket.on('message::receive::add', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Rejoindre un canal spécifique (par exemple, 'channel_1')
        // socket.emit('join', 'private_24');
        socket.on('admin::join::add', (data) => {
            setEvent(data)
            console.log("data ", data)
            toast.success(<b>{data}</b>);
        })

        socket.on('admin::mute::add', (data) => {
            setEvent(data)
            console.log("data ", data)
            toast.success(<b>{data}</b>);
        })

        socket.on('admin::ban::add', (data) => {
            setEvent(data)
            console.log("data ", data)
            toast.success(<b>{data}</b>);
        })

        socket.on('user::addUser::add', (data) => {
            setEvent(data)
            console.log("data ", data)
            toast.success(<b>{data}</b>);
        })

        socket.on('message::receive::user::add', (data) => {
            setEvent(data)
            console.log("data ", data)
            toast.success(<b>{data}</b>);
        })

        return () => {
            // Lorsque le composant est démonté, arrêtez d'écouter les messages et quittez le canal
            socket.off('message::receive::add');
            socket.emit('leave', 'channel_1');
        };
    }, [socket]);

    const DeleteChatRoom = async (id: number) => {
        try{
            const {data} = await deleteChatRoomMutation({
                variables: {
                    chatRoomId: id,
                    userId: userId
                }
            })
            console.log("data ", data)
        }
        catch(error){
            console.log("error ", error)
        }
    }

    const senMessageUser = (data : MessageProps) => {
        socket.emit('message::user:add', {
            userToId: data.userToId,  // Ici, je l'ai codé en dur pour le canal 1. Assurez-vous de le remplacer par le canal approprié.
            message: data.content,
            userId: data.userId,
            // Ajoutez d'autres champs comme l'id et le hash si nécessaire
        });
        setCurrentMessage('');
    }

    console.log(JSON.stringify(mutationError, null, 2));
    useEffect(() => {
        if (data && data.getChatRoomsForUser){
            console.log("data.getChatRoomsForUser ", data.getChatRoomsForUser)
            setChatRooms(data.getChatRoomsForUser)
        }
    }, [data])


    const CreateRoom = async () => {
        try {
            const {data} = await createChatRoomMutation({
                variables: {
                    name: "test",
                    userId: userId
                },
                refetchQueries: [{
                    query: GET_CHATROOMS_FOR_USER,
                    variables: {userId: userId}
                }]
            })
            console.log("data ", data)
        } catch (error) {
            console.log("error ", error)
        }
    }

    useEffect(() => {
        console.log("actuveRoom ", activeRoom) 
        console.log("chatRooms ", chatRooms)
    }, [activeRoom, chatRooms])
    return (
        <div style={{marginLeft:'200px'}}>
{/* 
            <div onClick={CreateRoom}>Chat Room</div>
            {chatRooms.map((chatRoom) => {
                return (
                    <div key={chatRoom.id}>
                        {chatRoom.name} {chatRoom.id}
                        <button onClick={async (e: any) => { 
                        e.preventDefault()
                        console.log("chatRoom.id ", chatRoom.id)
                        DeleteChatRoom(chatRoom.id)
                        }}>Delete</button>
                
                    </div>

                )


            })
            } */}
            <ChatRoomPage data={chatRooms} />
            {/* <ChatRoom/> */}

        </div>
    )
}

export default ChatRoom2