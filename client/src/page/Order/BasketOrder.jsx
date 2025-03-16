import React, { useState, useEffect } from 'react'
import Icon from '@mdi/react';
import { mdiSend, mdiCart, mdiArrowLeft } from '@mdi/js';
import { Collapse, Divider } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

function BasketOrder({ setBasketOpen, basket, setBasket, table, order, getOrder, setLoader }) {

    const handleSendOrder = async () => {
        setLoader(true)
        try {
            const menuData = Array.isArray(basket?.menu) ? basket.menu : [];
            // ข้อมูลที่จะส่ง (เมนูจากตะกร้า)
            const orderData = {
                table,
                menu: menuData?.map(item => ({
                    key: item.key,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price.toString(),  // price ควรเป็น string ตาม schema
                    status: item.status || "waiting",  // ถ้าไม่มี status ให้ใช้ "waiting"
                    image: item.image
                })),
                status: "กำลังรอ"
            };

            // ถ้ามี order ให้ทำการ update
            if (order?.length !== 0) {

                // รวมเมนูเดิมและเมนูใหม่จาก basket
                const finalMenu = [...order?.menu, ...basket?.menu];

                // อัปเดตข้อมูลคำสั่งซื้อ
                const res = await axios.put(`${process.env.REACT_APP_PORT_API}/api/order/update-order/${order._id}`, {
                    ...orderData,
                    menu: finalMenu  // ใช้เมนูที่ผสมระหว่างเดิมกับใหม่
                });
                if (res.status === 200 || res.status === 201) {
                    setBasket([]);  // ล้างตะกร้า
                    getOrder()
                    setTimeout(() => {
                        setLoader(false); // เปลี่ยนสถานะการโหลด
                    }, 500); // หน่วงเวลา 2 วินาที
                    Swal.fire({
                        icon: "success",
                        title: "ส่งออเดอร์แล้ว",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    console.log('Order updated successfully');
                }
            } else {
                // ถ้าไม่มี order ให้ทำการสร้างคำสั่งซื้อใหม่
                const res = await axios.post(`${process.env.REACT_APP_PORT_API}/api/order/add-order`, orderData);

                if (res.status === 201 || res.status === 200) {
                    setBasket([]);  // ล้างตะกร้า
                    getOrder()
                    setTimeout(() => {
                        setLoader(false); // เปลี่ยนสถานะการโหลด
                    }, 500); // หน่วงเวลา 2 วินาที
                    console.log('Order successfully sent');
                }
            }
        } catch (err) {
            console.log('Error order status:', err);
            setTimeout(() => {
                setLoader(false); // เปลี่ยนสถานะการโหลด
            }, 500); // หน่วงเวลา 2 วินาที
        }
    };


    //คิดราคารวม
    const calculateTotalPrice = (tableOrders) => {
        let total = 0;
        // กรองรายการที่มี status เป็น "ได้รับอาหารแล้ว"
        const validOrders = tableOrders?.filter((ob) => ob.status !== "canceled");

        // คำนวณราคาสำหรับรายการที่กรองออกมา
        validOrders?.map((ob) => {
            total += parseFloat(ob.price) * ob.quantity;
        });

        return total;
    };
    console.log(order)
    return (
        <>
            <div onClick={() => setBasketOpen(false)} className='cursor-pointer mb-3 mx-3 px-3 mt-3 py-1 border rounded-lg w-fit flex gap-2 items-center'>
                <Icon path={mdiArrowLeft} size={.8} />
                <p>กลับไปที่รายการอาหาร</p>
            </div>
            {basket?.menu?.length > 0 && (
                <div className='px-3 mt-3'>
                    <h1 className='font-bold'>อยู่ในตะกร้า</h1>
                    <div className='mt-2 overflow-y-scroll'>
                        {(basket?.menu?.length > 0) && (
                            basket?.menu?.map((m, index) => (
                                <div className='p-3 bg-white border shadow rounded-sm flex gap-3 '>
                                    <img src={`${m.image}`} alt="porter" className='w-24 h-24' />
                                    <div className='flex flex-col justify-between w-full  '>
                                        <div className=''>
                                            <p>{m.name}</p>
                                            <p>฿ {m.price}</p>
                                        </div>
                                        <div className='flex justify-between w-full  '>
                                            <p>จำนวน {m.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div className='px-3 mt-3'>
                <Collapse
                    items={[{
                        key: '1', label: 'สั่งแล้ว', children: (
                            <div className='mt-2 overflow-y-scroll'>
                                {order?.menu?.map((m, index) => (
                                    <div key={index} className='p-3 bg-white border shadow rounded-sm flex gap-3 '>
                                        <img src={`${m.image}`} alt="porter" className='w-24 h-24' />
                                        <div className='flex flex-col justify-between w-full  '>
                                            <div className=''>
                                                <p>{m.name}</p>
                                                <p>฿ {m.price}</p>
                                            </div>
                                            <div className='flex justify-between w-full  '>
                                                <p>จำนวน {m.quantity}</p>
                                                {m.status === "cooking" ? (
                                                    <div className='flex flex-wrap justify-end gap-1'>
                                                        <p>อยู่ในครัว</p>
                                                    </div>
                                                ) : m.status === "waiting" ? (
                                                    <div className='flex flex-wrap justify-end gap-1'>
                                                        <p>กำลังรอ</p>
                                                    </div>
                                                ) : m.status === "finish" ? (
                                                    <div className='flex flex-wrap justify-end gap-1'>
                                                        <p className=''>ได้รับแล้ว</p>
                                                    </div>
                                                ) : m.status === "canceled" ? (
                                                    <div className='flex flex-wrap justify-end gap-1'>
                                                        <p>รายการถูกยกเลิก</p>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        )
                    }]}
                />
                {order?.menu?.length > 0 && (
                    <div className='mx-3 mt-5 flex justify-end mb-24 flex-col items-end'>
                        <p>สถานะ: {order?.status}</p>
                        <p>ราคารวมทั้งหมด: {calculateTotalPrice(order?.menu)} บาท</p>
                    </div>
                )}
            </div>

            {basket?.menu?.length > 0 && (
                <div className='w-full bg-white p-5 shadow fixed bottom-0'>
                    <div onClick={() => handleSendOrder()} className='cursor-pointer w-full rounded-lg flex gap-2  justify-center items-center p-3 bg-[#ffcc02]'>
                        <Icon path={mdiSend} size={1} />
                        <p>{basket?.menu?.length} สั่งอาหารในตะกร้าทั้งหมด</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default BasketOrder
