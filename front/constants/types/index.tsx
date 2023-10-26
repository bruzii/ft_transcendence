export interface DecodedToken {
    email: string;
    role: string;
    iat: number;
    exp: number;
    // Ajoutez d'autres propriétés si nécessaire
  }

  export type TFormValuesEvent = {
    eventName: string;
    Hotel1: {
      choix1: {
        name: string;
        prix: number;
      } | null;
      choix2: {
        name: string;
        prix: number;
      } | null;
      HotelName: string | null;
    };
    Hotel2: {
      choix1: {
        name: string;
        prix: number;
      } | null;
      choix2: {
        name: string;
        prix: number;
      } | null;
      HotelName: string | null;
    };
    Hotel3: {
      choix1: {
        name: string;
        prix: number;
      } | null;
      choix2: {
        name: string;
        prix: number;
      } | null;
      HotelName: string | null;
    };
    Hotel4: null;
    flight: number;
    Excursion1: {
      choix1: {
        prix: number;
        ExcursionName: string;
      } | null;
      choix2: {
        prix: number;
        ExcursionName: string;
      } | null;
    };
    Excursion2: {
      choix1: {
        prix: number;
        ExcursionName: string;
      } | null;
      choix2: {
        prix: number;
        ExcursionName: string;
      } | null;
    };
    Excursion3: {
      choix1: {
        prix: number;
        ExcursionName: string;
      } | null;
      choix2: {
        prix: number;
        ExcursionName: string;
      } | null;
    };
    Excursion4: null;
    id: number;
  };
  
  type option = {
    RoomName: string | null;
    prix: number | null; 
  
  };
  type option2 = {
    ExcursionName: string | null;
    prix: number | null; 
  };
  
  export type Hotel = {
    HotelName: string;
    choix1: option;
    choix2?: option;
    choix3?: option;
    choix4?: option;
    choix5?: option;
  };
  
  export type Excursion = {
    choix1: option2;
    choix2?: option2;
    choix3?: option2;
    choix4?: option2;
    choix5?: option2;
  };
  export const initialFormData = {
  eventName:"Egypte",

  hotels: [
{
  name: "CARLTON LE CAIRE",
  Nuitee: 2,
  Room: [
    {name:"Deluxe City View (Inclus Package - 44m2)", prix: 0},
    {name:"Deluxe Nile View (+160 € / Pers./ 2 Nuits - 44m2)", prix: 160},
    {name:"Deluxe Terrace Nile View (+240 € / Pers./ 2 Nuits - 44m2)", prix: 240}
  ]
} ,
{
  name: "MARRIOTT LE CAIRE",
  Nuitee: 1,
  Room: [
    {name:"Deluxe Garden (Inclus Package - 35m2)", prix: 0},
    {name:"Deluxe Partial Pyramids View (+75 € / Pers./ 1 Nuit - 35m2)", prix: 75},
    {name:"Grand Deluxe (+100 € / Pers./ 1 Nuit - 70m2)", prix: 100}
  ]
} ,
{
  name: "HILTON LOUXOR",
  Nuitee: 4,
  Room: [
    {name:"Garden ou City View (IInclus Package - 31m2)", prix: 0},
    {name:"Partial Nile View (+70 € / Pers./ 4 Nuits - 31m2)", prix: 70},
    {name:"Nile View (+110 € / Pers./ 4 Nuits - 31m2)", prix: 110}
  ]
}  
  ],
  excursions:[
    { 
    name:"LE CAIRE",
    Excursion: [
      {name:"Citadelle / Grande Mosquée / Souk", prix: 10},
      {name:"Pyramides Dahchour & Saqqarah", prix: 10},
      {name:"Grand Musée Égyptien - GEM", prix: 10}
    ]
  },
  { 
    name:"LOUXOR",
    Excursion: [
      {name:"Montgolfière (Matin 5h30 )", prix: 10},
      {name:"Temple Louxor / Souk", prix: 10},
      {name:"Vallée des Reines / Habu Temple", prix: 10},
      {name:"Son & Lumière Louxor", prix: 10}
    ]
  },
  { 
    name:"LOUXOR",
    Excursion: [
      {name:"Temple Philae", prix: 10},
    ]
  }
  ],
flight:300,
singleCost:50,
totalNights: 6,
eventCost: 4000,
start: null,
end: null,
startInscription: null,
endInscription: null,
personAuthorized: null,
paimentMethod: null,
organisationParticipants: 5,
     flightInfo:{
    Aller:{Itineraire:"Aller - Paris > Le Caire", horaire: "19/11 - 12:30 > 18:00"},
          Retour:{Itineraire:"Retour - Louxor > Paris", horaire: "26/11 - 15:00 > 19:00"}
},
  };
  
  
  