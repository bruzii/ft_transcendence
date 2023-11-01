
import { PopupContainer, HeaderPopup, UserChoicePopup, User } from "../chat/styles"
import { FlexCol } from "../../themes/styles"
import { useState, useEffect } from "react";
import React from "react";
import { useMutation,useQuery } from "@apollo/client";
import { GET_USER_ALL } from "../../Apollo/query/user";
import { GET_FRIENDS } from "../../Apollo/query/friend";
import { useUserInfoState } from "../../context/userContext";
import { IoIosAddCircle } from 'react-icons/io';
import io from 'socket.io-client';
import toast, { Toaster } from "react-hot-toast";
import { TiDelete } from 'react-icons/ti';
import { ref } from "yup";
import { set } from "react-hook-form";

interface RequestPendingProps {
    friends?: object[];
    handleAction?: (selectedUsers: object[]) => void;
    setPopup: (popup: boolean) => void;
    refetch: () => void;
    refetchPending: () => void;
}

const RequestPending: React.FC<RequestPendingProps> = ({ friends, refetch, setPopup, refetchPending}) => {
    const [selectedUsers, setSelectedUsers] = useState<Object[]>([]);
    const { loading, error, data: userData } = useQuery(GET_USER_ALL);
    const { id: userId, socket } = useUserInfoState();
    const [friendsData, setFriendsData] = useState<null | [object]>(null);
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_FRIENDS, {
        variables: {
            userId: userId
        },
        skip: !userId
    })
    console.log(JSON.stringify(queryError, null, 2));

    useEffect(() => {
        socket.emit('join', `friend_3`);
        socket.on('user::acceptFriend::add', (data) => {
            console.log("data ", data)
            toast.success(<b>{data}</b>);
            refetch()
            refetchPending()
        })
        socket.on('user::refuseFriend::add', (data) => {
            console.log("data ", data)
            toast.success(<b>{data}</b>);
            refetch()
            refetchPending()
        })
        return () => {
            // Lorsque le composant est démonté, arrêtez d'écouter les messages et quittez le canal
            socket.off('user::acceptFriend::add');
            socket.off('user::refuseFriend::add');
            socket.emit('leave', `friend_3`);
        };
    }, [])

    const acceptFriend = (friendId: number) => {
        const Data = {
            userId: userId,
            friendId: friendId
        }
        console.log("Data ", Data)
        socket.emit('user::acceptFriend', {
            ...Data,
        });
        refetch();
        refetchPending()
        setPopup(false)
    };

    const refuseFriend = (friendId: number) => {
        socket.emit('user::refuseFriend', {
            userId: userId,
            friendId: friendId
        });
        refetch();
        refetchPending();
        setPopup(false)
    };

    const [users, setUsers] = useState<null | [object]>(null);

    useEffect(() => {
        if (userData && userData.userAll){
            console.log("userData.userAll ", userData.userAll)
            const user = userData.userAll.filter((item: any) => item.id !== userId)
            setUsers(user)
        }
        console.log("queryData ", queryData)
        if (queryData && queryData.friendByUserId){
            console.log("queryData.friends ", queryData.friendByUserId)
            setFriendsData(queryData.friendByUserId)
        }

        console.log("users 4 ", users)
    }, [userData, queryData]);
    console.log("selectedUsers ", selectedUsers)
    return (
        <PopupContainer>
        <HeaderPopup>
            <FlexCol>
                <h2>Demandes d'amis</h2>

                <div style={{ textAlign: 'left', width: '100%' }}>
                    A: {selectedUsers.map(user => (
                        <span key={user.id}>
                            {user.firstName} 
                            <button onClick={() => removeUser(user)}>x</button>
                        </span>
                    ))}
                </div>
            </FlexCol>
            <button onClick={() => setPopup(false)}>X</button>
        </HeaderPopup>
        <UserChoicePopup>
            {friends?.map(user => (
                <div key={user.id}  style={{display:'flex', justifyContent:'space-between'}}>
                    <User>{user.firstName} {user.lastName}</User>
                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                     <span onClick={() => refuseFriend(user.id)}><TiDelete size={24} color="red"/></span>
                     <span onClick={()=> acceptFriend(user.id)}><IoIosAddCircle size={24} color="green"/></span>
                    </div>
                </div>
            ))}
        </UserChoicePopup>
        {/* <button onClick={() => handleAction(selectedUsers)}>Discuter</button> */}
    </PopupContainer>
    )
}

export default RequestPending;