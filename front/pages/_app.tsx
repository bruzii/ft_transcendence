
import type { AppProps } from "next/app";
import React, { Suspense, useState } from "react";
import { useEffect, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../themes/globalstyles";
import { darkTheme, lightTheme } from "../themes/themes";
import Sidebar from "../components/Sidebar/sidebar";
import { MainContainer } from "../themes/styles";
import { ThemeContext, TokenContext, MyCustomTheme, RoleContext, RoleType } from "../context";
import { determineRole } from "../helpers/helpers";
import jwt_decode from 'jwt-decode';
import { UserInfoProvider } from "../context/userContext";
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
  const [Role, setRole] = useState<RoleType | null>(null);
  const [show, setShow] = useState(false);
  const pathaname = router.pathname;
  // Utilisez useEffect pour surveiller les changements du jeton dans le localStorage
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const url = router.asPath;
  console.log("url", url)

  useEffect(() => {
    if (url.includes("login") || url.includes("register") || url.includes("otp")) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [url])
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


  const themeStyle: MyCustomTheme = theme === "light" ? lightTheme : darkTheme;
  return (
    <>
    <ApolloProvider client={client}>
      <TokenContext.Provider value={{ Token, setToken }}>
        <RoleContext.Provider value={{ Role, setRole }}>
          <ThemeContext.Provider value={{ setTheme, theme }}>
              <ThemeProvider theme={themeStyle}>
                  <GlobalStyle />
                  <UserInfoProvider>
                    <MofifSettingProvider>
                  <MainContainer bool={Token === null}>
                   {show && <Sidebar/>}
                    <Component {...pageProps}/> 
                   {/* {loading || isLoading || (Role === null && (!router.pathname.includes("/login") && !router.pathname.includes("/register") && !router.pathname.includes("/otp") )) ? <div><Loader/></div> :<Component {...pageProps}/> } */}
                  </MainContainer>
                  </MofifSettingProvider>
                  </UserInfoProvider>
              </ThemeProvider>
            </ThemeContext.Provider>
          </RoleContext.Provider>
        </TokenContext.Provider>
      </ApolloProvider>
    </>
  );
}

