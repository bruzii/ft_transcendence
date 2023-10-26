import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";
  interface IFormContext {
    resetData: any;
    setResetData: Dispatch<SetStateAction<any>>;
    onHandleBack: () => void;
    onHandleNext: () => void;
    onHandleSetStep: (nb: number) => void;
    step: number;
  }
  
  const ResetContext = createContext<IFormContext>({
    resetData: {},
    onHandleBack: () => {},
    onHandleNext: () => {},
    setResetData: () => {},
    onHandleSetStep: () => {},
    step: 0,
  });
  
  interface IProps {
    children: ReactNode;
  }
  
  export function ResetPasswordProvider({ children }: IProps) {

    const [resetData, setResetData] = useState({
    });


    const [step, setStep] = useState(1);
  
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
      <ResetContext.Provider
        value={{ resetData, setResetData, onHandleBack, onHandleNext, onHandleSetStep, step,  }}
      >
        {children}
      </ResetContext.Provider>
    );
  }
  
  export function useResetPassword() {
    return useContext(ResetContext);
  }
  