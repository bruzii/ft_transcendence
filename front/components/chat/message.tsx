import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.50);
    box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    color: #000;
`;

type MessageProps = {
    data: {
        content: string;
    }[];
};

const Message = ({ data }: MessageProps) => {
    console.log("data ", data)
    return (
        <Container>
            {data.map((msg, index) => (
                <li key={index}>{msg.content}</li>
            ))}
        </Container>
    )
}

export default Message
