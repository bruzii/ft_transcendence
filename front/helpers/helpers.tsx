import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import {  useEffect, useState } from "react";
import { RoleType } from "../context";
import {HotelQueryType, ExcursionQueryType, EventDataQueryType} from '../constants/interfaces';


interface ExcursionResult {
    [key: string]: any; // Vous pouvez spécifier un type plus précis ici si nécessaire
  }

interface TypeRoom {
    Double: number;
    Single: number;
    Twin: number;
}

interface TypeRoom2 {
    hotelType: string;
}


export  const determineRole = (role: string | null) => {
    if (role === 'User') {
    return RoleType.USER;
    } else if (role === 'Admin') {
    return RoleType.Admin;
    } else if (role === 'SuperAdmin') {
    return RoleType.SuperAdmin;
    } else {
    // Rôle par défaut en cas de valeur inconnue ou non spécifiée
    return null;
    }
};

export const LogeOut = () => {
    localStorage.clear();
    console.log("LOGOUT")
    Router.push("/login")
} 

export const  validateForm = (type: string, value: string ) => {
    if (type === "userName" || type === "lastName") {
        // Vérification pour les noms (peut contenir des lettres et espaces)
        return /^[a-zA-Z\s]+$/.test(value);
    } else if (type === "email") {
        // Vérification pour l'adresse e-mail
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (type === "password") {
        // Vérification pour le mot de passe (au moins 8 caractères)
        return value.length >= 8;
    } else {
        // Type non pris en charge
        return false;
    }
    }


export const Touch = (name: string) => {
    return name.length > 0
}

export const hasChanged = (value1: object, value2: object): boolean => {
    return JSON.stringify(value1) !== JSON.stringify(value2);
  };

export function capitalizeFirstLetter(inputString: string) {
    if (typeof inputString !== 'string' || inputString.length === 0) {
        return inputString; // Renvoie l'entrée inchangée si elle n'est pas une chaîne valide
    }

    // Convertit la première lettre en majuscule et le reste en minuscules
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}

export const getCurrentEvent = (email: string,  data3: EventDataQueryType) => {
    let eventName: null | string = null; // État local

    let index = 0;
    console.log("kakakak")
    
    if (data3 && data3.getEvent && email) {
        for (let i = 0; i < data3.getEvent.length; i++) {
            console.log("data3.getEvent ", data3.getEvent);
            console.log("index ", i);
            console.log("data3.getEvent[i]?.eventName ", data3.getEvent[i]);
            console.log("eventName 3 ", eventName);

            console.log("data.getEventByName ", data3.getEvent);
            const presente: boolean = data3.getEvent[i]?.personAuthorized?.some((sousTableau: string[] | string) => {
                if (Array.isArray(sousTableau)) {
                  return sousTableau.includes(email);
                } else if (typeof sousTableau === 'string') {
                  return sousTableau === email;
                }
                return false; // Gérez les autres cas si nécessaire
              });
            if (!presente && index < data3.getEvent.length)
                index++;
            if (presente) {
                const currentDate = new Date(); // Obtenez la date actuelle
                const startInscriptionDate = new Date(data3.getEvent[i]?.startInscription);
                const endInscriptionDate = new Date(data3.getEvent[i]?.endInscription);
                console.log("startInscriptionDate ", startInscriptionDate);
                console.log("endInscriptionDate ", endInscriptionDate);
                console.log("currentDate ", currentDate);
                if (startInscriptionDate < currentDate && endInscriptionDate > currentDate) {
                    eventName = data3.getEvent[i]?.eventName;
                    console.log("eventName 2 ", data3.getEvent[i]?.eventName);
                    break;
                }
            }
            console.log("presente ", presente);
        }
    }
    console.log("eventName 1 ", eventName);
    if (eventName)
        return eventName;
    else
        return null;
}

export const NumberOfParticipants = (data: ExcursionQueryType[]) => {
    let length: number | null = null;

        console.log("data.getFormFromEvent ", data)
        if (data ){
            length = data.length;
            console.log("length ", data.length)
            console.log("data.getFormFromEvent ", data)
        }

    if (length)
        return length;
    else
        return null;
}

export const StatExcurisonChoice = (data: ExcursionQueryType[], data2: HotelQueryType) => {
  
    if (!data || !data2 || !data2.excursions) {
      return null;
    }
    else if (data2.excursions.length === 0 || data.length === 0) 
        return null
    console.log("data", data)
    console.log("data2", data2)
    const excursionCounts: { [key: string]: { [key: string]: number } } = {};
  
    // Parcourir les excursions
    Object.entries(data2?.excursions).forEach(([key, excursion2]: [string, any]) => {
      const excursionName: string = excursion2.name;
      const options: { [key: string]: number } = {};
      console.log("optionName ", excursionName)
      // Parcourir les options de l'excursion
      excursion2.Excursion.forEach((option: any) => {
        const optionName: string = option.name;
        let optionCount: number = 0;
  
        // Parcourir les données pour compter le nombre de personnes ayant choisi cette option
        Object.entries(data).forEach(([formKey, formData]: [string, any]) => {
          if (formData.excursions && formData.excursions[excursionName] && optionName.includes(formData.excursions[excursionName][0])) {
            optionCount += 1;
          }
        });
        options[optionName] = optionCount;
      });
  
      // Stocker les données de l'excursion dans l'objet excursionCounts
      excursionCounts[excursionName] = options;
    });
  
    // Créer la liste des séries
    const seriesList: { names: string[]; data: number[]; title: string[] }[] = [];
  
    for (const location in excursionCounts) {
      const names2 = Object.keys(excursionCounts[location]);
      const names = names2.map((value) => value.replace(/\([^)]*\)/g, ''));
      const values = names2.map((name) => excursionCounts[location][name]);
  
      seriesList.push({
        title: [location],
        names,
        data: values,
      });
    }
  
    console.log("seriesList", seriesList);
  
    return seriesList.length > 0 ? seriesList : null;
  };
  



