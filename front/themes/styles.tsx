import styled, { css, keyframes} from 'styled-components';
import fond from "../assets/images/fondHome3.png"


const pulse = keyframes`
  0%, 60%, 100% {
    transform: scale(1);
  }
  80% {
    transform: scale(1.2);
  }
`;

const scaleUp = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  60%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const Loader = styled.div`
position: absolute;
left: 45%;
top: 400px;
transform: translate(-50%, -50%);
  width: 58px;
  height: 58px;
  border: 5px solid #000;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  animation: ${pulse} 1s linear infinite;

  &::after {
    content: '';
    position: absolute;
    width: 58px;
    height: 58px;
    border: 5px solid #000;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: ${scaleUp} 1s linear infinite;
  }
`;
export const MainContainer = styled.div <{bool :boolean}>`
position: relative;
display: flex;
width: 100vw;
height: 100%;

  background-size: cover; // Ajustez la taille de l'image de fond selon vos besoins
  background-position: center; // Ajustez la position de l'image de fond selon vos besoins */
flex-direction: column;
gap: 0px;
@media screen and (min-width: 900px){
    padding-left: ${({ bool }) => (bool ? "0vw" : "")};
}
`
export const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;

&:focus {
  border-color: rgb(150, 150, 200);
}
`

export const Title = styled.h1`
  color: #000;
  text-align: center;
  font-family: HomepageBaukasten;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 45px */
  letter-spacing: 1.2px;
  text-transform: uppercase;
`
export const Container = styled.div<{margin?: number}>`
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    margin-left:${(props) => props.margin}px;
    /* display: inline-block; //m */
    gap : 100px;
    padding: 150px 100px 50px 240px;
    padding-right: 10px;
    @media screen and (max-width: 900px){
      padding: 10px;
  }
`

export const Label = styled.label`
display:flex;
width: 100%;
position: relative;
font-size: 0.85em;
input:focus + span {
    top: 24px;
    font-size: 0.7em;
    font-weight: 600;
  }
`;

export const P = styled.p<{ FontSize: number; FontWeight: number; }>`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.FontSize}px; /* Utilisez la prop FontSize */
  font-style: normal;
  font-weight: ${(props) => props.FontWeight}; /* Utilisez la prop FontWeight */
  line-height: 150%; /* 24px */
  letter-spacing: 0.32px;
  text-transform: uppercase;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Box = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items:center;
  padding: 30px;
  height: 100%; 
  border-radius: 43px;
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  gap: 25px;
  @media screen and (min-width: 900px){
    padding-left: 0px;
}
`
export const InputLabel = styled.span<{Validate: boolean, touch: boolean}>`
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;

  top: ${props => (props.touch ? "30px" : "15px")};
  font-size: ${props => (props.touch ? "0.7em" : "0.9em")};
  font-weight: ${props => (props.touch ? "600" : "0.9em")};
  color: ${props =>
      props.touch ? (props.Validate ? "green" : "red") : "grey"};
  Input:focus{
    top: 30px;
    font-size: 0.9em;
  }

`;
export const Label2 = styled.label`
font-size: 0.75rem;
  color: #8B8E98;
  font-weight: 600;
`;


export const ContainerTable = styled.div`
  display:flex;
  flex-direction: column;
  width: fit-content;
  max-height:400px;
  overflow: auto;
  border-radius: 15px;
  ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    @media (max-width: 1600px) {
      width: 1000px; /* Change the width to 100% when screen width is below 1000px */
    }
    @media (max-width: 1350px) {
      width: 850px; /* Change the width to 100% when screen width is below 1000px */
    }
    @media (max-width: 1150px) {
      width: 700px; /* Change the width to 100% when screen width is below 1000px */
    }
    @media (max-width: 875px) {
      width: 600px; /* Change the width to 100% when screen width is below 1000px */
    }
    @media (max-width: 741px) {
      width: 500px; /* Change the width to 100% when screen width is below 1000px */
    }
    @media (max-width: 600px) {
      width: 340px; /* Change the width to 100% when screen width is below 1000px */
    }
  `


export const Thead = styled.thead`
  position: relative;
  z-index: 7;
`;

export const Buttton = styled.button `
  text-align:center;
  border: none;
  outline: none;
  border-radius: 21.5px;
background: #000;
  padding: 5px 15px;
  color: #fff;
  font-size: 16px;
  transform: 0.3s ease;

  &:hover {
    background-color: rgb(56, 90, 194);
  }
`
export const Tbody = styled.tbody`
  color: black;
  white-space: nowrap;
`;


export const Popup = styled.div`
  display: flex;
  width: fit-content;
  max-width: 550px;
  min-width:520px;
  @media screen and (max-width: 900px){
    min-width:320px;
}

`
export const Grid2 = styled.div`
  grid-template-columns: 1fr 1fr;
  display: grid;
  width: 100%;
  /* display: flex; */
  gap: 15px;
  @media screen and (max-width: 900px){
    grid-template-columns: 1fr;
    width: 100%;
}
`

export const Grid2Fix = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  justify-content: center;
  width: 100%;
  height: fit-content;
  position: relative;
  gap: 10px;
`;

export const Grid3 = styled.div`
  grid-template-columns: 2fr 1fr ;
  display: grid;
  width: 100%;
  gap: 15px;
  @media screen and (max-width: 900px){
    grid-template-columns: 1fr;
    width: 100%;
}
`

