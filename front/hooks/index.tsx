import { useContext, useEffect } from "react";
import { TokenContext, RoleType, RoleContext } from "../context";

export function useToken() {
    const Token = useContext(TokenContext);
    if (Token === null) {
      throw new Error("useToken must be used within a TokenProvider");
    }

    return Token ;
  }

export function useRole( ) {
  const Role = useContext(RoleContext);
  useEffect(() => {
    console.log("ROLE FROM HOOK " + Role )
  },[Role])
  return Role;
  }