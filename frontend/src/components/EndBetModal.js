import React, { useState, useRef } from 'react';
import { Button, Checkbox, Form, Input, Space, Modal, Upload, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { SpaceSize } from 'antd/es/space';
import FormItem from "antd/es/form/FormItem"
import { useChat } from '../Hooks/useChat';

const EndBetModal = ({ open, onCreate, onCancel }) => {
    const { setResult } = useChat();

    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            onOk={() => {
                form.validateFields().then((values) => {
                    form.resetFields()
                    onCreate(values)
                }).catch((err) => {
                    window.alert(err)
                })
            }}
            onCancel={onCancel}
            title="End your Bet"
            okText='Confirm'
            cancelText='Cancel'
        >
            <Form
                form={form}
                layout='vertical'
                name='form_in_modal'
            >
                <FormItem
                    name="name"
                    label="挑戰成功 or 失敗"
                    rules={[
                        {
                            required: true,
                            message: 'Please choose the result of your challenge!'
                        }
                    ]}
                >
                    <Radio.Group onChange={(e) => { setResult(e.target.value) }} >
                        <Radio.Button value="Success"> Success </Radio.Button>
                        <Radio.Button value="Fail"> Fail </Radio.Button>
                    </Radio.Group>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default EndBetModal;