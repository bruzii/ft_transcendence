'use-client'
import { useState, useContext } from "react";
import { RoleContext, RoleType } from "../context";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRole } from "../hooks";
import styled from "styled-components";
import { AuthorizeUser } from "../components/Authorize";
import Router from "next/router";
import Link from "next/link";
import { Route } from "react-router-dom";
import { useToken } from "../hooks";
import { TokenContext } from "../context";
//const data = User()

const StyledLink = styled(Link)`
font-size: 30px;
color:red;
`


export default  function Home() {
  const router = useRouter();
  const protectedPaths = ["/admin", "/admin/profile", "/admin/dashbrd", "/admin/setting", "/admin/statistics"];
  const protectedUser = ["/", "/form", "/history", "/profile"]
  const token = useToken();
  const pathaname = router.pathname;
  const Role = useContext(RoleContext);
  const Token = useContext(TokenContext);

  useEffect(() => {
    const TokenStored = localStorage.getItem('token');
    console.log("Token from Home:", TokenStored);
    console.log("Role from home ", Role?.Role)
    if (!TokenStored) {
      Role?.setRole(null);
      Token?.setToken(null);
    }
  }, [Role,Token, router.pathname])
  // if(Role?.Role != RoleType.USER) {
  //   Router.push("/admin")
  // }
    return (
      <>
        <div>
          <StyledLink href="/">HOME</StyledLink>
        </div>
      </>
    );
}