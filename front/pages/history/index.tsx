import { useQuery } from '@apollo/client';
import { GET_USER_QUERY } from "../../Apollo/query/user";
import { Box, Container, Title } from "../../themes/styles";
import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import styled from "styled-components";
import { DecodedToken } from "../../constants/types";
import { P } from "../../themes/styles";
import Accordion from './accordeon';
import AddFriends from '../../components/friend/addFriends';
  
  type AccordionItemProps = {
    eventName: string;
    invoice: {
      file: string;
      name: string;
    };
    eventCost: number;
    excursionCost: number;
    extraRoomCost: number | null;
    flyCost: number;
    singleCost: number;
    hotelCost: number;
  };

const History = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [Data, setData] = useState<AccordionItemProps[] | null>(null);
    
    // const {loading, error, data} = useQuery(GET_USER_QUERY, {
    //     variables: {
    //         email: email
    //     },
    //     skip: !email,
    // })
    // console.log(JSON.stringify(error, null, 2));
    // useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     if (token){
    //         const decode = jwt_decode(token) as DecodedToken
    //         console.log("decode ", decode.email)
    //         setEmail(decode.email)
    //     }
    //     if (data && data.getUser){
    //         console.log("data.getUser ", data.getUser)
    //         setData(data.getUser.form)
    //     }
    //     console.log("data.getUser ",Data)
    //     if (Data)
    //     // console.log("data.invoice ", Data[0]?.invoice)
    //     console.log("email ", email)
    // }, [data, email])

    return(     
    <Container margin={0}>
        <Box>
            <Title>historique des événements</Title>
            {/* <Accordion Data={Data} /> */}
            <AddFriends />
        </Box>
    </Container>
    )
}

export default History
