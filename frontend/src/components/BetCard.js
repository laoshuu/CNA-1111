import styled from 'styled-components';

const StyledMessage = styled.div`
    display: flex;
    align-items: center;    
`;

const BetCard = ({ isMe, message }) => {
    return (
        <StyledBet isMe={isMe}>
            <p>{message}</p>
            {/* <p><Tag color="blue">{name}</Tag> {message}</p> */}
        </StyledBet>
    );
};

export default BetCard;