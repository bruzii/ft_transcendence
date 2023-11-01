import styled, { css } from "styled-components";
import { ReactNode, useEffect } from "react";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { useToken, useRole } from "../../hooks";
import { Box } from "../../themes/styles";
import toast, { Toaster } from "react-hot-toast";
import { Grid2 } from "../../themes/styles";
import { Label } from "../../themes/styles";
import { Label2, InputLabel, Input } from "../../themes/styles";
import Image from "next/image";
import { validateForm } from "../../helpers/helpers";
import { Touch } from "../../helpers/helpers";
import { useMutation } from "@apollo/client";
import { Button,  Title, Subtitle} from "../login";
import { UPDATE_USER } from "../../Apollo/mutations/user";
import { useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "../../Apollo/query/user";
import { hasChanged } from "../../helpers/helpers";
import { Container } from "../../themes/styles";
import { GET_FRIENDS, GET_FRIENDS_PENDING } from "../../Apollo/query/friend";
import { useUserInfoState } from "../../context/userContext";
import AddFriends from "../../components/friend/addFriends";
import { IoIosAddCircle } from 'react-icons/io';
import RequestPending from "../../components/friend/requestPending";

const BaubleBox = styled.div`
  display: inline-block;
`;

const BaubleInput = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  z-index: 0;
`;

const BaubleLabel = styled.label<{ isActive: boolean }>`
  background: #2c2;
  background-position: 62px 5px;
  background-repeat: no-repeat;
  background-size: auto 5px;
  border: 0;
  border-radius: 50px;
  box-shadow: inset 0 10px 20px rgba(0,0,0,.4), 0 -1px 0px rgba(0,0,0,.2), inset 0 -1px 0px #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 0;
  height: 40px;
  position: relative;
  transition: all 500ms ease;
  width: 90px;
  background-color: ${({ isActive }) => (!isActive ? `#F8F8F8` : `#2c2`)};
`;

const BaubleLabelBefore = styled.div<{ isActive: boolean }>`
  background-color: rgba(255, 255, 255, 0.2);
  background-position: 0 0;
  background-repeat: repeat;
  background-size: 30% auto;
  border-radius: 50%;
  box-shadow: inset 0 -5px 25px #050, 0 10px 20px rgba(0, 0, 0, 0.4);
  content: '';
  display: block;
  height: 30px;
  left: 5px;
  position: absolute;
  top: 6px;
  transition: all 500ms ease;
  width: 30px;
  z-index: 2;
  background-position: ${({ isActive }) => (!isActive ? `150% 0` : `0 0`)};
  box-shadow: ${({ isActive }) => (!isActive ? `inset 0 -5px 25px #fff, 0 10px 20px rgba(0, 0, 0, 0.4)` : `inset 0 -5px 25px #050, 0 10px 20px rgba(0, 0, 0, 0.4)`)};
  left: ${({ isActive }) => (!isActive ? `calc(100% - 35px)` : `5px`)};
 `
;
const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items:center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  height: 100%;
  padding: 20px;
  align-items: center;
`;


interface DecodedToken {
  email: string;
  role: string;
  iat: number;
  exp: number;
}


const Profile = () => {
  const [isActive, setIsActive] = useState(false);
  const [popupAdd, setPopupadd] = useState(false);
  const [popupRequest, setPopupRequest] = useState(false);
  const { id } = useUserInfoState();
  const [
    updateUserMutation,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(UPDATE_USER);
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(GET_USER_QUERY, {
    variables: { id: id },
    skip: !id,
  });
  const { loading, error, data, refetch} = useQuery(GET_FRIENDS, {
    variables: {
        userId: id
    },
    skip: !id,
  })
  const { loading: queryLoading2, error: queryError2, data: queryData2, refetch: refetch2 } = useQuery(GET_FRIENDS_PENDING, {
    variables: {
        userId: id
    },
    skip: !id,
  })

  
  console.log(JSON.stringify(mutationError, null, 2));
  const [Initprofile, setInitProfile] = useState({
    userName: null, // Initialisez avec une chaîne vide au lieu de null
    email: null,
    lastName: null,
    firstName: null,
    xp: null,
    TwoFA:false
  });

  const [profile, setProfile] = useState({
    userName: null,
    email: null,
    lastName: null,
    firstName: null,
    xp: null,
    TwoFA:false
  });

  console.log(JSON.stringify(queryError, null, 2));
  const { Token } = useToken();
  // //let decode = jwt_decode(token!) as DecodedToken;
  // console.log("decodaxx  = " + JSON.stringify(decode));
  console.log("TOKEN " + Token);
  const OnHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfile((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log("data ", data)
    if (data && data.friendByUserId){
        console.log("data.getFriendPrending ", data.friendByUserId)
    }
    console.log("queryData2 ", queryData2?.getFriendPrending?.length
    )
}, [data, queryData2])
  const OnSumbmit = async (e: any) => {
    e.preventDefault();
    console.log("profile ", profile);
    if (Initprofile && profile && hasChanged(Initprofile, profile)) {
      try {
        const { data } = await updateUserMutation({
          variables: {
            updateUserInput: {
              userName: profile.userName,
              lastName: profile.lastName,
              firstName: profile.firstName,
              TwoFA: profile.TwoFA, // Assurez-vous que "TwoFa" est correctement orthographié pour correspondre au schéma côté serveur
              id:id,
            },
          },
        });

        // console.log("data.updateUserMutation ", data);
        // let { token } = data.UpdateUser;
        // console.log(token);
        // setInitProfile(profile);
        // localStorage.clear();
        // localStorage.setItem("token", token);
        toast.success(<b>Profil Modifie</b>);
        console.log(data); // Utilisez les données renvoyées par la mutation, par exemple, pour afficher un message de succès
      } catch (error) {
        console.error(error);
        toast.error(<b>Erreur2</b>);
      }
    }else
    toast.error(<b>Aucunes Informations Modifiees</b>);
  };
  // useEffect(() => {
  //   console.log("useToken " + Token);
  //   if (Token) {
  //     let decode = jwt_decode(Token) as DecodedToken;
  //     console.log("decode = " + JSON.stringify(decode));
  //     setId(decode.email);
  //     console.log("decode : " + JSON.stringify(decode));
  //   }
  // }, [Token]);
  const handleToggle = () => {
    profile.TwoFA = !profile.TwoFA;
  };
  useEffect(() => {
    if (queryData) {
      console.log("queryData ", queryData);
      console.log(queryData);
      setProfile(queryData.userOne);
      setInitProfile(queryData.userOne);
    }
  }, [queryData]);

  return (
    <Container>
      <Box>
        <Section>
          <Title>Profile Settings</Title>
          <Grid2
          >
          <ContainerInput>
            <div><Subtitle> {data?.friendByUserId ? data.friendByUserId.length : 0} Amies</Subtitle></div>
            <div onClick={() => setPopupadd(!popupAdd)}><IoIosAddCircle color="green"/></div>
          </ContainerInput>
          <ContainerInput>
           <div onClick={() => setPopupRequest(!popupRequest)}><Subtitle>{queryData2?.getFriendPrending? queryData2?.getFriendPrending?.length: 0} Demande(s)</Subtitle></div> 
          </ContainerInput>
          <ContainerInput>
            <Label>xp</Label>
              <Input
                value={profile.xp != null ? profile?.xp : ""}
                onChange={OnHandleChange}
                disabled
              />
          </ContainerInput>
            <ContainerInput>
              <Label>Prenom</Label>
                <Input
                  name="firstName"
                  value={profile?.firstName || ""}
                  onChange={OnHandleChange}
                
                />
            </ContainerInput>
            <ContainerInput>
              <Label>Nom</Label>
                <Input
                  name="lastName"
                  value={profile?.lastName || ""}
                  onChange={OnHandleChange}
                />
            </ContainerInput>
            <ContainerInput>
              <Label>UserName</Label>
                <Input
                  name="userName"
                  value={profile?.userName || ""}
                  onChange={OnHandleChange}
                />
            </ContainerInput>
          <ContainerInput>
            <Label>Email</Label>
              <Input
                name="email"
                value={profile?.email || ""}
                onChange={OnHandleChange}
              />
          </ContainerInput>
          <ContainerInput>
            <Label>2FA</Label>
          <BaubleBox>
                <BaubleInput id="bauble_check" name="bauble" checked={isActive} onChange={handleToggle} />
                <BaubleLabel htmlFor="bauble_check" isActive={profile.TwoFA}>
                    <BaubleLabelBefore isActive={profile.TwoFA} />
                </BaubleLabel>
                </BaubleBox>
          </ContainerInput>
          </Grid2>
          <Button onClick={OnSumbmit}>Enregistrer</Button>
        </Section>
        </Box>
        {popupAdd && <AddFriends refetch={refetch} setPopup={setPopupadd}/>}
        {popupRequest && queryData2?.getFriendPrending &&  <RequestPending refetchPending={refetch} refetch={refetch2} friends={queryData2?.getFriendPrending} setPopup={setPopupRequest}/>}
        <Toaster position="top-center" reverseOrder={false}></Toaster>
    </Container>
  );
};
export default Profile;
