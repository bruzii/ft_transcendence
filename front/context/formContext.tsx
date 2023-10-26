import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";
  import { GET_USER_QUERY } from '../Apollo/query/user';
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "../constants/types";
import { useQuery } from "@apollo/client";
import { useToken } from "../hooks";
import { FormDataType } from "../constants/interfaces";

  interface IFormContext {
    formData: any;
    setFormData: Dispatch<SetStateAction<any>>;
    onHandleBack: () => void;
    onHandleNext: () => void;
    onHandleSetStep: (nb: number) => void;
    step: number;
  }
  
  const FormContext = createContext<IFormContext>({
    formData: {},
    onHandleBack: () => {},
    onHandleNext: () => {},
    setFormData: () => {},
    onHandleSetStep: () => {},
    step: 0,
  });
  
  interface IProps {
    children: ReactNode;
  }


  export function FormProvider({ children }: IProps) {
    const [email, setEmail] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_USER_QUERY, {
      variables: { email: email },
      skip: !email,
    });
    const [formData, setFormData] = useState<FormDataType>();
    const {Token} = useToken()
    const handleFormDataUpdate = (updatedData : FormDataType) => {
      // Mettez à jour formData ici
      setFormData(updatedData);
    
      // Effectuez d'autres actions avec les données mises à jour si nécessaire
      console.log("formData a été mis à jour :", updatedData);
    };
    // useEffect(() => {
    //   if (Token) {
    //     const decode = jwtDecode(Token) as DecodedToken;
    //     setEmail(decode.email);
    //     console.log("decode 4",decode.email)
    //   }
    //   if (queryData && queryData.getUser) {
    //     console.log("queryData 2", queryData)
    //     const user = queryData.getUser;
    //     const updatedDefaultFormData : FormDataType= {
    //       ...formData,
    //       email: user.email,
    //       userName: user.userName,
    //       lastName: user.lastName,
    //       tel: user.tel,
    //       dateOfBirth: user.dateOfBirth,
    //       passeport: user.passeport,
    //       passportExpirationDate: user.passportExpirationDate,
    //       company: user.company,
    //       billingAddress: user.billingAddress,
    //       billingStoreCode: user.billingStoreCode,
    //       // Set d'autres valeurs à partir de use
    //     };console.log("updatedDefaultFormData", updatedDefaultFormData)
    //     setFormData(updatedDefaultFormData)
        
    //     console.log("formData 1", formData)
    //   }
    // }, [queryData, Token, email, step]);
    
    useEffect(() => { 
      console.log("formData 2", formData)
    }, [formData])


    console.log("queryData 1", queryData)
  
    function onHandleNext() {
      setStep((prev) => prev + 1);
    }
    function onHandleSetStep(nb: number) {
      setStep(nb);
    }
    function onHandleBack() {
      setStep((prev) => prev - 1);
    }
  
    return (
      <FormContext.Provider
        value={{ formData, setFormData, onHandleBack, onHandleNext, step, onHandleSetStep}}
      >
        {children}
      </FormContext.Provider>
    );
  }
  
  export function useFormState() {
    return useContext(FormContext);
  }
  