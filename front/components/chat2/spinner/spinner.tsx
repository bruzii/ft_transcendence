import React from 'react';
import pulse from '../../../assets/svg/message.svg';

const Spinner = () => {
  return (
    <img style={{maxHeight: '60px', maxWidth: '60px'}} src={pulse} alt="spinner"/>
  );
};

export default Spinner;