export const HotelType = (data : object[]) => {
    let hotelTypeResult: TypeRoom | null = null;
    console.log("data 44", data)
    if (!data) {
        return null;
      }
    else if (data.length === 0)
        return null;
      console.log("data.getFormFromEvent 4", data)
    let Single = 0;
    let Double = 0;
    let Twin = 0;

    Object.entries(data).forEach(([key, formData]: [string, unknown]) => {
        if (typeof formData === 'object' && formData !== null) {
        const typedFormData = formData as TypeRoom2;
        const hotelType = typedFormData.hotelType;
        switch (hotelType) {
            case "Single":
                Single++;
                break;
            case "Double":
                Double++;
                break;
            case "Twin":
                Twin++;
                break;
        }
    }
    })

        const hotelTypeResult2 : TypeRoom = {
            Single: Single,
            Double: Double,
            Twin: Twin,
        }

        hotelTypeResult = hotelTypeResult2; // Mettre à jour la variable d'état avec le résultat

        console.log("Hotel Type Result ", hotelTypeResult);
        

    if (hotelTypeResult) {
        const Room : TypeRoom = hotelTypeResult
        const Result = [
            {value: Room?.Double , name: "Double"},
            {value: Room?.Single, name: "Single"},
            {value: Room?.Twin, name: "Twin"},
        ]

        return Result; // Retournez le résultat lorsque hotelTypeResult n'est pas null
    }

    return null; // Si hotelTypeResult est toujours null, retournez null par défaut
}


export const StatHotelChoice = (data: ExcursionQueryType[], data2: HotelQueryType) => {
    console.log("data ", data)
    console.log("data2", data2)
    if (!data || !data2 || !data2.hotels) {
        return null;
      }

    if ( data2.hotels.length === 0 || data.length === 0)
        return null;
      console.log("YAYAYAYAYAY")
    const excursionCounts: { [key: string]: { [key: string]: number } } = {};
  
    // Parcourir les excursions
    Object.entries(data2?.hotels).forEach(([key, excursion2]: [string, any]) => {
      const excursionName: string = excursion2.name;
      const options: { [key: string]: number } = {};
  
      // Parcourir les options de l'excursion
      excursion2.Room.forEach((option: any) => {
        const optionName = option.name;
        let optionCount = 0;
  
        // Parcourir les données pour compter le nombre de personnes ayant choisi cette option
        Object.entries(data).forEach(([formKey, formData]: [string, any]) => {
          const hotelCategory = formData?.hotelCategory;
          if (hotelCategory && hotelCategory[excursionName] && optionName.includes(hotelCategory[excursionName][0])) {
            optionCount += 1;
          }
        });
  
        // Stocker le nombre dans l'objet des options
        options[optionName] = optionCount;
      });
  
      // Stocker les données de l'excursion dans l'objet excursionCounts
      excursionCounts[excursionName] = options;
    });
  
    // Créer la liste des séries
    const seriesList: { names: string[]; data: number[]; title: string[] }[] = [];
  
    for (const location in excursionCounts) {
      const names2 = Object.keys(excursionCounts[location]);
      const names = names2.map((value) => value.replace(/\([^)]*\)/g, ''));
      const values = names2.map((name) => excursionCounts[location][name]);
  
      seriesList.push({
        title: [location],
        names,
        data: values,
      });
    }
  
    console.log("seriesList", seriesList);
  
    return seriesList.length > 0 ? seriesList : null;
  };
  
  export const  timestampToYearMonthDay = (timestamp : number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hour}:${minutes}`;
  }

  export const  timestampMonthDay = (timestamp : number) => {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');

  
    return `${month}/${day}`;
  }

  export const CheckRoomMate = (data : object[]) => {
    let RoomMateResult: boolean | null = null;
    console.log("data 44", data)
    if (!data) {
        return null;
      }
    else if (data.length === 0)
        return null;
      console.log("data.getFormFromEvent 4", data)
    let RoomMate = [];

    Object.entries(data).forEach(([key, formData]: [string, unknown]) => {
        if (typeof formData === 'object' && formData !== null) {
        const typedFormData = formData as TypeRoom2;
        const hotelType = typedFormData.hotelType;
    }
    })

        console.log("RoomMateResult ", RoomMateResult);

    return null; // Si hotelTypeResult est toujours null, retournez null par défaut
}
