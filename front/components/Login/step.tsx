import Otp from "./otp";
import SentEmail from "./SentEmail";
import ResetPwd from "./resetPassword";
import { useResetPassword } from "../../context/resetPassword";
const HandleStep = (props: any) => {
    const { setResetData ,step , resetData } = useResetPassword();
    switch (step) {
        case 1:
            return  <SentEmail />;
        case 2:
            return  <Otp />;
        case 3:
            return  <ResetPwd />;
        default:
          return null;
      }

    }

    export default HandleStep;