import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import Router from 'next/router';
import { InputGroup } from '../../pages/login/index'
import { VALIDATE_FORGOT_PASSWORD } from '../../Apollo/mutations/user';
import { useMutation } from '@apollo/client';
import toast, { Toaster } from "react-hot-toast";
import { useResetPassword } from '../../context/resetPassword';


const FormCardTitle = styled.p`
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
  margin-top: 0.2rem;
`;

const FormCardPrompt = styled.p`
  margin-bottom: 2rem;
  font-size: 14px;
`;

const FormCardInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 3rem;
  display: flex;
  margin-bottom: 1rem;
`;

const FormCardInput = styled.input`
width: 190px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2rem;
  text-align: start;
  left: 19%;
  transform: translateX(36px);
  position: absolute;
  z-index: 3;
  border: none;
  background-color: transparent;
`;

const FormCardInputBg = styled.div`
  width: 240px;
  height: 60px;
  margin: auto;
  inset: 0;
  bottom: 10px;
  position: absolute;
  z-index: 1;
  border-radius: 12px;
  background-color: rgba(206, 206, 206, 0.664);
`;

const CallAgain = styled.p`
  color: #5e5e5e;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const Underlined = styled.span`
  text-decoration: underline;
`;

const FormCardSubmit = styled.button`
  display: flex;
  width: 180px;
  margin: auto;
  color: white;
  border: none;
  background-color: #212121;
  font-size: 1.2rem;
  border-radius: 0.8rem;
  padding: 0.8rem 3.5rem;
  bottom: 2rem;
  left: 0;
  right: 0;
  transition: 200ms ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    opacity: 0.9;
    transform: scale(95%);
  }
`;

// Votre composant de formulaire React
const Otp = () => {
const { setResetData , onHandleBack, onHandleNext, resetData } = useResetPassword();
const [OTP, setOTP] = useState<string | null>(null)
const HandleChange = (e: any) => {
  setOTP(e.target.value)
}
const [validateForgotPassword, { loading, error, data }] = useMutation(VALIDATE_FORGOT_PASSWORD);
 const HandleSumit = async (e : any) => {
  e.preventDefault();
  if (!OTP) return toast.error(<b>OTP invalid 2</b>)
  try{
    console.log("otp", OTP)
    const { data } = await validateForgotPassword({ variables: { email: resetData?.email, otp: OTP} })
    // redirect to 1
    toast.success(<b>OTP valid</b>, {
        duration: 700,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      onHandleNext();

  } catch (err) {
    toast.error(<b>OTP invalid</b>)
    console.log(err)
  }
  }
  console.log(JSON.stringify(error, null, 2));
  useEffect(() => {
    console.log("Code ", OTP)
  }, [OTP])
  return (
    <>
      <FormCardTitle>Enter the number that we sent you</FormCardTitle>
      <FormCardPrompt>Enter last 4 digits of the number we sent by email</FormCardPrompt>
      <FormCardInputWrapper>
        <FormCardInput 
        placeholder="____"  
        maxLength={4} 
        onChange={HandleChange}
        value={OTP ? OTP : ""}
        />
        <FormCardInputBg />
      </FormCardInputWrapper>
      <CallAgain>
        <Underlined>send again</Underlined> in 5:00 minutes
      </CallAgain>
      <FormCardSubmit onClick={HandleSumit}>Submit</FormCardSubmit>
    <Toaster position="top-center" reverseOrder={false}></Toaster>
    </>
  );
};

export default Otp;
