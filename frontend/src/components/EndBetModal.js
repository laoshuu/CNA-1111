import React, { useState, useRef } from 'react';
import { Divider, Typography } from 'antd';
import { Button, Checkbox, Form, Input, Space, Modal, Upload, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { SpaceSize } from 'antd/es/space';
import FormItem from "antd/es/form/FormItem"
import { useChat } from '../Hooks/useChat';
// import Title from 'antd/es/skeleton/Title';
const { Title, Paragraph, Text, Link } = Typography;

const EndBetModal = ({ open, onCreate, onCancel }) => {
    const { result, setResult } = useChat();
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }} >
                Upload
            </div>
        </div>
    );

    return (
        <Modal
            open={open}
            onOk={() => {
                // form.validateFields().then((values) => {
                //     form.resetFields()
                //     onCreate(values)
                // }).catch((err) => {
                //     window.alert(err)
                // })
                onCreate(result)
            }}
            onCancel={onCancel}
            // title='End your Bet'
            title={ <p style={{fontSize: '18px'}}> End your Bet </p> } 
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
                    <br />
                    <br />
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length > 3 ? null : uploadButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default EndBetModal;