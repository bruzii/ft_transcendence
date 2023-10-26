import React, { useState } from 'react';
import styled from 'styled-components';
import { RiBillLine } from 'react-icons/ri';
import { P } from '../../themes/styles';
import Image from 'next/image';
import { timestampMonthDay } from '../../helpers/helpers';
const AccordionContainer = styled.div`
display: flex;
flex-direction: column;
  width: 100%; /* Ajustez la largeur selon vos besoins */

`;

const AccordionItem = styled.div`

`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0px 0px;
  border-radius: 7px;

border: 1px solid #D9D9D9;
background: #FFF;
  cursor: pointer;
`;

const Para = styled.p`
display: flex;
justify-content: space-between;
min-width: 160px;
align-items: center;
color: #000;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 150%; /* 24px */
letter-spacing: 0.32px;

`

const ContainerPara = styled.div<{active: boolean}>`
    display: flex;
    min-width: 10px;
    align-items: center;
    width: 100%;
    border-bottom: ${(props) => props.active ? "1px solid #D9D9D9" : "none"};
    span {
        color: #000;
        font-weight: 400;
        font-size: 16px;
    }

`
const AccordionContent = styled.div <{isOpen : boolean}>`
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    background: #FFF;
    width: 85%;
    margin-left: 15%;
    gap: 5px;
    padding: 10px 20px;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
`;
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
  
  type AccordionProps = {
    Data: AccordionItemProps[] | null;
  };
  
  const Accordion: React.FC<AccordionProps> = ({ Data }) => {
    const [openIndex, setOpenIndex] = useState<null | number>(null);
    const [url, setUrl] = useState<null | string>(null)
  
    const handleItemClick = (index: number) => {
      if (openIndex === index) {
        // Si l'onglet est déjà ouvert, fermez-le
        setOpenIndex(null);
      } else {
        // Sinon, ouvrez l'onglet et fermez les autres
        setOpenIndex(index);
      }
    };
  console.log("data ",Data )
    return (
      <AccordionContainer>
        {Data && Data.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionHeader onClick={() => handleItemClick(index)}>
                <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                { item?.event?.backgroundImage ? <Image src={item?.event?.backgroundImage} width={77} height={77} style={{borderRadius:'7px'}}/> : <p>{item?.event?.backgroundImage}</p>}
            <P FontSize={16} FontWeight={600}>{item.eventName} | {timestampMonthDay(Number(item.createdAt))}</P>
                </div>
              {Object.entries(item).map(([key, value]) => ( 
                key === "invoice" && key !== null && 
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', width: '50%', paddingRight:'10px'}}>
                    <P FontSize={16} FontWeight={400}> Ma Facture</P>
                  <span>{openIndex === index ? '-' : '+'}</span>
                </div>
            ))}
            </AccordionHeader>
            <AccordionContent isOpen={openIndex === index}>
                <ContainerPara active={true}>
                    <Para style={{borderBottom:''}}> Cout de l'évenement : </Para>
                    <span>{item.eventCost}€</span>
                </ContainerPara>
                <ContainerPara active={false}>
                    <Para> Hotel : </Para>
                    <span>{item.hotelCost}€</span>
                </ContainerPara>
                <ContainerPara active={false}>
                <Para> Supplement single : </Para>
                    <span>{item.singleCost}€</span>
                </ContainerPara>
                <ContainerPara active={false}>
                <Para>Extra-Room : </Para>
                    <span>{item?.extraRoomCost ? item.extraRoomCost : "0"}€</span>
                </ContainerPara>
                <ContainerPara active={false}>
                <Para>excursions : </Para>
                    <span>{item?.excursionCost ? item.excursionCost : "0"}€</span>
                </ContainerPara>
                <a style={{display:'flex', width: '100%', justifyContent:'flex-end', gap:'10px', color: 'black'}} href={item?.invoice?.file} download={item?.invoice?.name}>
                    Telecharger
                    <RiBillLine />
                  </a>
                
            {Object.entries(item).map(([key, value]) => ( 
                key === "invoice" && key !== null && 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', width: '50%', color: 'black'}}>
                    
                </div>

            ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionContainer>
    );
  };

export default Accordion;
