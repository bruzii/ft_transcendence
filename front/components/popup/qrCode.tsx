import Image from "next/image"
import styled from "styled-components"


const Container = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 100;
`;
const QrCode = ( { qrCode, onClose }: { qrCode: string , onClose: () => void} ) => {
    console.log('qrCode', qrCode)
    console.log("typeof qrCode", typeof qrCode)
    console.log(`data:image/png;base64,${qrCode}`)
    return (
        <Container>
                <Image src={qrCode} alt="qrCode" width={400} height={400} />
            <button onClick={onClose}>Close</button>
        </Container>
    )
}

export default QrCode
