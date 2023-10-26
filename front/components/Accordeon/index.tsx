import React, {
    useState,
    useCallback,
    useRef
  } from "react";
import { ReactDOM } from "react";
import { ReactNode } from "react";
import styled , { keyframes} from "styled-components";
import { SubCategorie } from "../Form/styles";
  type DirectionType = "top" | "right" | "bottom" | "left";
  
  interface ChevronProps {
    direction: DirectionType;
  }
  
  const Chevron = styled.div<ChevronProps>`
    border-style: solid;
    border-width: 0.125rem 0.125rem 0 0;
    height: 0.25rem;
    width: 0.25rem;
    transition: all 0.25s ease-in-out;
  
    transform: ${(p) => p.direction === "top" && "rotate(-45deg)"};
    transform: ${(p) => p.direction === "right" && "rotate(45deg)"};
    transform: ${(p) => p.direction === "bottom" && "rotate(135deg)"};
    transform: ${(p) => p.direction === "left" && "rotate(-135deg)"};
  `;
  
  interface AccordionProps {
    children: ReactNode;
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
  /* border: 1px solid #ccc; */
  margin-bottom: 0px;
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  /* background-color: #fff; */
  border-top: 1px solid #000;

  cursor: pointer;
`;

const Para = styled.p`
    font-size: 15px;
`
const AccordionContent = styled.div <{isOpen : boolean}>`
display: flex;
  width: 100%; 
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
`;

  const Data : string[] = [
    "Personal",
    "company",
    "flight",
    "Hotel",
    "excursions",
    "Divers"
  ]
  
  const Accordion: React.FC<AccordionProps> = ({ children  }) => {
    const [openIndex, setOpenIndex] = useState<null | number>(0);
  
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
              <SubCategorie>{item}</SubCategorie>
              <Chevron direction={openIndex === index ? "top" : "bottom"} />
            </AccordionHeader>
            <AccordionContent isOpen={openIndex === index}>
              {accordionChildren[index] || null} {/* Rendu conditionnel du child */}
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionContainer>
    );
  };
  

export default Accordion;


