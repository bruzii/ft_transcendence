'use-client'
import { useEffect, useContext } from "react";
import { useState } from "react";
import { subtle } from "crypto";
import styled, { css } from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { RoleContext } from "../../context";

import { useToken } from "../../hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import { ResetPasswordProvider } from "../../context/resetPassword";
import HandleStep from "../../components/Login/step";
import { Input } from "../../themes/styles";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  gap: 50px;
`;

export const InputGroup = styled.div`
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
const Note = styled.p`
  font-size: 0.75rem;
  color: #8b8e98;
  text-decoration: underline;
`;

const ForgotPwd = styled.span`
  font-size: 12px;
`;



const Login = () => {
  const [sentEmail, setSentEmail] = useState(false);
  const [url, setUrl] = useState("http://localhost");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_URL) {
      setUrl(process.env.NEXT_PUBLIC_URL);
    }
  }, []);
  
  return (
    <form method="GET" action={`${process.env.NEXT_PUBLIC_URL}:3000/auth`}>
      <Container>
        <InputGroup>
        <LogoContainer>
  
        </LogoContainer>
        <TitleContainer>
          <Title>Connectez-vous</Title>
          <Subtitle>
            Ouvrez les portes de l'exceptionnel en vous connectant avec 42.
          </Subtitle>
        </TitleContainer>
        <button type="submit">Se Connecter avec 42</button>
        </InputGroup>
      </Container>
    </form>
  );
};

export default Login;
{/* <InputGroup>
<div>
      <LogoContainer>
  
      </LogoContainer>
      <TitleContainer>
        <Title>Connectez-vous</Title>
        <Subtitle>
          Ouvrez les portes de l'exceptionnel en vous connectant avec 42.
        </Subtitle>
      </TitleContainer>
      <form method="GET" action={`localhoist:3000/auth`}>
        <button type="submit">Se Connecter avec 42</button>
      </form>
      <div style={{ display: "flex", justifyContent: "space-between", width:'100%', color: '#000' }}>
            <ForgotPwd onClick={() => setSentEmail(!sentEmail)}>Forgot password ?</ForgotPwd>
          <Link href="/register">
            <ForgotPwd>Don't have an account ? Sign in</ForgotPwd>
          </Link>
      </div>
      <Note>Terms of use &amp; Conditions</Note>
    </div>
</InputGroup> */}