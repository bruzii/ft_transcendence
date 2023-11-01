import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoLogoGameControllerB } from "react-icons/io";
import { FaAddressCard, FaTaxi } from "react-icons/fa";
import { FaRegMap } from "react-icons/fa";
import { AiOutlineBars } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import Link from "next/link";
import { LogeOut } from "../../helpers/helpers";
import front from "../../assets/images/logo.png"
import Image from "next/image";
import { useToken } from "../../hooks";
// import scrollreveal from "scrollreveal";

const Section = styled.section`
  position: fixed;
  left: 0;
  background-color: transparent;
  height: 100vh;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
  z-index: 30;
  .top {
    display: flex;
    flex-direction: column;
    gap: 18vh;
    width: 100%;
    height: 100%;
    .toggle {
      display: none;
    }
    .brand {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      svg {
        color: #ffc107;
        font-size: 2rem;
      }
      span {
        font-size: 2rem;
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
      }
    }
    .links {
      display: flex;
      justify-content: center;
      width: 100%;
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 20px;
        li {
          padding: 12px 20px;
          border-radius: 0.6rem;
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.80);
          box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(5px);
          &:hover {
            background: rgba(255, 255, 255, 0.50);
          box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(5px);
            /* background-color: #0C9DBC; */
            p {
              color: black;
            }
          }
          p {
            display: flex;
            align-items:center;
            gap: 20px;
            color: #FFF;
            /* background-color: red; */
            font-family: HomepageBaukasten;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 100%; /* 30px */
            text-transform: uppercase;
          }
        }
        .active {
          background: rgba(255, 255, 255, 0.50);
          box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(5px);
          p {
            color: black;
          }
        }
      }
    }
  }

  .logout {
    padding: 0.3rem 1rem;
    border-radius: 0.6rem;
    &:hover {
      background-color: #da0037;
    }
    p {
      display:flex;
      align-items:center;
      font-size: 1rem;
      }
    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: white;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 900px) {
    position: initial;
    width: 100%;
    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      .toggle {
        display: block;
        color: white;
        z-index: 99;
        svg {
          font-size: 1.4rem;
        }
      }
      .brand {
        gap: 1rem;
        justify-content: flex-start;
      }
    }
    .top > .links,
    .logout {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div<{state: boolean}>`
  position: fixed;
  left: 0vw;
  top: 0;
  z-index: 10;
  background-color: #212121;
  height: 100vh;
  width: ${({ state }) => (state ? "fit-content" : "0%")};
  transition: 0.4s ease-in-out;
  display: ${({ state }) => (state ? "flex" : "none")};
  visibility: ${({ state }) => (state ? "" : "hidden")};
  padding: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 80px 30px;
  span {
        font-size: 1rem;
      }
  .responsive__links {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .logout {
    display:flex;
    align-items: center;
    justify-content:center;
    padding: 0.3rem 1rem;
    border-radius: 0.6rem;
    
    p {
      display:flex;
      align-items:center;
    }
    &:hover {
      background-color: #da0037;
    }
    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: white;
    }
  }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;
      li {
        padding: 0.6rem 1rem;
        border-radius: 0.6rem;
        &:hover {
          background-color: #0C9DBC;
          p {
            color: black;
          }
        }
        p {
          text-decoration: none;
          display: flex;
          gap: 1rem;
          color: white;
        }
      }
      .active {
        background-color: #0C9DBC;
        p {
          color: black;
        }
      }
    }
  }
