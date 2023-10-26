import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";

  export enum RoleType {
    SuperAdmin,
    Admin,
    USER
}
  interface IFormContext {
    Role: RoleType | null;
    SetRole: Dispatch<SetStateAction<RoleType | null>>;
  }
  
  const FormContext = createContext<IFormContext>({
    Role: null,
    SetRole: () => {},
  });
  
  interface IProps {
    children: ReactNode;
  }
  
  export function RoleProvider({ children }: IProps) {
    const [Role, SetRole] = useState<RoleType | null>(null);
  
    return (
      <FormContext.Provider
         value={{ SetRole, Role }}
      >
        {children}
      </FormContext.Provider>
    );
  }
  
  export function useRoleState() {
    return useContext(FormContext);
  }