export const Modif = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
`
export const Form = styled.form `
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 50px 0px 20px 0px;
  border-radius: 26px;
/* background: rgba(255, 255, 255, 0.50); */
background-color: transparent;
/* box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25); */
/* backdrop-filter: blur(5px); */
  font-family: "Inter", sans-serif;
  @media (max-width: 600px) {
    gap: 5px;
    padding: 8px;
  }
`


export const Td = styled.td`
padding: 1rem;
text-align: left;

img {
  width: 36px;
  height: 36px;
  margin-right: .5rem;
  border-radius: 50%;
  vertical-align: middle;
  transition: .2s ease-in-out;
}
`;
export const Table = styled.table`
width: 100%;
border-collapse: collapse;
`;

export const MainTable = styled.div`
width: fit-content;
max-width: 82vw;
display:flex;
width: 100%;
/* min-width: 100%; */
grid-column: 1 / -1;
flex-direction:column;
align-items:center;
height: fit-content;
border-radius: 27px;
background: rgba(255, 255, 255, 0.50);
box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
backdrop-filter: blur(5px);
padding-bottom: 10px;
`;

export const Body = styled.div<{margin: number}>`
min-height: 100vh;
/* background: url(images/html_table.jpg) center / cover; */
margin-left:${(props) => props.margin}px;
display: flex;
flex-direction:column;
gap: 30px;
justify-content: center;
align-items: center;
@media screen and (max-width: 900px){
  margin-left:0px;
}
`;

export const TableHeader = styled.div<{gap: number}>`
width: 100%;
height: 65px;
background-color: transparent;
padding: 1rem 1rem;
gap:${(props) => props.gap}%; 
display: flex;
justify-content: space-between;
align-items: center;
`;

export const InputGroup = styled.div `
width: 45%;
height: 100%;
padding: 0 .8rem;
position:relative;
border-radius: 2rem;
display: flex;
justify-content: center;
align-items: center;
transition: .2s;
border-radius: 14px;
    height: 40px;
    padding: 10px 10px 10px 10px;
/* &:hover {
  width: 45%;
  background-color: #fff8;
  box-shadow: 0 .1rem .4rem #0002;
} */

img {
  width: 1.2rem;
  height: 1.2rem;
}

input {
  width: 100%;
  padding: 10px;
  height: 40px;
border-radius: 14px;
background: #FFF;
box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
  border: none;
  outline: none;
}
`;

export const Grid4 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  gap: 20px;
  @media screen and (max-width: 900px){
    grid-template-columns: 1fr 1fr;
}
  
`

export const ContainerDashbord = styled.div`
    display: flex;
    position: relative;
    width: 100vw;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: 70px 50px 30px 280px;

    justify-content:flex-start;
    /* display: inline-block; //m */
    gap : 30px;

    @media screen and (max-width: 900px){
    width: 100%;
    height: 100%;
    padding: 50px 20px 30px 20px;
    flex-direction: column;
    align-items: center;
    margin-left: 0px;
    gap : 30px;
}
`

export const BoxDashbord = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 20px;
  height: 100%;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  color: #000;
  width: 100%;
  gap: 15px;
`

export const TitleDashboard = styled.h2`
  color: #808080;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 150%; /* 24px */
letter-spacing: 0.32px;
`

export const Number = styled.h2`
display: flex;
width: 100%;

  color: #0c0c0c;
font-family: Poppins;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 150%; /* 24px */
letter-spacing: 0.32px;
`

export const FlexCol = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  flex-direction: column;
  align-items: center;
`

export const TableBody = styled.div`
width: 95%;
max-height: 300px;
background-color: transparent;
/* background-color: #fffb; */
margin: .8rem auto;
border-radius: .6rem;
overflow: auto;
overflow: overlay;

&::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

&::-webkit-scrollbar-thumb {
  border-radius: .5rem;
  background-color: #0004;
  visibility: hidden;
}

&:hover::-webkit-scrollbar-thumb {
  visibility: visible;
}
`;




export const Tr = styled.tr`
--delay: .1s;
transition: .5s ease-in-out var(--delay), background-color 0s;
&:hover {
  background-color: #fff6 !important;
}
`;

export const Th = styled.th`
position: sticky;
top: 0;
left: 0;
min-width: 85px;

padding: 5px;
background-color: #fff;
cursor: pointer;
text-transform: capitalize;
color: var(--Black, #000);
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 600;
max-width: 190px;
line-height: 150%; /* 24px */
text-transform: uppercase; 
overflow: hidden; 
text-overflow: ellipsis;

span.icon-arrow {
  display: inline-block;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  border: 1.4px solid transparent;
  text-align: center;
  font-size: 1rem;
  margin-left: .5rem;
  transition: .2s ease-in-out;

  &:hover {
    border: 1.4px solid #6c00bd;
  }
}

&.active span.icon-arrow {
  background-color: #6c00bd;
  color: #fff;
}

&.asc span.icon-arrow {
  transform: rotate(180deg);
}

&.active, tbody td.active {
  color: #6c00bd;
}
`;

export const TrEven = styled.tr`
background-color: #0000000b;
&:hover {
  background-color: #fff6 !important;
}
`;

export const InputContainer = styled.div`
width: 100%;
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;

  gap: 10px;
  margin-bottom: 20px;
`