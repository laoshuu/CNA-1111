import React, { useState, useRef, useEffect } from 'react';
import FormItem from "antd/es/form/FormItem"

import { Divider, Typography } from 'antd';

import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Space, Modal, Card, Menu, Tabs } from 'antd';
// import { SmileOutlined, User } from '@ant-design/icons';
import UserPage from './UserPage';
import type { RadioChangeEvent } from 'antd';
import type { SpaceSize } from 'antd/es/space';
import { Radio } from 'antd';
import { useChat } from '../Hooks/useChat';
import { useNavigate } from "react-router-dom";

import styled from 'styled-components';

const { Title, Paragraph, Text, Link } = Typography;
const CardWrapper = styled.div`
    display: flex;
    overflow: auto;
    flex-direction: column;
    width: 100%;
    margin-bottom: 100px;
    margin-top: 10px;
}
`
const StyledCard = styled(Card)`
    width: 95%;
    margin: 10px
`;

const StyledBotton = styled(Button)`
    width: 40%;
    height: 10%;
    margin: 10px
`;

const StyledMenu = styled.div`
    display: flex;
    flex-direction: row;
`;

const MainPage = () => {
    const { bet, name, createBet, makeBet } = useChat();
    const [betTitle, setBetTitle] = useState('');
    const [betId, setBetId] = useState('');
    const [betMoney, setBetMoney] = useState(0);
    const [choice, setChoice] = useState('Success');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [tmp, setTmp] = useState(false)

    useEffect(() => {
        if (tmp) {
            navigate("/user")
        }
    }, [tmp]);

    const navigate = useNavigate()
    const showModal = (id, title) => {
        setIsModalOpen(true);
        setBetId(id);
        setBetTitle(title);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        makeBet(betId, name, choice, betMoney)

    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setBetId('')
        setBetMoney(0)
        setBetTitle('')
    };

    const bodyRef = useRef(null);

    const [form] = Form.useForm()

    // const [current, setCurrent] = useState('main');
    // const onClick = (e) => {
    //     console.log('click ', e);
    //     setCurrent(e.key);
    // };

    return (
        <>
            <Title> All Bets Page </Title>
            {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> */}
            {/* <StyledMenu> */}
                <StyledBotton icon={<UserOutlined />} onClick={() => setTmp(true)} > Forward to personal page </StyledBotton>
                <StyledBotton icon={<HomeOutlined />} onClick={() => setTmp(true)} > Back to home page </StyledBotton>
            {/* </StyledMenu> */}
            <CardWrapper>
                {bet.map((e) => (e.challenger === name) ? (<></>) : (<>
                    <StyledCard title={e.title} bordered={true} onClick={() => showModal(e.id, e.title)}>
                        <p>challenger: {e.challenger}</p>
                    </StyledCard>

                </>))
                }
            </CardWrapper>

            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} title={betTitle}
                okText='開賭'
                cancelText='下次再賭'>
                <br />

                <Form
                    form={form}
                    layout='vertical'
                    name='form_in_modal'
                >
                    <FormItem
                        name="name"
                        label="下注金額"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the name of the person to chat!'
                            }
                        ]}
                    >
                        <Input
                            ref={bodyRef}
                            // Save and store the textBody
                            value={betMoney}
                            onChange={(e) => setBetMoney(e.target.value)}
                            placeholder="Enter your bet money..."

                        ></Input>
                        <br />
                        <br />

                        <Radio.Group onChange={(e) => { setChoice(e.target.value) }} defaultValue="Success">
                            <Radio.Button value="Success"> 他敢 </Radio.Button>
                            <Radio.Button value="Fail"> 俗辣啦他不敢 </Radio.Button>
                        </Radio.Group>


                    </FormItem>

                </Form>
            </Modal>
        </>
    );
}

export default MainPage;