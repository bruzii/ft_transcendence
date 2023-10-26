
import { Label2 } from "../../themes/styles"
import Image from "next/image"
import { LogoContainer, TitleContainer, Button, Title, Subtitle } from "../../pages/login"
import { Input } from "../../themes/styles"
import { InputContainer } from "../../themes/styles"
import { useState } from "react"
import front from "../../assets/images/Logo_Black.png";
import { FORGOT_PASSWORD } from "../../Apollo/mutations/user"
import { useMutation } from "@apollo/client"
import Router from "next/router"
import Otp from "./otp"
import toast, { Toaster } from "react-hot-toast";
import { useResetPassword } from '../../context/resetPassword';

const SentEmail = () => {
    const { setResetData , onHandleBack, onHandleNext, resetData, step } = useResetPassword();
    const [email, setEmail] = useState<string | null>(null)
    const [id, setId] = useState<number | null>(null)
    const [error, setError]= useState<null | string>(null)
    const OnchangeValue = (e: any) => {
        setEmail(e.target.value)
        setResetData({email: e.target.value})
    }
    const [forgotPassword, { data }] = useMutation(FORGOT_PASSWORD, {
        variables: {
            email: email,
            skip: !email
        }
    })

    const OnSubmit = async (e : any) => {
        e.preventDefault()
        if (email === null || email === ""){
            toast.error("Email is required")
            return
        }
        try {
            const { data } = await forgotPassword()
            // if user exist set true else setError
            console.log("data received", data.ForgotPassword.otp.id);
            console.log("data received", data.ForgotPassword);
            setId(data.ForgotPassword.otp.id)
            toast.success(<b>{data.ForgotPassword.message}</b>, {
                duration: 700,
                ariaProps: {
                  role: 'status',
                  'aria-live': 'polite',
                },
              });
              onHandleNext();
        }catch(err) {
            toast.error(<b>Utilisateur non trouve</b>)
            console.log("err")
        }
    }
    console.log("step" , step)
    return (
        <>
            <>
            <LogoContainer>
            <Image src={front} width={150} height={80} />
            </LogoContainer>
            <TitleContainer>
                <Title>Reset Password</Title>
                <Subtitle>
                    You gone a receive a code verification by email
                </Subtitle>
            </TitleContainer>
            <InputContainer>
                <Label2>Email</Label2>

                <Input
                id="nom"
                type="email"
                name="email"
                placeholder="email"
                value={email ? email : ""}
                onChange={OnchangeValue}
                />
                {error ? <p>{error}</p> : null}
                <Button onClick={OnSubmit}>Envoyer</Button>
            </InputContainer>
       </>
       </>
    )
}

export default SentEmail