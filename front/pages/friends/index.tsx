import { useUserInfoState } from "../../context/userContext";
import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Container } from "../../themes/styles";
import toast, { Toaster } from "react-hot-toast";
import Chat from "../../components/chat2/chat";
import Spinner from "../../components/chat2/spinner";
import { Message, MessageSendHandler, SendClickHandler } from "../../constants/types";
import { GET_USER_QUERY_COOKIES } from "../../Apollo/query/user";
import { useQuery } from "@apollo/client";
const Friends: React.FC = () => {
    const { id: userId } = useUserInfoState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false); // Ajoutez cet état
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_USER_QUERY_COOKIES)

    useEffect(() => {
        if (queryData) {
            console.log("queryData ", queryData)
        }
    }, [queryData])

    useEffect(() => {
        // This is a placeholder for fetching historical messages
        // For example:
        // fetchMessages().then(data => setMessages(data));
        setLoading(false);
    }, []);

    const onMessageSend: MessageSendHandler = useCallback((currentID, setDeliveryStatus) => {
        setDeliveryStatus();
    }, []);

    const onSendClick: SendClickHandler = useCallback((message: string) => {
        setMessages(prevMessages => [
            ...prevMessages,
            {id: Math.floor(Math.random() * 10000), isPrimary: true, date: new Date(), sent: true, message, author: 'You'}
        ]);
    }, []);

    return (
        <Container margin={0}>
            {/* <AddFriends/> */}
            {/* Placeholder for friend requests... */}
            <Chat
                defaultPosition='bottomRight'
                chatPosition={{x: 150, y: 230}}
                setOpen={setOpen} 
                open={open}
                messages={messages}
                loading={loading}
                onMessageSend={onMessageSend}
                onSendClick={onSendClick}
                spinner={<Spinner/>}
                greeting=""
                setInitialChatPosition={() => {}}>
                <div style={{padding:'10px'}}>
                    <p style={{color:'white', fontSize:'13px'}}>Welcome to support window!</p>
                    <hr/>
                    {/* <p>Here you can chat directly with moderators. They usually answer in a few hours.</p> */}
                </div>
            </Chat>
            <Toaster position="top-center" reverseOrder={false} />
        </Container>
    );
}

export default Friends;
