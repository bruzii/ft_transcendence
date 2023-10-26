import React, {
    useState,
    useCallback,
    useRef
  } from "react";
import { ReactDOM } from "react";
import { ReactNode } from "react";
import { BubbleBlack } from "../Form/styles";
import styled , { keyframes} from "styled-components";
  
  type DirectionType = "top" | "right" | "bottom" | "left";
  
  interface ChevronProps {
    direction: DirectionType;
  }
  
  const Chevron = styled.div<ChevronProps>`
    display:flex;
    align-items: center;
    justify-content: center;
    border-style: solid;
    border-width: 0.125rem 0.125rem 0 0;
    height: 0.35rem;
    width: 0.35rem;
    transition: all 0.25s ease-in-out;
    color: #000;
    transform: ${(p) => p.direction === "top" && "rotate(-45deg)"};
    transform: ${(p) => p.direction === "right" && "rotate(45deg)"};
    transform: ${(p) => p.direction === "bottom" && "rotate(135deg)"};
    transform: ${(p) => p.direction === "left" && "rotate(-135deg)"};
  `;
  
  interface AccordionProps {
    children: ReactNode;
    Data: string [];
  }
import { RiBillLine } from 'react-icons/ri';

const AccordionContainer = styled.div`
display: flex;
  flex-direction: column;
  width: 100%;
`;

const AccordionItem = styled.div`
display: flex;
  width: 100%; 
  flex-direction: column;
  margin-bottom: 0px;
`;

const AccordionHeader = styled.div`
  width: 100%; 
  display: flex;
  align-items: center;
    justify-content: center;
  border: 1px solid #C4C4C4;
  justify-content: flex-start;
  padding: 10px;
  padding: 10px 61px 10px;
  background-color: #fff;
  cursor: pointer;
`;

const DivHeader = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`

const Para = styled.p`
color: #000;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 150%; /* 24px */
letter-spacing: 0.32px;
text-transform: uppercase;
`
const AccordionContent = styled.div <{isOpen : boolean}>`

    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
`;
  
  const Accordion2: React.FC<AccordionProps> = ({ children, Data,  }) => {
    const [openIndex, setOpenIndex] = useState<null | number>(null);
  
    const handleItemClick = (index: number) => {
      if (openIndex === index) {
        // Si l'onglet est déjà ouvert, fermez-le
        setOpenIndex(null);
      } else {
        // Sinon, ouvrez l'onglet et fermez les autres
        setOpenIndex(index);
      }
    };
    const accordionChildren = React.Children.toArray(children); // Convertir les enfants en tableau

    console.log("data ", Data);
  
    return (
      <AccordionContainer>
        {Data && Data.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionHeader onClick={() => handleItemClick(index)}>
                <DivHeader>
                    <BubbleBlack direction={true}>
                    <Chevron direction={openIndex === index ? "top" : "bottom"} />
                    </BubbleBlack>
                <Para>
                {item}
                </Para>
                </DivHeader>
            </AccordionHeader>
            <AccordionContent isOpen={openIndex === index}>
              {accordionChildren[index] || null} {/* Rendu conditionnel du child */}
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionContainer>
    );
  };
  

export default Accordion2;


