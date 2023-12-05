'use-client'
import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useUserInfoState } from "../context/userContext";
import Router from "next/router";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { Route } from "react-router-dom";
import { useRouter } from "next/router";
import { DecodedToken } from "../constants/types";

const StyledLink = styled(Link)`
font-size: 30px;
color:red;
`


export default  function Home() {
  const {onHandleSetid, id: userId} = useUserInfoState();
  const route = useRouter();

  useEffect(() => {
    if (!route.isReady) return;
    const {token } = route.query;
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token as string);
      const { userId, twoFA } = decodedToken;
      console.log("decodedToken", decodedToken)
      console.log("id", userId)
      onHandleSetid(userId);
      if (twoFA) {
        Router.push("/login/step");
      } else {
        Router.push("/");
      }
    }
  }, [route.isReady]);

  useEffect(() => {
    console.log("userId", userId)
  }, [userId])


    return (
      <>
        <div>
          <StyledLink href="/">HOME</StyledLink>
        </div>
      </>
    );
}