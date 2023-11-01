"use-client";
import { useEffect, useContext } from "react";
import { useState } from "react";
import { subtle } from "crypto";
import styled, { css } from "styled-components";
import axios from "axios";
import Router from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Input } from "../../components/Form/styles";
import { RoleContext, RoleType } from "../../context";
import { determineRole } from "../../helpers/helpers";
import Cookies from "js-cookie";
import { useToken } from "../../hooks";
import mail from "../assets/svg/mail.svg";
import lock from "../assets/svg/lock.svg";
import Image from "next/image";
import front from "../../assets/images/Logo_Black.png";
import { RoleProvider } from "../../context/RoleContext";
import { Label2 } from "../../themes/styles";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../Apollo/mutations/user";
import { InputContainer } from "../../themes/styles";
import { useFormState } from "../../context/userContext";
import { useRouter } from "next/router";
import LoadingWidget from "../loading";
import { ResetPasswordProvider } from "../../context/resetPassword";
import HandleStep from "../../components/Login/step";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  gap: 50px;
`;

export const InputGroup = styled.form`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px 40px 20px 40px;
  border-radius: 43px;
background: rgba(255, 255, 255, 0.50);
box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
backdrop-filter: blur(5px);
  font-family: "Inter", sans-serif;
`;

 export const LogoContainer = styled.div`
  box-sizing: border-box;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const Title = styled.p`
color: #000;
font-family: HomepageBaukasten;
font-size: 30px;
font-style: normal;
font-weight: 400;
line-height: 150%; /* 45px */
letter-spacing: 1.2px;
text-transform: uppercase;
`;

export const Subtitle = styled.span`
  max-width: 80%;
  color: var(--Black, #000);
text-align: center;
font-family: Poppins;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 150%; /* 18px */
`;



export const Button = styled.button`
  width: 100%;
  height: 40px;
  border: 0;
  outline: none;
  color: #ffffff;
  cursor: pointer;
  border-radius: 14px;
background: #000;
color: #ffffff;
`;


const Separator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1px;
  border: 0;
  background-color: #e8e8e8;
`;
const Span = styled.span`
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: white;
  font-size: 19px;
  width: 80px;
`;
const ButtonGoogle = styled.button`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 14px;
  outline: none;
  color: #242424;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  cursor: pointer;

`;

const Note = styled.p`
  font-size: 0.75rem;
  color: #8b8e98;
  text-decoration: underline;
`;

const ForgotPwd = styled.span`
  font-size: 12px;
`;

function validateEmailAndPassword(email: string, password: string): boolean {
  // Vérification de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length < 3) {
    return false;
  }
  if (!password) {
    return false;
  }
  return true;
}

const Login = () => {
  const { Token } = useToken();
  const [sentEmail, setSentEmail] = useState(false);
  const Role = useContext(RoleContext);
  const router = useRouter();

  // const OnSubmit = async (e : any) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.get('http://localhost:3000/auth');
  //     if (response.status === 200) {
  //       const { user, token } = response.data;
  //       localStorage.setItem("token", token);
  //       // Stockez d'autres données si nécessaire
  //       toast.success(<b>Login Successfully!</b>, {
  //         duration: 700,
  //         ariaProps: {
  //           role: 'status',
  //           'aria-live': 'polite',
  //         },
  //       });
  //       setTimeout(() => {
  //         Router.push("/");
  //       }, 750);
  //     } else {
  //       // Traitez les réponses non 200 ici
  //       toast.error(<b>An error occurred during login!</b>);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(<b>Password or Email Not Match!</b>);
  //   }
  // };
  const OnSubmit = (e: any) => {
    e.preventDefault();
    window.location.href = 'http://localhost:3000/auth';
};


  //console.log(state)
  return (
    <ResetPasswordProvider>
    <Container>
      <InputGroup>
         {!sentEmail
         ? (
          <><LogoContainer>
         <Image src={front} width={150} height={80} />
        </LogoContainer>
        <TitleContainer>
          <Title>Connectez-vous</Title>
          <Subtitle>
            Ouvrez les portes de l'exceptionnel en vous connectant chez NemoProd.
          </Subtitle>
        </TitleContainer>
        {/* <br /> */}
        {/* <Separator>
          <Span>Or</Span>
        </Separator> */}
           <Button onClick={OnSubmit}> Se Connecter avec 42</Button>
        <div style={{ display: "flex", justifyContent: "space-between", width:'100%', color: '#000' }}>
              <ForgotPwd onClick={() => setSentEmail(!sentEmail)}>Forgot password ?</ForgotPwd>
            <Link href="/register">
              <ForgotPwd>Don't have an account ? Sign in</ForgotPwd>
            </Link>
          </div>
        <Note>Terms of use &amp; Conditions</Note>
        
        </>)
        : (
          <HandleStep />
        )}
      </InputGroup>

      <Toaster position="top-center" reverseOrder={false}></Toaster>
    </Container>
    </ResetPasswordProvider>
  );
};

export default Login;
