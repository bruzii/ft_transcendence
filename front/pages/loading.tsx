import { useState, useEffect } from "react";
import Router from "next/router";
import { ReactNode } from "react";

interface IProps {
    children: React.ReactNode;
  }
const LoadingWidget = ({ children }: IProps) => {
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

  return loading || isLoading ? <div>Loading...</div> : {children};
};

export default LoadingWidget;