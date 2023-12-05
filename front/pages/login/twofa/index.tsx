import Otp from "../../../components/Login/otp"
import { Container, InputGroup } from "../index"
import toast, { Toaster } from "react-hot-toast";

const TwoFA = () => {
    return (
        <Container>
        <InputGroup>
            <Otp/>
        </InputGroup>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
      </Container>
    )
}

export default TwoFA;