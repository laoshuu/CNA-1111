import React, { useState, useRef, useEffect } from "react";
import { Divider, Typography } from 'antd';
import { Button, Col, Row, Statistic } from 'antd';
import { useChat } from "../Hooks/useChat";
import styled from "styled-components";

const { Title, Paragraph, Text, Link } = Typography;
const StatisticStyle = styled(Statistic)`
    width: 80%;
    margin: 10px;
`;
const MoneyStyle = styled.div`
    display: flex
    flex-direction: row
`;

const UserPage = () => {
    const { name, money } = useChat();
    return (
        <>
            <Title> {name}'s Personal Page </Title>
            <MoneyStyle>
                <Title level={4}> 剩餘金額 </Title>
                <StatisticStyle title="NTU Dollar" value={money} precision={2} />
            </MoneyStyle>
                        
            <Title level={2}> 下注中 </Title>
            <Title level={2}> 開局 </Title>
        </>
    );
}
export default UserPage;