`;
const linksArray = [
    {
        label: "Accueil",
        icon: <AiOutlineBars style={{width:'23px', height: '23px'}}/>,
        to: "/",
        notification: 1,
    },
    {
        label: "Historique",
        icon: <BiTime style={{width:'23px', height: '23px'}}/>,
        to: "/history",
        notification: 2,
    },
    {
      label: "Game",
      icon: <IoLogoGameControllerB style={{width:'23px', height: '23px'}}/>,
      to: "/game",
      notification: 2,
  },
    {
      label: "ChatRoom",
      icon:  <BsFillChatDotsFill style={{width:'23px', height: '23px'}}/>,
      to: "/chat",
      notification: 3,
  },
  {
    label: "Friends",
    icon: <FaAddressCard style={{width:'23px', height: '23px'}}/>,
    to: "/friends",
    notification: 4,
  },
    {
        label: "Profile",
        icon: <FaAddressCard style={{width:'23px', height: '23px'}}/>,
        to: "/profile",
        notification: 4,
    },
    {
      label: "Logout",
      icon: <FiLogOut style={{width:'20px', height: '20px'}} />,
      to: "/login",
      notification: 5,
  },
];

export default function Sidebar() {
  const [show, setShow] = useState(false)
  const [currentLink, setCurrentLink] = useState(1);
  const [navbarState, setNavbarState] = useState(false);
  // const html = document.querySelector("html");
  // html?.addEventListener("click", () => setNavbarState(false));

  
  useEffect(() => {
    // const sr = scrollreveal({
    //   origin: "left",
    //   distance: "80px",
    //   duration: 1000,
    //   reset: false,
    // });
 console.log("useToken ", useToken)
    // sr.reveal(
    //   `
    //       .brand,
    //       .links>ul>li:nth-of-type(1),
    //   .links>ul>li:nth-of-type(2),
    //   .links>ul>li:nth-of-type(3),
    //   .links>ul>li:nth-of-type(4),
    //   .links>ul>li:nth-of-type(5),
    //   .links>ul>li:nth-of-type(6),
    //   .logout
    //   `,
    //   {
    //     opacity: 0,
    //     interval: 300,
    //   }
    // );
  }, [useToken]);

  const HandleLogout = () => {
    setShow(true)
    LogeOut();
  }
  if (show)
  return null
  return (
    <>
      <Section>
        <div className="top">
          <div className="toggle">
            {navbarState 
            ? (
                <VscChromeClose onClick={() => setNavbarState(false)} />
            )
            : (
                <GiHamburgerMenu
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavbarState(true);
                  }}
                />
              )}
          </div>
        <div className="brand">
          {/* <Image src={front} width={150} height={55}/> */}
          </div>
            <div className="links">
              <ul>
              {linksArray.map((res) => (
                    
                    res.label === "Logout" 
                    ? (
                      <div onClick={HandleLogout}>
                      <li
                        className={currentLink === res.notification ? "active" : "none"}
                        onClick={() => setCurrentLink(res.notification)}
                        >
                          <p>
                            {res.icon}
                            <span>{res.label}</span>
                          </p>
                      </li>
                    </div>
                    )
                    : (
                      <Link href={res.to} key={res.notification}>
                      <li
                        className={currentLink === res.notification ? "active" : "none"}
                        onClick={() => setCurrentLink(res.notification)}
                        >
                          <p>
                            {res.icon}
                            <span>{res.label}</span>
                          </p>
                      </li>
                    </Link>
                    )
                  
                ))}
              </ul>
            </div>
        </div>
        {/* <div className="logout" onClick={HandleLogout}>
          <p>
          <FiLogOut style={{width:'20px', height: '20px'}} />
            <span className="logout">Logout</span>
          </p>
        </div> */}
      </Section>
      <ResponsiveNav state={navbarState} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            {linksArray.map((res) => (
                <Link href={res.to} key={res.notification}>
                    <li
                    className={currentLink === res.notification  ? "active" : "none"}
                    onClick={() => setCurrentLink(res.notification)}
                    >
                        <p>
                            {res.icon}
                            <span>{res.label}</span>
                        </p>
                    </li>
                </Link>
            ))}
          </ul>
          <div className="logout" onClick={HandleLogout}>
            <p> 
              <FiLogOut style={{width:'20px', height: '20px'}} />
              <span className="logout">Logout</span>
            </p>
          </div>
        </div>
      </ResponsiveNav>
    </>
  );
}