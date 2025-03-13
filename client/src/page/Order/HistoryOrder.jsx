import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Table, Tag, Collapse, Pagination } from 'antd';

const { Panel } = Collapse;

function HistoryOrder() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // ปรับจำนวนออเดอร์ต่อหน้าให้เหมาะสม

    const [orders, setOrders] = useState([
        { key: '1', table: 'A01', items: [{ item: 'ข้าวผัด', quantity: 1, price: 50, status: 'canceled' }, { item: 'น้ำเปล่า', quantity: 2, price: 20, status: 'finish' }], date: '2025-03-05 12:30' },
        { key: '2', table: 'A02', items: [{ item: 'สปาเกตตี้', quantity: 1, price: 80, status: 'finish' }, { item: 'ชาเย็น', quantity: 3, price: 30, status: 'finish' }], date: '2025-03-04 15:00' },
        { key: '3', table: 'A01', items: [{ item: 'ข้าวผัด', quantity: 2, price: 50, status: 'finish' }], date: '2025-03-05 13:00' },
        { key: '4', table: 'A06', items: [{ item: 'ข้าวผัด', quantity: 2, price: 50, status: 'finish' }], date: '2025-03-05 13:00' },
        { key: '5', table: 'B02', items: [{ item: 'โค้ก', quantity: 1, price: 25, status: 'finish' }], date: '2025-03-05 14:30' },
        { key: '6', table: 'B05', items: [{ item: 'เฟรนช์ฟราย', quantity: 2, price: 60, status: 'finish' }], date: '2025-03-05 15:00' },
    ]);

    // ฟังก์ชันคำนวณราคารวมของออเดอร์
    const calculateTotal = (order) => order.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Slice ออเดอร์ตามหน้าปัจจุบัน
    const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // กำหนด columns สำหรับการแสดงตาราง
    const columns = [
        { title: 'รายการอาหาร', dataIndex: 'item', key: 'item' },
        { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity' },
        { title: 'ราคา (บาท)', dataIndex: 'price', key: 'price', render: (text) => `${text} บาท` },
        { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'canceled' ? 'red' : 'green'}>{status === 'canceled' ? 'ยกเลิก' : 'เสร็จสิ้น'}</Tag> },
    ];

    return (
        <>
            <Navbar status="order-history" />

            <div className="container border rounded-lg mx-auto p-5 px-10 mt-10">
                <h2>ประวัติการทำรายการ</h2>
                <div className='mt-5'>
                    {paginatedOrders.length > 0 ? (
                        <Collapse defaultActiveKey={[]} expandIconPosition="right">
                            {paginatedOrders.map((order) => (
                                <Panel key={order.key} header={`วันที่ ${order.date} - โต๊ะ ${order.table} - ราคารวมทั้งหมด: ${calculateTotal(order)} บาท`}>
                                    <Table columns={columns} dataSource={order.items} rowKey="item" pagination={{ pageSize: 3 }} bordered size="middle" />
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <p className="text-center mt-5">ไม่มีข้อมูลในหน้านี้</p>
                    )}
                    {/* Pagination ควบคุม Collapse */}
                    <Pagination
                        className="mt-4 text-center"
                        current={currentPage}
                        pageSize={pageSize}
                        total={orders.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </>
    );
}

export default HistoryOrder;