import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";


  interface IFormContext {
    formData: any;
    setFormData: Dispatch<SetStateAction<any>>;
    onHandleBack: () => void;
    onHandleNext: () => void;
    onHandleSetStep: (nb: number) => void;
    onHandleSetClose: (nb: number) => void;
    onHandleSetCreate: (nb: number) => void;
    step: number;
    close : number;
    create: number;
  }
  
  const FormContext = createContext<IFormContext>({
    formData: {},
    onHandleBack: () => {},
    onHandleNext: () => {},
    setFormData: () => {},
    onHandleSetClose: () => {},
    onHandleSetStep: () => {},
    onHandleSetCreate: () => {},
    step: 0,
    close : 1,
    create: 1,
  });
  
  interface IProps {
    children: ReactNode;
  }
  
  export function MofifSettingProvider({ children }: IProps) {

    const [formData, setFormData] = useState({
    });

    const [close, setClose] = useState(1);
    const [create, setCreate] = useState(1);
    const [step, setStep] = useState(1);
    
    function onHandleSetCreate (nb: number) {
      setCreate(nb);
    }
    function onHandleSetClose (nb: number) {
      setClose(nb);
    }
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
        value={{ formData, setFormData, onHandleBack, onHandleNext, onHandleSetStep, step, close, onHandleSetClose, onHandleSetCreate, create}}
      >
        {children}
      </FormContext.Provider>
    );
  }
  
  export function useModifState() {
    return useContext(FormContext);
  }
  