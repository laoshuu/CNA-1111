import React, { useState, useRef, useEffect } from 'react';
import { Divider, Typography } from 'antd';
import { useChat } from '../Hooks/useChat';
const { Title, Paragraph, Text, Link } = Typography;

const MailPage = () => {
    const { name, money, mail } = useChat();
    return (
        <>
            <Title> {name}'s Mail Box </Title>
        </>
    )
}
export default MailPage;