
import { PopupContainer, HeaderPopup, UserChoicePopup, User } from "../chat/styles"
import { FlexCol } from "../../themes/styles"
import { useState, useEffect } from "react";
import React from "react";
import { useMutation,useQuery } from "@apollo/client";
import { GET_USER_ALL } from "../../Apollo/query/user";
import { GET_FRIENDS } from "../../Apollo/query/friend";
import { useUserInfoState } from "../../context/userContext";
import { IoIosAddCircle } from 'react-icons/io';
import { TiDelete } from 'react-icons/ti';
interface AddFriendProps {
    friends?: object[];
    handleAction?: (selectedUsers: object[]) => void;
    setPopup: (popup: boolean) => void;
    refetch: () => void;
}

const AddFriends: React.FC<AddFriendProps> = ({ friends, refetch, setPopup}) => {
    const [selectedUsers, setSelectedUsers] = useState<Object[]>([]);
    const { loading, error, data: userData } = useQuery(GET_USER_ALL);
    const { id: userId, socket} = useUserInfoState();
    const [friendsData, setFriendsData] = useState<null | [object]>(null);
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_FRIENDS, {
        variables: {
            userId: userId
        },
        skip: !userId
    })
    console.log(JSON.stringify(queryError, null, 2));

    useEffect(() => {
        socket.emit('join', `friend_1`);
        socket.on('user::addFriend::add', (data : any) => {
            // toast.success(<b>{data}</b>);
        })
        socket.on('user::removeFriend::add', (data: any) => {
            // toast.success(<b>{data}</b>);
        })
        return () => {
            // Lorsque le composant est démonté, arrêtez d'écouter les messages et quittez le canal
            socket.off('user::addFriend::add');
            socket.off('user::removeFriend::add');
            socket.emit('leave', `friend_${userId}`);
        };
    }, [socket])
    const addUser = (user: any) => {
        socket.emit('user::addFriend', {
            userId: userId,
            friendId: user.id
        });
        setPopup(false)
        setTimeout(() => {
            refetch()
        }, 400);
    };
    const [users, setUsers] = useState<null | [object]>(null);

    const removeUser = (user : any) => {
        console.log("userToRemove ", user)
        socket.emit('user::removeFriend', {
            userId: userId,
            friendId: user.id
        });
        setPopup(false)
        setTimeout(() => {
            refetch()
        }, 400);
    };

    const isFriend = (userId: number) => {
        return friendsData?.some(friend => friend.id === userId);
    };

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
        console.log("friendsData ", isFriend(3))
    }, [userData, queryData])
    console.log("selectedUsers ", selectedUsers)
    return (
        <PopupContainer>
        <HeaderPopup>
            <FlexCol>
                <h2>Ajouter un nouvelle ami(e)</h2>

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
            {users?.map(user => (
                <div key={user.id}  style={{display:'flex', justifyContent:'space-between'}}>
                    <User>{user.firstName} {user.lastName}</User>
                    {isFriend(user.id) ?
                     <span onClick={() => removeUser(user)}><TiDelete size={24} color="red"/></span>
                     : <span onClick={() => addUser(user)}><IoIosAddCircle size={24} color="green"/></span>}
                </div>
            ))}
        </UserChoicePopup>
        {/* <button onClick={() => handleAction(selectedUsers)}>Discuter</button> */}
    </PopupContainer>
    )
}

export default AddFriends;