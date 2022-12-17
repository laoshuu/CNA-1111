import React, { useState, useRef } from 'react';
import { Card } from 'antd';
import { Col, Row } from 'antd';
import { Button, Checkbox, Form, Input, Space, Radio, Modal } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { SpaceSize } from 'antd/es/space';
import FormItem from "antd/es/form/FormItem"

import { useChat } from '../Hooks/useChat';


const MakeBetModal = ({ open, onCreate, onCancel }) => {
    const { name, createBet, makeBet } = useChat();
    const [betTitle, setBetTitle] = useState('');
    const [betMoney, setBetMoney] = useState(0);
    const [choice, setChoice] = useState('Success');
    const bodyRef = useRef(null);

    const [form] = Form.useForm()
    return (
        <Modal
            open={open}
            title='Make A Bet'
            okText='開賭'
            cancelText='下次再賭'

            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then((values) => {
                    form.resetFields()
                    onCreate(values)
                }).catch((err) => {
                    window.alert(err)
                })
            }}
        >
            <Form
                form={form}
                layout='vertical'
                name='form_in_modal'
            >
                <FormItem
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name of the person to chat!'
                        }
                    ]}
                >
                    <Radio.Group onChange={(e) => { setChoice(e.target.value) }} defaultValue="Success">
                        <Radio.Button value="Success"> 他敢 </Radio.Button>
                        <Radio.Button value="Fail"> 俗辣啦他不敢 </Radio.Button>
                    </Radio.Group>
                    <Input.Search
                        ref={bodyRef}
                        // Save and store the textBody
                        value={betMoney}
                        onChange={(e) => setBetMoney(e.target.value)}
                        enterButton="Make Bet"
                        placeholder="Enter your bet money..."
                        onSearch={() => {
                            makeBet(betTitle, name, choice, betMoney) // 這裡不知道行不行直接存這個 title value
                        }}
                    ></Input.Search>
                    <Input />
                </FormItem>

            </Form>

        </Modal>
        // <Card style={{ width: '100%', textAlign: 'center' }}>
        // <Row gutter={40}>
        //     <Col>
        //     <h3>Make A Bet</h3>
        //     <br />
        //     <Radio.Group onChange={(e) => { setChoice(e.target.value) }} defaultValue="Success">
        //         <Radio.Button value="Success"> 他敢 </Radio.Button>
        //         <Radio.Button value="Fail"> 俗辣啦他不敢 </Radio.Button>
        //     </Radio.Group>
        //     <br />
        //     <br />
        //     <Input.Search
        //         ref={bodyRef}
        //         // Save and store the textBody
        //         value={betMoney}
        //         onChange={(e) => setBetTitle(e.target.value)}
        //         enterButton="Make Bet"
        //         placeholder="Enter your bet money..."
        //         onSearch={() => {
        //             makeBet(betTitle, name, choice, betMoney) // 這裡不知道行不行直接存這個 title value
        //         }}
        //     ></Input.Search>
        //     </Col>
        // </Row>
        // </Card>
    );
}
export default MakeBetModal;