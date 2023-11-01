import { PopupContainer, HeaderPopup, UserChoicePopup, User } from "./styles"
import { FlexCol } from "../../themes/styles"
import { useState } from "react";
import React from "react";
interface AddUserProps {
    friends: object[];
    handleAction: (selectedUsers: object[]) => void;
    setPopup: (popup: boolean) => void;
}

const AddUser: React.FC<AddUserProps> = ({ friends, handleAction, setPopup}) => {
    const [selectedUsers, setSelectedUsers] = useState<Object[]>([]);

    const addUser = (user: any) => {
        setSelectedUsers([...selectedUsers, user]);
    };

    const removeUser = (userToRemove) => {
        console.log("userToRemove ", userToRemove)
        setSelectedUsers(selectedUsers.filter(user => user.id !== userToRemove.id));
    };
    console.log("friends ", friends)
    console.log("selectedUsers ", selectedUsers)
    return (
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
            <button onClick={() => setPopup(false)}>X</button>
        </HeaderPopup>
        <UserChoicePopup>
            {friends?.map(user => (
                <div key={user.id} onClick={() => addUser(user)}>
                    <User>{user.firstName} {user.lastName}</User>
                </div>
            ))}
        </UserChoicePopup>
        <button onClick={() => handleAction(selectedUsers)}>Discuter</button>
    </PopupContainer>
    )
}

export default AddUser;