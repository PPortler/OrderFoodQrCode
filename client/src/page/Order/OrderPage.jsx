import React, { useEffect, useState } from 'react';
import { Table, Select, Button, Divider } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar';
import axios from 'axios'
import Loader from '../../components/Loader'
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import BeatLoader from "react-spinners/BeatLoader";

const { Option } = Select;

function OrderPage() {

    // ข้อมูลตัวอย่างออเดอร์ที่แยกตามโต๊ะ พร้อมราคากับจำนวน
    const [orders, setOrders] = useState([]);

    //loader
    const [loader, setLoader] = useState(false);

    //เรียก order ที่มัอยู่
    useEffect(() => {
        getOrder();
    }, [])

    const getOrder = async () => {
        setLoader(true)
        try {
            const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order`);
            setOrders(res.data);  // เก็บข้อมูลที่ได้จาก API ลงใน state

            setTimeout(() => {
                setLoader(false); // เปลี่ยนสถานะการโหลด
            }, 500); // หน่วงเวลา 2 วินาที
        } catch (err) {
            console.log(err)
            setLoader(false)
        }
    }
    const [activeTable, setActiveTable] = useState(null); // กำหนดว่าโต๊ะไหนจะถูกเปิดดูรายละเอียด

    const handleTableStatusChange = async (tableKey) => {
        const menu = orders[tableKey]?.menu || [];

        const allInKitchen = menu.some((order) => order.status === 'cooking');
        const allInWaiting = menu.some((order) => order.status === 'waiting');
        const allInCancel = menu.every((order) => order.status === 'canceled');
        const allFinishedOrCanceled = menu.every(
            (order) => order.status === 'finish' || order.status === 'canceled'
        );

        // อัพเดตสถานะของโต๊ะ
        let newStatus = '';

        if (allInKitchen) {
            newStatus = "อยู่ในครัว";
        } else if (allInCancel) {
            newStatus = "ยกเลิกรายการ";
        } else if (allFinishedOrCanceled) {
            newStatus = "ได้รับอาหารครบแล้ว";
        } else if (allInWaiting) {
            newStatus = "กำลังรออาหาร";
        }

        // อัพเดตสถานะใน orders
        let NewOrder = {
            ...orders,
            [tableKey]: {
                ...orders[tableKey], // คงข้อมูลเดิมของโต๊ะ
                status: newStatus,    // อัพเดตสถานะใหม่
            },
        }

        try {
            let tempOrder = NewOrder[tableKey]
            // ส่งคำสั่ง PUT ไปยัง API เพื่ออัพเดตข้อมูลในฐานข้อมูล
            const res = await axios.put(`${process.env.REACT_APP_PORT_API}/api/order/update-order/${orders[tableKey]?._id}`, tempOrder);
            console.log('Order status updated:', res.data); // สามารถแสดงผลข้อมูลที่ตอบกลับจาก API ได้ที่นี่
        } catch (err) {
            console.log('Error updating order status:', err);
        }
        setOrders(NewOrder);

    };



    const handleItemStatusChange = (value, tableKey, itemKey) => {
        // คัดลอกข้อมูลจาก orders มา
        const updatedOrders = { ...orders };
        // ค้นหาเมนูใน orders ตาม tableKey และทำการอัพเดตสถานะของรายการที่ตรงกับ itemKey
        const updatedMenu = updatedOrders[tableKey]?.menu.map((item) =>
            item._id === itemKey ? { ...item, status: value } : item
        );
        // อัพเดต menu ของโต๊ะที่เลือกใน updatedOrders
        updatedOrders[tableKey] = {
            ...updatedOrders[tableKey],
            menu: updatedMenu
        };

        // เซ็ต orders ใหม่
        setOrders(updatedOrders);
    };


    // ฟังก์ชันตรวจสอบว่าออเดอร์ทุกตัวในโต๊ะมีสถานะเป็น 'finish'
    const checkAllItemsFinished = (tableKey) => {
        return orders[tableKey]?.menu?.every((item) => item.status === 'finish' || item.status === 'canceled');
    };

    const calculateTotalPrice = (tableOrders) => {
        let total = 0;
        // กรองรายการที่มี status เป็น "ได้รับอาหารแล้ว"
        const validOrders = tableOrders?.filter((ob) => ob.status !== "canceled");

        // คำนวณราคาสำหรับรายการที่กรองออกมา
        validOrders?.map((ob) => {
            total += parseFloat(ob.price) * ob.quantity;
        });

        return total.toLocaleString();
    };

    // คอลัมน์สำหรับ Table
    const columns = [
        {
            title: 'รายการอาหาร',
            dataIndex: 'name',
            key: 'name',
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
                        disabled={orders[activeTable].status === "กำลังรอ"}
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
                    onChange={(value) => handleItemStatusChange(value, activeTable, record._id)}
                    disabled={orders[activeTable].status === "กำลังรอ"}
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
        setActiveTable(tableKey);
    };

    //รับออเดอร์
    const confirmOrder = (value, tableKey) => {
        setOrders({
            ...orders,
            [tableKey]: {
                ...orders[tableKey], // คัดลอกข้อมูลของโต๊ะที่ต้องการ
                status: value, // อัพเดตสถานะของโต๊ะ
            },
        });
        handleTableStatusChange(activeTable)
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

    //บันทึกรายการ
    const handleSubmitOrder = async (tableKey, value) => {
        let allowed = false
        let status = ""
        if (value === "ยกเลิกรายการ") {
            const result = await Swal.fire({
                title: 'ลบรายการ?',
                text: 'คุณต้องการยกเลิกรายการนี้หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'bg-red-400 text-white ',  // ปุ่มตกลง
                    cancelButton: '',      // ปุ่มยกเลิก
                }
            });

            // ถ้าเลือก 'ใช่, ยกเลิก'
            if (result.isConfirmed) {
                allowed = true;
                status = "รายการถูกยกเลิก"
            }
        }
        if (value === "ได้รับอาหารครบแล้ว") {
            const result = await Swal.fire({
                title: 'ชำระเงินแล้ว',
                text: 'คุณต้องการยืนยันการชำระเงินของรายการนี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'bg-[#FFCC00] text-black ',  // ปุ่มตกลง
                    cancelButton: '',      // ปุ่มยกเลิก
                }
            });

            // ถ้าเลือก 'ใช่, ยกเลิก'
            if (result.isConfirmed) {
                allowed = true;
                status = "ชำระเงินแล้ว"

            }
        }

        const totalPrice = calculateTotalPrice(orders[tableKey]?.menu)
        if (allowed) {
            setLoader(true);
            let NewOrder = {
                ...orders,
                [tableKey]: {
                    ...orders[tableKey], // คงข้อมูลเดิมของโต๊ะ
                    status: status,    // อัพเดตสถานะใหม่
                    totalPrice: totalPrice
                },
            }
            try {
                let tempOrder = NewOrder[tableKey]
                // ส่งคำสั่ง PUT ไปยัง API เพื่ออัพเดตข้อมูลในฐานข้อมูล
                const res = await axios.post(`${process.env.REACT_APP_PORT_API}/api/order-history/add-order`, tempOrder);

                if (res.status === 201) {
                    const resOrder = await axios.delete(`${process.env.REACT_APP_PORT_API}/api/order/delete-order/${tempOrder._id}`);
                    if (resOrder.status === 200) {
                        setLoader(false);
                        Swal.fire({
                            icon: "success",
                            title: "บันทึกสำเร็จ",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setActiveTable(null)
                        getOrder();
                        return;
                    }
                }
            } catch (err) {
                console.log('Error updating order status:', err);
                setLoader(false);
            }
        }
    }

    return (
        <>
            <Navbar status="order" />
            <div className="container border-[#FFCC00] border-4 relative rounded-lg mx-auto p-5 px-10 my-10 mt-24">
                <div className=' w-full flex justify-center'>
                    <div className='absolute top-[-58px] border-4 border-[#FFCC00] rounded-full bg-white p-1'>
                        <img src="/logo.jpg" alt="logo" className='w-24 h-24 rounded-full' />
                    </div>
                </div>
                <div className='flex justify-between mb-4 relative'>
                    <h2 className="text-xl font-semibold ">รายการออเดอร์</h2>
                    <Button
                        icon={<ReloadOutlined />}
                        color="default" variant="filled"
                        onClick={() => getOrder()}
                    >
                        รีเฟรช
                    </Button>
                </div>

                {/* แสดงรายการโต๊ะ */}
                {orders?.length === 0 && loader === false ? (
                    <div className='flex flex-col items-center gap-4 justify-center mt-5 text-xs text-gray-400'>
                        <img src="https://stickershop.line-scdn.net/stickershop/v1/product/1910981/LINEStorePC/main.png?v=1" alt="Logo" className='w-56 h-56' />  {/* เพิ่ม class mr-2 เพื่อระยะห่างจากข้อความ */}
                        {/* <BeatLoader
                            color="#3c82f6"
                            size={8}
                        /> */}
                        ยังไม่มีออเดอร์
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex flex-wrap">
                            {Object.keys(orders).map((tableKey) => (
                                <div key={tableKey} className="">
                                    <Button
                                        type="none"
                                        className={`${tableKey === activeTable ? "bg-gray-300 pointer-events-none" : "hover:border-[#333333] hover:outline-[#333333] hover:text-[#333333]"} border-gray-200 mb-2 mr-2`}
                                        onClick={() => handleTableClick(tableKey)}
                                    >
                                        โต๊ะ {orders[tableKey]?.table} - สถานะ: {orders[tableKey]?.status}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* เมื่อคลิกที่โต๊ะจะแสดงรายละเอียดออเดอร์ในโต๊ะนั้น */}
                        {activeTable && (
                            <div>
                                <Divider orientation="left">{`โต๊ะ ${orders[activeTable].table} - รายละเอียดออเดอร์`}</Divider>

                                <Table
                                    columns={columns}
                                    dataSource={orders[activeTable].menu}
                                    pagination={false}
                                    bordered
                                    rowKey="key"
                                    footer={() => (
                                        <div>
                                            <strong>ราคาทั้งหมด: </strong>{calculateTotalPrice(orders[activeTable]?.menu)} บาท
                                        </div>
                                    )}
                                />

                                {/* แสดงสถานะของโต๊ะ */}
                                <div className="flex flex-col items-end justify-end mt-5">
                                    {activeTable && (
                                        <div className="flex items-center gap-2">
                                            <p>สถานะโต๊ะ: </p>
                                            <p>{orders[activeTable].status}</p>
                                        </div>
                                    )}
                                    {activeTable && (
                                        <div className="flex gap-3 mt-5">
                                            <Button color="danger" variant="solid" icon={<CloseCircleOutlined />}
                                                onClick={() => handleSubmitOrder(activeTable, "ยกเลิกรายการ")}
                                            >
                                                ยกเลิกรายการ
                                            </Button>
                                            {orders[activeTable].status === "กำลังรอ" ? (
                                                <Button
                                                    type="none"
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() => confirmOrder("กำลังรออาหาร", activeTable)}
                                                    className='bg-[#FFCC00] hover:opacity-90'
                                                >
                                                    รับออเดอร์
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="none"
                                                    icon={<ExclamationCircleOutlined />}
                                                    onClick={() => handleTableStatusChange(activeTable)}
                                                    className='bg-[#FFCC00] hover:opacity-90'
                                                >
                                                    อัพเดทรายการ
                                                </Button>
                                            )}
                                            {checkAllItemsFinished(activeTable) && orders[activeTable].status === "ได้รับอาหารครบแล้ว" && (
                                                <Button
                                                    className='bg-green-600 text-white'
                                                    type='none'
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() => handleSubmitOrder(activeTable, "ได้รับอาหารครบแล้ว")}
                                                >
                                                    ชำระเงิน {calculateTotalPrice(orders[activeTable]?.menu)} ฿
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {loader && (
                <>
                    <Loader />
                </>
            )}
        </>
    );
}

export default OrderPage;
