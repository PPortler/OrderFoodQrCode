import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import axios from 'axios';
import { Collapse, Pagination } from 'antd';

function HistoryOrder() {


    //loader
    const [loader, setLoader] = useState(false);

    //เรียก order ที่มีอยู่
    const [historyOrder, setHistoryOrder] = useState([])
    useEffect(() => {
        getOrder();
    }, [])

    const getOrder = async () => {
        setLoader(true)
        try {
            const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order-history`);
            setHistoryOrder(res.data);  // เก็บข้อมูลที่ได้จาก API ลงใน state

            setTimeout(() => {
                setLoader(false); // เปลี่ยนสถานะการโหลด
            }, 500); // หน่วงเวลา 2 วินาที
        } catch (err) {
            console.log(err)
            setLoader(false)
        }
    }

    //pagination
    const itemsPerPage = 10; // จำนวนออเดอร์ต่อหน้า
    const [currentPage, setCurrentPage] = useState(1);

    // คำนวณ index ของออเดอร์ที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedOrders = historyOrder.slice(startIndex, endIndex);

    console.log(historyOrder)
    return (
        <>
            <Navbar status="order-history" />

            <div className="container border-[#FFCC00] border-4 rounded-lg mx-auto p-5 px-10 my-10">
                <h2 className='text-xl font-bold'>ประวัติการทำรายการ</h2>
                <div className='mt-5'>
                    <div className="mt-5">
                        {displayedOrders?.map((order, index) => {
                            const items = [
                                {
                                    key: order._id,
                                    label: (
                                        <div className="p-2 px-5 flex justify-between">
                                            <div>
                                                <p>โต๊ะ: {order.table}</p>
                                                <p>เวลา: {new Date(order.updatedAt).toLocaleString("th-TH", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {order.status === "รายการถูกยกเลิก" ? (
                                                    <p className="font-bold text-red-400 text-xl">รายการถูกยกเลิก</p>
                                                ) : (
                                                    <p className="font-bold text-green-400 text-xl">{order.totalPrice} +</p>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                    children: (
                                        <div className="p-2 px-5">
                                            <h3 className="font-bold">รายการอาหาร</h3>
                                            {order.menu.map((item, i) => (
                                                <div key={i} className="flex justify-between border-b py-2">
                                                    <div>
                                                        <p className="font-bold">{item.name} x {item.quantity}</p>

                                                        {item.status === "cooking" ? (
                                                            <p className="font-bold">สถานะ: อยู่ในครัว</p>
                                                        ) : item.status === "waiting" ? (
                                                            <p className="font-bold">สถานะ: กำลังรอ</p>
                                                        ) : item.status === "finish" ? (
                                                            <p className="font-bold">สถานะ: ได้รับแล้ว</p>
                                                        ) : item.status === "canceled" ? (
                                                            <p className="font-bold">สถานะ: ยกเลิก</p>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center'>
                                                        <p className="font-bold">{item.price} บาท</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <p className="font-bold mt-2 text-end">รวม {order.totalPrice} บาท</p>

                                        </div>
                                    ),
                                },
                            ];

                            return <Collapse key={index} items={items} />;
                        })}
                        <div className='mt-5 flex justify-end'>
                            <Pagination
                                current={currentPage}
                                total={historyOrder.length}
                                pageSize={itemsPerPage}
                                onChange={page => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {loader && (
                <Loader />
            )}
        </>
    );
}

export default HistoryOrder;