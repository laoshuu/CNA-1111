import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useChat } from '../Hooks/useChat';

import EndBetModal from "./EndBetModal";


const StyledBet = styled.div`
    display: flex;
    align-items: center;    
`;
const StyledCard = styled(Card)`
    width: 95%;
    margin: 10px
`;

const BetCard = ({ betTitle, challenger, betType, betID }) => {
    // End Bet Modal
    const { name, result, madeBet, endBet } = useChat();
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const showEndBet = () => {
        setIsEndModalOpen(true);
    };
    const Modal_on_create = (title) => {
        // Already exist
        // send message to backend
        
        endBet(name, betID, result)
        setIsEndModalOpen(false)
    }

    const Modal_on_cancel = () => {
        setIsEndModalOpen(false)
    }

    if (betType === 'Create') {
        return (
            <>
                <StyledCard
                    hoverable
                    title={betTitle}
                    bordered={true}
                    onClick={() => { setIsEndModalOpen(true) }}
                // actions={[
                //     <CheckOutlined key="finish" />
                // ]}
                >
                    <p>challenger: {challenger}</p>
                </StyledCard>
                <EndBetModal
                    open={isEndModalOpen}
                    onCreate={({ title }) => Modal_on_create(title)}
                    onCancel={() => { Modal_on_cancel() }}
                />
            </>
        );
    }
    else {
        return;
    }
};

export default BetCard;