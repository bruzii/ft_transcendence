import { Hotel, Excursion } from "../types";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
import type { CSSProperties } from "react";

export interface StatisticObject {
    userName: string,
    lastName: string,
    email: string,
    company: string,
    billingAddress: string,
    tel: string,
    dateOfBirth: string,
    passeport: string,
    passportExpirationDate: string,
    companyType: string,
    billingStoreCode: string,
    hotelType: string,
    hotelCategory: {
      [key: string]: [string, number, number];
  },
  excursions: {
    [key: string]: [string, number];
},
    extensionFrom: string,
    extensionUntil: string,
}
export interface nonParticipantObject {
    userName: string,
    lastName: string,
    email: string,
    billingAddress: string,
    tel: string,
    dateOfBirth: string | null,
    passeport: string,
    billingStoreCode: string,
    motif : {
        person: string,
      motif: string,
    },
}

export interface FactureObject {
    userName: string,
    lastName: string,
    email: string,
    company: string,
    extensionFrom: string,
    extensionUntil: string,
    singleCost: number,
    hotelCost: number,
    flyCost: number,
    extraRoomCost: number,
    eventCost: number,
    invoice: {
        name: string;
        file: string;
        type: string;
    },
}

export interface EventType {
    eventName: string | null;
    Hotel1:Hotel | null;
    Hotel2?:Hotel | null;
    Hotel3?:Hotel | null;
    Hotel4?:Hotel | null;
    flight: number | null;
    Excursion1?: Excursion| null;
    Excursion2?: Excursion| null;
    Excursion3?: Excursion| null;
    Excursion4?: Excursion| null;
  }

export interface TeamObject {
    userName: string,
    lastName: string,
    email: string,
    role: string;
    password: string,
}

export interface ReactEChartsProps {
    option: EChartsOption;
    style?: CSSProperties;
    settings?: SetOptionOpts;
    loading?: boolean;
    theme?: "light" | "dark";
  }

 
  export type FormDataType = {
  email?: string;
  userName?: string;
  lastName?: string;
  tel?: string;
  dateOfBirth?: string;
  passeport?: string;
  passportExpirationDate?: string;
  company?: string;
  billingAddress?: string;
  billingStoreCode?: string;
  remise?: number;
  isParticipating?: boolean;
  motif?: string;
  divers?: string;
  invoice?: string;
  extraRoomCost?: number;
  departureHotelCategory?: object;
  returnHotelCategory?: object;
  eventCost?: number;
  extraDays?: number;
  eventName ?: string;
  flyCost?: number;
  hotelCost?: number;
  excursionCost?: number;
  singleCost?: number;
  specialRequests?: string;
  excursions?: object;
  allergies?: string;
  foodChoice?: string;
  retour?: string[];
  allerq?: string[];
  flyChoice?: string;
  extensionUntil?: string;
  extensionFrom?: string;
  hotelCategory?: object;
  hotelType?: string;
  participants?: object;
  companyType?: string;

};

export interface HotelQueryType {
    hotels : object[]
    flight : number
    excursions : object[]
    singleCost : number
    totalNights : number
    eventCost : number
    flightInfo : string[]
    personAuthorized : string[]
    roomCost : number
    end : string
    start : string
}

export interface ExcursionQueryType {
    excursions : object[]
    lastName : string
    email : string
    eventCost : number
    flyCost : number
    singleCost : number
    excursionCost : number
    hotelType : string
    hotelCategory : object[]
    tel : number
    extraRoomCost : number
    userName : string
    eventName : string
    id : number
    invoice : number
    
}

export interface EventQueryType {
    eventName : string
    personAuthorized : string[]
    startInscription: string
    endInscription : string
}

export interface EventDataQueryType {
    getEvent : EventQueryType[]
}