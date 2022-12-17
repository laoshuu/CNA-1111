import React, { useEffect } from 'react'
import { Card } from 'antd';
import { Col, Row } from 'antd';
import { Typography } from 'antd';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { useChat } from '../Hooks/useChat';

const StyledFormItem = styled(Form.Item)`
    margin: 30px 0px;
    text-align: left;
`

const { Title, Text } = Typography;

export default function Register() {
    const [ form ] = Form.useForm();
    const { register, registerToBE } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        if ( register === true ) {
            navigate('/')
        }
    }, [register])

    const onFinish = (values) => {
        registerToBE(values.username, values.password);
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
                        Sign up to get an access to join your chat rooms with your friends.
                    </Title>
                    <Form
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        scrollToFirstError
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
                                prefix={<UserOutlined/>} 
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
                        <StyledFormItem
                            required
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                  },
                                }),
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Confirmed Password"
                            />
                        </StyledFormItem>
                        <StyledFormItem>
                            <Button 
                                type="primary" 
                                style={{ width: "100%" }}
                                htmlType="submit"
                            >
                                Register
                            </Button>
                        </StyledFormItem>
                    </Form>
                    <Text style={{ color: 'gray' }}>
                        Already have an account? 
                        <Link to="/"> Log in</Link>
                    </Text>
                    <Text style={{ display: 'block', color: 'gray', marginTop: '10px' }}>
                        By signing up, you agree to our <b>Terms</b>, <b>Data Policy</b> and <b>Cookies Policy</b>.
                    </Text>
                </Col>
            </Row>
        </Card>
    )
}
