import styled from 'styled-components';
import { Card } from 'antd';

const StyledBet = styled.div`
    display: flex;
    align-items: center;    
`;
const StyledCard = styled(Card)`
    width: 95%;
    margin: 10px
`;

const BetCard = ({ betTitle, challenger }) => {
    return (
        <StyledCard title={betTitle} bordered={true} onClick={() => {console.log("hello")}}>
            <p>challenger: {challenger}</p>
        </StyledCard>
        // <StyledBet>
        //     <p>{betTitle}</p>
        //     <p><{challenger}</p>
        //     {/* <p><Tag color="blue">{name}</Tag> {message}</p> */}
        // </StyledBet>
    );
};

export default BetCard;