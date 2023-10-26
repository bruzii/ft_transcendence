import { InputContainer, Label2,  } from "../../themes/styles"
import Image from "next/image"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import { LogoContainer, Title, TitleContainer, InputGroup, Subtitle, Container, Button} from "../../pages/login"
import { Input, Label, InputLabel } from "../../themes/styles";
import { useResetPassword } from "../../context/resetPassword";
import { validateForm, Touch } from "../../helpers/helpers";
import {UPDATE_PASSWORD} from "../../Apollo/mutations/user";
import { useMutation } from "@apollo/client";
import Router from "next/router";

const ResetPwd = () => {
    const [state, setState] = useState({
        password: "",
        confirmPassword: "",
      });
      const { setResetData , onHandleBack, onHandleSetStep, resetData } = useResetPassword();
      const [email, setEmail] = useState<string>("brucegervais29@gmail.com")
      const [updatePassword, { data }] = useMutation(UPDATE_PASSWORD, {
        variables: {
            password: state.password,
            reConfirmPassord: state.confirmPassword,
            email :resetData?.email,
            skip: !state.password || !state.confirmPassword || !email
        }
      })
      const [show, setShow] = useState(false)
      const OnchangeValue = (e: any) => {
        if (e.target.name === "confirmPassword")
          setState((prevstate) => ({ ...prevstate, confirmPassword: e.target.value }));
        else if (e.target.name === "password")
          setState((prevstate) => ({ ...prevstate, password: e.target.value }));
      };

      const OnSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const { data } = await updatePassword()
            console.log("data received", data);
            toast.success(<b>{data.UpdatePassword.message}</b>, {
                duration: 700,
                ariaProps: {
                  role: 'status',
                  'aria-live': 'polite',
                },
              });
              setTimeout(() => {
            onHandleSetStep(0)
            Router.push("/login"), 1000})

        } catch (err){
          // toast.error(<b>{data.UpdatePassword.message}</b>)
            console.log(err)
        }
      }
      console.log("resetData ", resetData)  
    return (
        <>
            {/* <LogoContainer>
           <Image src={front} width={150} height={80} />
          </LogoContainer> */}
          <TitleContainer>
            <Title>Change your password</Title>
                <Subtitle>
                Enter your new password
                </Subtitle>
          </TitleContainer>
          <InputContainer>
          <Label >
                <Input 
                    type="text"
                    name="password"
                    onChange={OnchangeValue}
                    value={state.password}
                    required={true}
                    />
                <InputLabel  Validate={validateForm("password", state.password)} touch={Touch(state.password)}>Password</InputLabel>
            </Label>
            <Label >
                <Input 
                    type="text"
                    name="confirmPassword"
                    onChange={OnchangeValue}
                    value={state.confirmPassword}
                    required={true}
                    />
                <InputLabel  Validate={state.confirmPassword ===  state.password} touch={Touch(state.confirmPassword)}>Confirm Password</InputLabel>
            </Label>
            <Button onClick={OnSubmit}>Enregistrer</Button>
          </InputContainer>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
       </>
    )
}

export default ResetPwd