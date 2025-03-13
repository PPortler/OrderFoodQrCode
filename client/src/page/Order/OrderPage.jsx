import React, { useEffect, useState } from 'react';
import { Table, Select, Button, Divider } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar';

const { Option } = Select;

function OrderPage() {
    // ข้อมูลตัวอย่างออเดอร์ที่แยกตามโต๊ะ พร้อมราคากับจำนวน
    const [orders, setOrders] = useState({
        A01: [
            { key: '1', item: 'ข้าวผัด', quantity: 1, price: 50, status: 'waiting' },
            { key: '2', item: 'น้ำเปล่า', quantity: 2, price: 20, status: 'waiting' },
        ],
        A02: [
            { key: '3', item: 'สปาเกตตี้', quantity: 1, price: 80, status: 'waiting' },
            { key: '4', item: 'ชาเย็น', quantity: 3, price: 30, status: 'waiting' },
        ],
    });

    const [activeTable, setActiveTable] = useState(null); // กำหนดว่าโต๊ะไหนจะถูกเปิดดูรายละเอียด
    const [tableStatus, setTableStatus] = useState({
        A01: 'กำลังรอ',
        A02: 'กำลังรอ',
        A03: 'กำลังรอ',
    });

    // ฟังก์ชันอัพเดตสถานะรวมของโต๊ะ
    const handleTableStatusChange = (tableKey) => {
        const allInKitchen = orders[tableKey].some((order) => order.status === 'cooking')
        const allInFinish = orders[tableKey].every((order) => order.status === 'finish')
        const allInCancel = orders[tableKey].every((order) => order.status === 'canceled')

        if (allInKitchen) {
            setTableStatus({
                ...tableStatus,
                [tableKey]: "อยู่ในครัว",
            });
        } else if (allInFinish) {
            setTableStatus({
                ...tableStatus,
                [tableKey]: "ได้รับอาหารแล้ว",
            });
        } else if (allInCancel) {
            setTableStatus({
                ...tableStatus,
                [tableKey]: "รายการถูกยกเลิก",
            });
        } 
    };

    // ฟังก์ชันอัพเดตสถานะของรายการอาหาร
    const handleItemStatusChange = (value, tableKey, itemKey) => {
        const updatedOrders = { ...orders };
        const updatedItems = updatedOrders[tableKey].map((item) =>
            item.key === itemKey ? { ...item, status: value } : item
        );
        updatedOrders[tableKey] = updatedItems;
        setOrders(updatedOrders);
    };

    // ฟังก์ชันตรวจสอบว่าออเดอร์ทุกตัวในโต๊ะมีสถานะเป็น 'finish'
    const checkAllItemsFinished = (tableKey) => {
        return orders[tableKey].every((item) => item.status === 'finish' || item.status === 'canceled');
    };

    // ฟังก์ชันตรวจสอบว่าออเดอร์ทุกตัวในโต๊ะมีสถานะเป็น 'waiting'
    const checkAllItemsWaiting = (tableKey) => {
        return orders[tableKey].every((item) => item.status === 'waiting');
    };

    // คำนวณราคาทั้งหมดของออเดอร์ในโต๊ะ
    const calculateTotalPrice = (tableOrders) => {
        return tableOrders.reduce((total, order) => total + order.price * order.quantity, 0);
    };

    // คอลัมน์สำหรับ Table
    const columns = [
        {
            title: 'รายการอาหาร',
            dataIndex: 'item',
            key: 'item',
        },
        {
            title: 'จำนวน',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <div>
                    <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(record.key, e.target.value)}
                        style={{ width: 60 }}
                        disabled={tableStatus[activeTable] === "กำลังรอ"}
                    />
                </div>
            ),
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${text} บาท`,
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleItemStatusChange(value, activeTable, record.key)}
                    disabled={tableStatus[activeTable] === "กำลังรอ"}
                >
                    <Option value="waiting">กำลังรอ</Option>
                    <Option value="cooking">อยู่ในครัว</Option>
                    <Option value="finish">เสร็จแล้ว</Option>
                    <Option value="canceled">ยกเลิกรายการ</Option>
                </Select>
            ),
        },
    ];

    // ฟังก์ชันเปิด/ปิดการแสดงรายละเอียดของโต๊ะ
    const handleTableClick = (tableKey) => {
        setActiveTable(activeTable === tableKey ? null : tableKey);
    };

    //รับออเดอร์
    const confirmOrder = (value, tableKey) => {
        setTableStatus({
            ...tableStatus,
            [tableKey]: value,
        });
    }

    //สำหรับการจัดการจำนวน
    const handleQuantityChange = (itemKey, newQuantity) => {
        const updatedOrders = { ...orders };
        const updatedItems = updatedOrders[activeTable].map((item) => {
            if (item.key === itemKey) {
                return { ...item, quantity: Math.max(1, parseInt(newQuantity, 10)) }; // Prevent quantity from being less than 1
            }
            return item;
        });
        updatedOrders[activeTable] = updatedItems;
        setOrders(updatedOrders);
    };

    return (
        <>
            <Navbar status="order" />
            <div className="container border rounded-lg mx-auto p-5 px-10 mt-10">
                <h2 className="text-xl font-semibold mb-4">รายการออเดอร์</h2>

                {/* แสดงรายการโต๊ะ */}
                <div className="mb-5 flex flex-wrap">
                    {Object.keys(orders).map((tableKey) => (
                        <div key={tableKey} className="">
                            <Button
                                type="default"
                                className="mb-2 mr-2"
                                onClick={() => handleTableClick(tableKey)}
                            >
                                โต๊ะ {tableKey} - สถานะรวม: {tableStatus[tableKey]}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* เมื่อคลิกที่โต๊ะจะแสดงรายละเอียดออเดอร์ในโต๊ะนั้น */}
                {activeTable && (
                    <div>
                        <Divider orientation="left">{`โต๊ะ ${activeTable} - รายละเอียดออเดอร์`}</Divider>
                        <div className='flex justify-end mb-1'>
                            <Button
                                icon={<ReloadOutlined />}
                                color="default" variant="filled"
                            >
                                รีเฟรช
                            </Button>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={orders[activeTable]}
                            pagination={false}
                            bordered
                            rowKey="key"
                            footer={() => (
                                <div>
                                    <strong>ราคาทั้งหมด: </strong>{calculateTotalPrice(orders[activeTable])} บาท
                                </div>
                            )}
                        />

                        {/* แสดงสถานะของโต๊ะ */}
                        <div className="flex flex-col items-end justify-end mt-5">
                            {activeTable && (
                                <div className="flex items-center gap-2">
                                    <p>สถานะโต๊ะ: </p>
                                    <p>{tableStatus[activeTable]}</p>
                                </div>
                            )}
                            {activeTable && (
                                <div className="flex gap-3 mt-5">
                                    <Button color="danger" variant="solid" icon={<CloseCircleOutlined />} >
                                        ยกเลิกรายการ
                                    </Button>
                                    {tableStatus[activeTable] === "กำลังรอ" ? (
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => confirmOrder("กำลังรออาหาร", activeTable)}
                                        >
                                            รับออเดอร์
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            icon={<ExclamationCircleOutlined />}
                                            onClick={() => handleTableStatusChange(activeTable)}
                                        >
                                            อัพเดทรายการ
                                        </Button>
                                    )}
                                    {checkAllItemsFinished(activeTable) && tableStatus[activeTable] === "ได้รับอาหารแล้ว" ? (
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                        >
                                            ชำระเงิน {calculateTotalPrice(orders[activeTable])} ฿
                                        </Button>
                                    ) : (
                                        <></>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default OrderPage;
