import { createGlobalStyle } from "styled-components";
import fond from "../assets/images/fonHome2.png"


const GlobalStyle = createGlobalStyle`
html,
body {
  color: ${({ theme }) => theme.silver};
  display: flex;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    min-height: 100vh; // ensure cover all height
  height: fit-content; //use viewport height
  width: 100%;
  position: relative;
}

body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%; // ensure cover all height
  width: 100%;
  background-image: url(${fond.src});
  background-size: cover;
  background-color: #0D0E12;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

:root {
  --primary-color: #D1107A;
  --third-color: #2694E3;

  --primary-background: #0D0E12;
  --second-background: #16171C;

  --primary-font-color: #fff;

  --shadow-black-color: rgba(0, 0, 0, 0.38);

}

  a {
    color: inherit;
    text-decoration: none;
  }

  h1, h2, h3, h4 {
    color: ${({ theme }) => theme.silver};
    margin-bottom: 0;
  }

  p {
      font-size: 10px;
    color: ${({ theme }) => theme.darkGrey};
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;

  }
  input[type='file'] {
    color:transparent;
    width: 0px; 
    float:left;
    width: fit-content;
    
}
`;

export default GlobalStyle;
