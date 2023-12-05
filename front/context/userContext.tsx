import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";
  import { GET_USER_QUERY_COOKIES } from '../Apollo/query/user';
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "../constants/types";
import { useQuery } from "@apollo/client";
import { useToken } from "../hooks";
import { io } from "socket.io-client";
import { useRouter } from 'next/router';
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
    id: number,
    firstName: string,
    intraId: number,
    TwoFA: boolean,
    email: string,
    avatar: string,
    achievements: string[],
    userName: string,
    lastName: string,
    loser: number,
    win: number,
    tel: string,
    dateOfBirth: string,
    xp: number,
    level: number,
  }

  export function UserInfoProvider({ children }: IProps) {
    const [id, setid] = useState<number | null>(null);
    const [UserInfoData, setUserInfoData] = useState<UserInfoDataType | null>(null);
    const [socket] = useState(() => io(`${process.env.NEXT_PUBLIC_URL}:3000`))
    const router = useRouter();
    const isLoginPage = router.pathname.includes('/login');
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_USER_QUERY_COOKIES, { skip: isLoginPage });

    useEffect(() => {
        if (queryData && queryData.getUsers) {
            console.log("queryData 123", queryData)
            setUserInfoData(queryData.getUsers)
            setid(queryData.getUsers.id)
        }
    }, [queryData])

    console.log("UserInfoData 1", UserInfoData)
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
  