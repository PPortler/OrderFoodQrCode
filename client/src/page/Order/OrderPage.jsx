import React, { useState } from 'react';
import { Table, Select, Button, Divider } from 'antd';

const { Option } = Select;

function OrderPage() {
    // ข้อมูลตัวอย่างออเดอร์ที่แยกตามโต๊ะ พร้อมราคากับจำนวน
    const [orders, setOrders] = useState({
        A01: [
            { key: '1', item: 'ข้าวผัด', quantity: 1, price: 50, status: 'waiting' },
            { key: '2', item: 'น้ำเปล่า', quantity: 2, price: 20, status: 'waiting' },
        ],
        A02: [
            { key: '3', item: 'สปาเกตตี้', quantity: 1, price: 80, status: 'finish' },
            { key: '4', item: 'ชาเย็น', quantity: 3, price: 30, status: 'finish' },
        ],
        A03: [
            { key: '3', item: 'สปาเกตตี้', quantity: 1, price: 80, status: 'waiting' },
            { key: '4', item: 'ชาเย็น', quantity: 3, price: 30, status: 'waiting' },
        ],
    });

    const [activeTable, setActiveTable] = useState(null); // กำหนดว่าโต๊ะไหนจะถูกเปิดดูรายละเอียด
    const [tableStatus, setTableStatus] = useState({
        A01: 'รออาหาร',
        A02: 'ได้รับอาหารแล้วครบแล้ว',
        A03: 'รอรับออเดอร์',
    });

    // ฟังก์ชันอัพเดตสถานะรวมของโต๊ะ
    const handleTableStatusChange = (value, tableKey) => {
        setTableStatus({
            ...tableStatus,
            [tableKey]: value,
        });
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
                >
                    <Option value="waiting">กำลังรอ</Option>
                    <Option value="cooking">อยู่ในครัว</Option>
                    <Option value="finish">เสร็จสิ้น</Option>
                    <Option value="canceled">ยกเลิกรายการ</Option>
                </Select>
            ),
        },
    ];

    // ฟังก์ชันเปิด/ปิดการแสดงรายละเอียดของโต๊ะ
    const handleTableClick = (tableKey) => {
        setActiveTable(activeTable === tableKey ? null : tableKey);
    };

    return (
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
                                <Button color="danger" variant="solid">
                                    ยกเลิกรายการ
                                </Button>
                                {tableStatus[activeTable] === 'paid' || tableStatus[activeTable] === 'canceled' ? (
                                    <Button type="primary">จบรายการ</Button>
                                ) : (
                                    <Button type="primary">อัพเดทรายการ</Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderPage;
