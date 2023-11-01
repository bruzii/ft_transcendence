import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";
  import { GET_USER_QUERY } from '../Apollo/query/user';
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "../constants/types";
import { useQuery } from "@apollo/client";
import { useToken } from "../hooks";
import { io } from "socket.io-client";
// import { UserInfoDataType } from "../constants/interfaces";

  interface IUserInfoContext {
    UserInfoData: any;
    setUserInfoData: Dispatch<SetStateAction<any>>;
    onHandleSetid: (nb: number) => void;
    id: number | null;
    socket: any;
  }
  
  const UserInfoContext = createContext<IUserInfoContext>({
    UserInfoData: {},
    setUserInfoData: () => {},
    onHandleSetid: () => {},
    id: null,
    socket: null,
  });
  
  interface IProps {
    children: ReactNode;
  }

  interface UserInfoDataType {
    email: string,
    userName: string,
    lastName: string,
    tel: string,
    dateOfBirth: string,
    xp: number,
    level: number,
  }

  export function UserInfoProvider({ children }: IProps) {
    const [email, setEmail] = useState<string | null>(null);
    const [id, setid] = useState(1);
    const [socket] = useState(() => io(`${process.env.NEXT_PUBLIC_URL}:3000`))
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_USER_QUERY, {
      variables: { email: email },
      skip: !email,
    });
    const [UserInfoData, setUserInfoData] = useState<number | null>(null);
    useEffect(() => { 
      console.log("UserInfoData 2", UserInfoData)
    }, [UserInfoData])


    console.log("queryData 1", queryData)
  
    function onHandleSetid(nb: number) {
      setid(nb);
    }
    return (
      <UserInfoContext.Provider
        value={{ UserInfoData, setUserInfoData, id, onHandleSetid, socket}}
      >
        {children}
      </UserInfoContext.Provider>
    );
  }
  
  export function useUserInfoState() {
    return useContext(UserInfoContext);
  }
  