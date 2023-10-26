import { RiDeleteBinLine } from "react-icons/ri";
import styled from "styled-components";
import {HiSearch} from 'react-icons/hi';
import { MdOutlineModeEditOutline } from "react-icons/md";

export const Delete = styled(RiDeleteBinLine)`
transform: scale(1.2);
transition: .2s linear;
width: 20px;
transition: transform 0.3s ease-in-out;
height: 20px;
color: red;
`

export const Search = styled(HiSearch)`
    color: black;
    position: absolute;
    top: 8;
    right: 30px;
    font-size: 30px;
`

export const Modif = styled(MdOutlineModeEditOutline)`
    font-size: 24px;
`