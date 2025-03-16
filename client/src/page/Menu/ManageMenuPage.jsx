import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar';
import MenuData from '../../assets/menu.json'


function ManageMenuPage() {
    const [form] = Form.useForm(); // สร้าง instance ของ form
    const [menuItems, setMenuItems] = useState(MenuData); // ใช้ข้อมูลจาก JSON แทน

console.log(MenuData)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const columns = [
        {
            title: 'ชื่อรายการ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${text} บาท`,
        },
        {
            title: 'จำนวน',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'รูปภาพ',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} alt="food" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'การดำเนินการ',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                        className='bg-[#FFCC00] hover:opacity-90'
                        type='none'
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                        danger
                    />
                </>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingItem(null); // Reset the editing item
        form.resetFields(); // Reset form fields when adding a new item
        setIsModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue(item); // Populate form with the values of the item
        setIsModalVisible(true);
    };

    const handleDelete = (key) => {
        setMenuItems(menuItems.filter((item) => item.key !== key));
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalOk = () => {
        const formValues = form.getFieldsValue(); // Get form values
        if (editingItem) {
            // Update the existing item
            setMenuItems(
                menuItems.map((item) =>
                    item.key === editingItem.key ? { ...item, ...formValues } : item
                )
            );
        } else {
            // Add a new item
            const newItem = { ...formValues, key: `${menuItems.length + 1}` };
            setMenuItems([...menuItems, newItem]);
        }
        setIsModalVisible(false);
    };

    return (
        <>
            <Navbar status="menu" />
            <div className="container border-[#FFCC00] border-4 rounded-lg mx-auto p-5 px-10 my-10">
                <Button
                    type="none"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    style={{ marginBottom: 16 }}
                    className='bg-[#FFCC00] hover:opacity-90'
                >
                    เพิ่มรายการอาหาร
                </Button>
                <Table
                    columns={columns}
                    dataSource={menuItems}
                    rowKey="key"
                />
                <Modal
                    title={editingItem ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหาร'}
                    visible={isModalVisible}
                    onCancel={handleModalCancel}
                    onOk={handleModalOk}
                >
                    <Form
                        form={form} // กำหนด form instance ที่นี่
                        initialValues={editingItem} // Use editingItem for initial values
                        layout="vertical"
                        onFinish={handleModalOk}
                    >
                        <Form.Item
                            name="name"
                            label="ชื่อรายการ"
                            rules={[{ required: true, message: 'กรุณากรอกชื่อรายการ' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="รายละเอียด"
                            rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="ราคา"
                            rules={[{ required: true, message: 'กรุณากรอกราคา' }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="จำนวน"
                            rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="ลิงค์รูปภาพ"
                            rules={[{ required: true, message: 'กรุณากรอกลิงค์รูปภาพ' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default ManageMenuPage;
