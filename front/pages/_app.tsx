
import type { AppProps } from "next/app";
import React, { Suspense, useState } from "react";
import { useEffect, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../themes/globalstyles";
import { darkTheme, lightTheme } from "../themes/themes";
import Sidebar from "../components/Sidebar/sidebar";
import SideBarAdmin from "../components/Sidebar/sidebarAdmin";
import { MainContainer } from "../themes/styles";
import { ThemeContext, TokenContext, MyCustomTheme, RoleContext, RoleType } from "../context";
import { determineRole } from "../helpers/helpers";
import jwt_decode from 'jwt-decode';
import { FormProvider } from "../context/formContext";
import { useRouter } from "next/router";
import { ApolloProvider } from '@apollo/client';
import client from "../Apollo";
import { DecodedToken } from "../constants/types";
import { MofifSettingProvider } from "../context/ModifSetting";
import Router from "next/router";
import { Loader } from "../themes/styles";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [Token, setToken] =useState<string | null>(null);
  const [Role, setRole] = useState<RoleType | null>(null)
  const protectedPaths = ["/admin", "/admin/profile", "/admin/dashbrd", "/admin/setting", "/admin/statistics"];
  const protectedUser = ["/", "/form", "/history", "/profile"]
  const pathaname = router.pathname;
  // Utilisez useEffect pour surveiller les changements du jeton dans le localStorage
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
    console.log("BALABLA")
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    setIsLoading(true);
  };

  // useEffect(() => {
  //   const roleStored = localStorage.getItem("role");
  //   const tokenStored = localStorage.getItem("token");
  //   console.log("roleStored from APP" + roleStored)
  //   console.log("tokenStoredd from APP " + tokenStored)
  //   if (typeof roleStored !== "undefined")
  //   setRole(determineRole(roleStored));
  //   if (tokenStored !== "undefined"){
  //     console.log("YOUpi", tokenStored)
  //     setToken(tokenStored)
  //   }

  //   console.log("ROLE from APP " + Role)
  //   console.log("Tokenaxsx from APP" + Token)
  //   if (Token){

  //     const RoleDecoded = jwt_decode(Token) as DecodedToken;
  //     console.log("RoleDecoded ",RoleDecoded)
  //     setRole(determineRole(RoleDecoded.role));
  //   }
  //   if (protectedPaths.includes(router.pathname)) {
  //     console.log("TokenStored path ", tokenStored);
  //     console.log("Role?.Role ", Role)
  //     if (tokenStored && Role === RoleType.USER){
  //       console.log("Redirection vers home")
  //       router.push("/")
  //     }
  //     else if (!tokenStored){
  //       router.push("/login")
  //     }
  //     console.log('Protected path detected:', router.pathname);
  //   }
  //   if (protectedUser.includes(router.pathname)) {
  //     if (tokenStored && (Role === RoleType.Admin || Role === RoleType.SuperAdmin)){
  //       console.log("Redirection vers Admin")
  //       router.push("/admin")
  //     }
  //     else if (!tokenStored){
  //       router.push("/login")
  //     }
  //     // console.log('Protected path detected:', router.pathname);
  //   }
  // }, [Role,Token, router.pathname]);


  const themeStyle: MyCustomTheme = theme === "light" ? lightTheme : darkTheme;
  return (
    <>
    <ApolloProvider client={client}>
      <TokenContext.Provider value={{ Token, setToken }}>
        <RoleContext.Provider value={{ Role, setRole }}>
          <ThemeContext.Provider value={{ setTheme, theme }}>
              <ThemeProvider theme={themeStyle}>
                  <GlobalStyle />
                  <FormProvider>
                    <MofifSettingProvider>
                  <MainContainer bool={Token === null}>
                   <Sidebar/>
                    <Component {...pageProps}/> 
                   {/* {loading || isLoading || (Role === null && (!router.pathname.includes("/login") && !router.pathname.includes("/register") && !router.pathname.includes("/otp") )) ? <div><Loader/></div> :<Component {...pageProps}/> } */}
                  </MainContainer>
                  </MofifSettingProvider>
                  </FormProvider>
              </ThemeProvider>
            </ThemeContext.Provider>
          </RoleContext.Provider>
        </TokenContext.Provider>
      </ApolloProvider>
    </>
  );
}

