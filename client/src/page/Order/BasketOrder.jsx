import React, { useState, useEffect } from 'react'
import Icon from '@mdi/react';
import { mdiSend, mdiPlus, mdiArrowLeft, mdiMinus } from '@mdi/js';
import { Collapse } from 'antd';
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

        return total.toLocaleString(); // จะแสดงเป็น 1,000, 1,500, ...
    };

    //เพิ่มรายการอาหาร
    const handleAddBasket = (menu) => {
        setBasket((prevBasket) => {
            // ตรวจสอบว่า prevBasket.menu เป็น array หรือไม่ ถ้าไม่ใช่ ให้เป็น array ว่าง
            const menuList = Array.isArray(prevBasket.menu) ? prevBasket.menu : [];

            // ตรวจสอบว่ามีเมนูนี้ใน basket หรือไม่
            const existingMenuIndex = menuList.findIndex(item => item.key === menu.key);

            // ถ้ามีเมนูนี้อยู่แล้ว ให้เพิ่ม quantity ขึ้น 1
            if (existingMenuIndex !== -1) {
                // ใช้ spread operator เพื่อสร้าง array ใหม่และเพิ่ม quantity ขึ้น 1
                const updatedMenu = menuList.map((item, index) => {
                    if (index === existingMenuIndex) {
                        return { ...item, quantity: item.quantity + 1 }; // เพิ่ม quantity
                    }
                    return item; // เก็บรายการอื่นๆ ไว้เหมือนเดิม
                });

                return {
                    ...prevBasket,
                    menu: updatedMenu, // อัพเดท menu ที่มีการเพิ่ม quantity
                };
            }

            // ถ้ายังไม่มีเมนูนี้ใน basket ให้เพิ่มเมนูใหม่ด้วย quantity = 1 และ status = "waiting"
            return {
                ...prevBasket,
                menu: [
                    ...menuList, // เก็บรายการเก่าไว้
                    { ...menu, quantity: 1, status: "waiting" } // เพิ่มเมนูใหม่พร้อม status
                ]
            };
        });
    };

    // ฟังก์ชันลบรายการอาหาร
    const handleDeleteBasket = (menu) => {
        setBasket((prevBasket) => {
            // ตรวจสอบว่า prevBasket.menu เป็น array หรือไม่ ถ้าไม่ใช่ ให้เป็น array ว่าง
            const menuList = Array.isArray(prevBasket.menu) ? prevBasket.menu : [];

            // ตรวจสอบว่ามีเมนูนี้ใน basket หรือไม่
            const existingMenuIndex = menuList.findIndex(item => item.key === menu.key);

            // ถ้ามีเมนูนี้อยู่แล้ว ให้ลด quantity ลง 1
            if (existingMenuIndex !== -1) {
                const updatedMenu = menuList.map((item, index) => {
                    if (index === existingMenuIndex) {
                        if (item.quantity > 1) {
                            // ถ้า quantity > 1 ให้ลดลง 1
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            // ถ้า quantity เหลือ 1 ให้ลบเมนูออกจาก basket
                            return null;
                        }
                    }
                    return item;
                }).filter(item => item !== null); // ลบรายการที่เป็น null (กรณีลบเมนูที่ quantity เหลือ 1)

                return {
                    ...prevBasket,
                    menu: updatedMenu, // อัพเดท menu หลังจากลด quantity หรือ ลบรายการ
                };
            }

            return prevBasket; // ถ้าไม่มีเมนูใน basket ไม่ต้องทำอะไร
        });
    };

    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <div>
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
                                        <img src={`${m.image}`} alt="porter" className='w-24 min-w-24 h-24' />
                                        <div className='flex flex-col justify-between w-full  '>
                                            <div className=''>
                                                <p>{m.name}</p>
                                                <p>฿ {m.price}</p>
                                            </div>
                                            <div className='flex justify-end w-full  '>
                                                <div className="flex justify-end w-full">
                                                    {basket?.menu?.some((n) => n.key === m.key) ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="bg-[#ffcc02] cursor-pointer"
                                                                onClick={() => handleDeleteBasket(m)}
                                                            >
                                                                <Icon path={mdiMinus} size={1} />
                                                            </div>
                                                            <p>{basket?.menu.find((n) => n.key === m.key)?.quantity}</p>
                                                            <div
                                                                className="bg-[#ffcc02] cursor-pointer"
                                                                onClick={() => handleAddBasket(m)}
                                                            >
                                                                <Icon path={mdiPlus} size={1} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleAddBasket(m)}>
                                                            <Icon path={mdiPlus} size={1} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <div className='px-3 mt-3 mb-10'>
                    <Collapse
                        items={[{
                            key: '1', label: 'สั่งแล้ว', children: (
                                <div className='mt-2 overflow-y-scroll'>
                                    {order?.menu?.map((m, index) => (
                                        <div key={index} className='p-3 bg-white border shadow rounded-sm flex gap-3 '>
                                            <img src={`${m.image}`} alt="porter" className='w-24 min-w-24 h-24' />
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
                        <div className='mx-3 mt-5 flex justify-end  flex-col items-end'>
                            <p>สถานะ: {order?.status}</p>
                            <p>ราคารวมทั้งหมด: {calculateTotalPrice(order?.menu)} บาท</p>
                        </div>
                    )}
                </div>

               
            </div>
            {basket?.menu?.length > 0 && (
                    <div className='w-full bg-white p-5 shadow sticky bottom-0 '>
                        <div onClick={() => handleSendOrder()} className='cursor-pointer w-full rounded-lg flex gap-2  justify-center items-center p-3 bg-[#ffcc02]'>
                            <Icon path={mdiSend} size={1} />
                            <p>{basket?.menu?.length} สั่งอาหารในตะกร้าทั้งหมด</p>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default BasketOrder
