import React, { useState, useRef } from 'react';
import { Button, Checkbox, Form, Input, Space, Modal } from 'antd';
import type { SpaceSize } from 'antd/es/space';
import FormItem from "antd/es/form/FormItem"

// Don't remove files directly !!
const CreateBetModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()
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
            title="Create your Bet"
            okText='建立賭注挑戰'
            cancelText='下次再來'
        >
            <Form
                form={form}
                layout='vertical'
                name='form_in_modal'
            >
                <FormItem
                    name="name"
                    label="挑戰名稱"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name of your challenge!'
                        }
                    ]}
                >
                    <Input />
                </FormItem>
            </Form>
        </Modal>
    )
}

export default CreateBetModal;