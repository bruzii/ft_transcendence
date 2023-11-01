import React, {FC, useEffect, useState} from 'react';
import {IconContainer, Wrapper, Circle} from "./chat-button.styles";
import { FaEnvelope, FaTimes} from 'react-icons/fa';

interface IProps {
  open: boolean,
  dragging: boolean
}

const ChatButton: FC<IProps> = ({open, dragging}) => {
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    setAnimate(!animate);
  }, [open]);

  const IconComponent = open ? FaTimes : FaEnvelope;

  return (
    <Wrapper open={open} animate={animate}>
      <Circle open={open} dragging={dragging}/>
      <IconContainer>
        <IconComponent onAnimationEnd={() => setAnimate(!animate)} className="icon" />
      </IconContainer>
    </Wrapper>
  )
}

export default ChatButton;