import React, { useState, useEffect } from 'react';
import { set } from 'react-hook-form';
import io from 'socket.io-client';
import toast, { Toaster } from "react-hot-toast";
import Message from '../../components/chat/message';


const DataMessage = [
    {
        content: "Bonjour",

    },
    {
        content: "Bonjour 2"
    },
    {
        content: "Bonjour 3"
    }
]
const Chat = () => {
    const [socket] = useState(() => io('http://localhost:3000'));  // Assurez-vous de remplacer par l'adresse de votre serveur si elle est différente.
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [event, setEvent] = useState('');
    
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

    const handleSendMessage = () => {
        if (currentMessage.trim() !== '') {
            socket.emit('message::add', {
                roomId:21,  // Ici, je l'ai codé en dur pour le canal 1. Assurez-vous de le remplacer par le canal approprié.
                message: currentMessage,
                userId: 1
                // Ajoutez d'autres champs comme l'id et le hash si nécessaire
            });
            setCurrentMessage('');
        }
    };

    const setBan = () => {
        try{
            socket.emit('admin::ban', {
                userId: 2,
                chatRoomId: 21,
                adminId: 1,
            });
        } catch (error) {
            console.log("error ", error)
        }

        setEvent('')
    }

    const setMute = () => {
        socket.emit('admin::mute', {
            userId: 2,
            chatRoomId: 21,
            adminId: 1,
        });
        setEvent('')
    }

    const setAdmin = () => {

        socket.emit('admin::join', {
            userId: 2,
            chatRoomId: 21,
            adminId: 1,
        });
        setEvent('')
    }

    const addUser = () => {
        socket.emit('user::addUser', {
            userId: [2],
            chatRoomId: 21,
            adminId: 1,
        });
        setEvent('')
    }

    const senMessageUser = () => {
        socket.emit('message::user:add', {
            userToId: 2,  // Ici, je l'ai codé en dur pour le canal 1. Assurez-vous de le remplacer par le canal approprié.
            message: currentMessage,
            userId: 1
            // Ajoutez d'autres champs comme l'id et le hash si nécessaire
        });
        setCurrentMessage('');
    }

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <div>
                <input
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                />
                <button onClick={handleSendMessage}>Envoyer</button>
                <button onClick={setAdmin}>Set Admin</button>
                <button onClick={setMute}>Set Mute</button>
                <button onClick={setBan}>Set Ban</button>
                <button onClick={addUser}>Add User</button>
                <button onClick={senMessageUser}>Send Message User</button>
            </div>
            {/* <Message data={DataMessage} /> */}
            <Toaster position='top-center' reverseOrder={false} />
        </div>
    );
};

export default Chat;
