import React, { useEffect } from 'react'
import { Card } from 'antd';
import { Col, Row } from 'antd';
import { Typography } from 'antd';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { useChat } from '../Hooks/useChat';
import { useNavigate } from "react-router-dom";

const StyledFormItem = styled(Form.Item)`
    margin: 30px 0px;
    text-align: left;
`

const { Title, Text } = Typography;
const LOCALSTORAGE_KEY = "save-user";
export default function Login() {
    const saveUser = localStorage.getItem(LOCALSTORAGE_KEY)
    const [form] = Form.useForm();
    const { name, setName, login, loginToBE, initChatToBE } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        if (login === true) {
            navigate('/main');
            // navigate('/chat');
            // initChatToBE();
        }
    }, [login])

    useEffect(() => {
        console.log("login:" + login)
        try {
            localStorage.setItem(LOCALSTORAGE_KEY, name);
        } catch (err) {
            setName("" || saveUser)  // 將username更新為上次登錄者
        }
    }, [])

    const onFinish = async (values) => {
        loginToBE(values.username, values.password)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Received Error of form: ', errorInfo);
    };

    return (
        <Card style={{ width: '70%', textAlign: 'center' }}>
            <Row>
                <Col span={24}>
                    <Title>My Chat Room</Title>
                    <Title level={4} style={{ color: 'gray' }}>
                        Log in to join your chat rooms with your friends.
                    </Title>
                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        scrollToFirstError
                        initialValues={{ username: name }}
                    >
                        <StyledFormItem
                            required
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Username"
                            />
                        </StyledFormItem>
                        <StyledFormItem
                            required
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                            />
                        </StyledFormItem>
                        <StyledFormItem>
                            <Button
                                type="primary"
                                style={{ width: "100%" }}
                                htmlType="submit"
                            >
                                Login
                            </Button>
                        </StyledFormItem>
                    </Form>
                    <Text style={{ color: 'gray' }}>
                        Don't have an account?
                        <Link to="/register"> Sign up</Link>
                    </Text>
                </Col>
            </Row>
        </Card>
    )
}
