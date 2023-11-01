import React, {FC, useEffect, useState} from 'react';
import {MessageContainer, MessageHeading, MessageText} from "./message.styles";
import {Message as IMessage, MessageSendHandler} from '../../../constants/types';
import { FaCheckDouble } from 'react-icons/fa';
import indicator from '../../../assets/images/message.svg';



interface IProps extends IMessage {
  onMessageSend?: MessageSendHandler,
  author: string
}

const Message: FC<IProps> = ({id, isPrimary, message, date, onMessageSend, sent, author}) => {
  const [isSent, setSent] = useState<boolean>(sent);

  useEffect(() => {
    if (onMessageSend) {
      onMessageSend(id, () => setSent(true));
    }
    else {
      setSent(true);
    }
  }, [onMessageSend, id]);
  console.log("date 3", date)
  return (
    <MessageContainer author={isPrimary}>
      <MessageHeading>{isPrimary ? 'You' : author}</MessageHeading>
      <MessageText>{message}</MessageText>
      <div>
      <span>
        {date 
          ? new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString() 
          : new Date().toDateString() + ' ' + new Date().toLocaleTimeString()}
      </span>

        {
          isPrimary ?
            <span>
              {
                isSent ? <FaCheckDouble/> : <img src={indicator} alt="message-indicator"/>
              }
            </span> : null
        }
      </div>
    </MessageContainer>
  )
}

export default Message;