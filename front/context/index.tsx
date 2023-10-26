
import React, { createContext, useEffect, useContext, ReactNode, useState } from "react";
import { ThemeProvider, DefaultTheme } from "styled-components";

export type MyCustomTheme = DefaultTheme & {
    // Add any additional properties you have in your lightTheme and darkTheme here
    // For example:
    secondary: string;
    white: string;
    brightBlue: string;
    silver: string;
    darkGrey: string;
    bg: string,
    bgAlpha: string,
    bg2: string,
    bg3: string,
    text: string,

    
  };
  
  type ThemeContextValue = {
    setTheme: React.Dispatch<React.SetStateAction<string>>;
    theme: string;
  };

  type TokenContextValue = {
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    Token: string | null;
  };

export enum RoleType {
    SuperAdmin,
    Admin,
    USER
}
type RoleContextType = {
  setRole: React.Dispatch<React.SetStateAction<RoleType | null>>;
  Role: RoleType | null;
};

export const RoleContext = React.createContext<RoleContextType | null>(null)
export const ThemeContext = React.createContext<ThemeContextValue | null>(null);
export const TokenContext = React.createContext<TokenContextValue | null>(null);