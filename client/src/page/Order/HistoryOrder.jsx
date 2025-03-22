import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import axios from 'axios';
import { Collapse, Pagination } from 'antd';
import Icon from '@mdi/react';
import { mdiDownloadCircle, mdiCheckCircleOutline, mdiListBox, mdiCancel, mdiCash, mdiCalculatorVariant } from '@mdi/js';
import { Select } from 'antd';
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import RecieptPDF from '../../components/RecieptPDF';

function HistoryOrder() {


    //loader
    const [loader, setLoader] = useState(null);

    //เรียก order ที่มีอยู่
    const [historyOrder, setHistoryOrder] = useState([])
    useEffect(() => {
        getOrder();
    }, [])

    const getOrder = async () => {
        setLoader(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order-history`);
            // เรียงข้อมูลตามวันที่จากล่าสุดไปหาน้อยสุด
            const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.updatedAt));
            setHistoryOrder(sortedOrders);  // เก็บข้อมูลที่ได้จาก API ลงใน state
            setFilteredOrders(sortedOrders)
            setTimeout(() => {
                setLoader(false); // เปลี่ยนสถานะการโหลด
            }, 500); // หน่วงเวลา 500 มิลลิวินาที
        } catch (err) {
            console.log(err);
            setLoader(false);
        }
    }

    //pagination
    const itemsPerPage = 10; // จำนวนออเดอร์ต่อหน้า
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredOrders, setFilteredOrders] = useState([]);

    // คำนวณ index ของออเดอร์ที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedOrders = filteredOrders.slice(startIndex, endIndex);

    //ฟังก์ชัน select
    const DayNow = new Date();
    // แปลงปี ค.ศ. เป็น พ.ศ.
    const currentYear = DayNow.getFullYear() + 543;

    // ดึงเดือนปัจจุบัน (เริ่มจาก 0 -> 11) และแปลงเป็นชื่อเดือนภาษาไทย
    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const currentMonth = monthNames[DayNow.getMonth()];

    //use state สำหรับกำหนดเดือนและปี
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [showMonth, setShowMonth] = useState(currentMonth)
    const [showYear, setShowYear] = useState(currentYear)
    const handleCalculateSales = () => {
        const filteredOrders = historyOrder.filter(order => {
            if (year === "ทั้งหมด") {
                setShowMonth("ทั้งหมด");
                setShowYear("ทั้งหมด");
                return true;
            }
            const orderDate = new Date(order.updatedAt);
            const orderYear = orderDate.getFullYear() + 543; // แปลงเป็น พ.ศ.
            const orderMonth = monthNames[orderDate.getMonth()]; // แปลงเลขเดือนเป็นชื่อเดือน

            setShowMonth(month);
            setShowYear(year);

            return orderYear === year && orderMonth === month;
        });

        setFilteredOrders(filteredOrders);
        setCurrentPage(1);
    };

    const [totalPrice, setTotalPrice] = useState(0);

    const calculateTotalPrice = () => {
        if (!Array.isArray(filteredOrders) || filteredOrders.length === 0) return 0;

        return filteredOrders.reduce((sum, order) => {
            // ลบคอมมาจาก totalPrice ก่อนแปลงเป็นตัวเลข
            const price = Number(order.totalPrice.replace(/,/g, ''));
            return sum + (isNaN(price) ? 0 : price); // ถ้าเป็น NaN ให้บวก 0
        }, 0);
    };

    useEffect(() => {
        const total = calculateTotalPrice();
        setTotalPrice(total.toLocaleString());
    }, [filteredOrders]);

    console.log(filteredOrders);


    return (
        <>
            <Navbar status="order-history" />
            <div className="container border-[#FFCC00] border-4 rounded-lg mx-auto p-5 px-10 my-10">
                <h2 className='text-xl font-bold'>สรุปยอดขาย</h2>
                <div className='flex justify-between items-end mt-3'>
                    <div>
                        <p>เดือน {showMonth} ปี {showYear}</p>
                        <div className='mt-1'>
                            <div className='flex items-center gap-3'>
                                <Icon className='text-[#FFCC00]' path={mdiListBox} size={.6} />
                                <p>ออเดอร์ทั้งหมด: {filteredOrders?.length} ออเดอร์</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Icon className='text-green-500' path={mdiCheckCircleOutline} size={.6} />
                                <p>สำเร็จ: {filteredOrders?.filter((order) => order.status === "ชำระเงินแล้ว")?.length} ออเดอร์</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Icon className='text-red-500' path={mdiCancel} size={.6} />
                                <p>ยกเลิก: {filteredOrders?.filter((order) => order.status === "รายการถูกยกเลิก")?.length} ออเดอร์</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Icon className='text-[#768564]' path={mdiCash} size={.6} />
                                <p>ยอดขายรวม: {totalPrice} บาท</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                            <p>ปี</p>
                            <Select
                                defaultValue={year}
                                style={{ width: 120 }}
                                onChange={(value) => setYear(value)}
                                options={[
                                    { value: 'ทั้งหมด', label: 'ทั้งหมด' },
                                    { value: 2568, label: '2568' },
                                    { value: 2567, label: '2567' },
                                    { value: 2566, label: '2566' },
                                    { value: 2565, label: '2565' },
                                    { value: 2564, label: '2564' },
                                    { value: 2563, label: '2563' },
                                ]}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>เดือน</p>
                            <Select
                                defaultValue={month}
                                style={{ width: 120 }}
                                onChange={(value) => setMonth(value)}
                                options={[
                                    { value: 'มกราคม', label: 'มกราคม' },
                                    { value: 'กุมภาพันธ์', label: 'กุมภาพันธ์' },
                                    { value: 'มีนาคม', label: 'มีนาคม' },
                                    { value: 'เมษายน', label: 'เมษายน' },
                                    { value: 'พฤษภาคม', label: 'พฤษภาคม' },
                                    { value: 'มิถุนายน', label: 'มิถุนายน' },
                                    { value: 'กรกฎาคม', label: 'กรกฎาคม' },
                                    { value: 'สิงหาคม', label: 'สิงหาคม' },
                                    { value: 'กันยายน', label: 'กันยายน' },
                                    { value: 'ตุลาคม', label: 'ตุลาคม' },
                                    { value: 'พฤศจิกายน', label: 'พฤศจิกายน' },
                                    { value: 'ธันวาคม', label: 'ธันวาคม' },
                                ]}
                                disabled={year === "ทั้งหมด"}
                            />
                        </div>
                        <div onClick={() => handleCalculateSales()} className='px-3 py-1 rounded-lg bg-[#333333] text-white flex items-center gap-1 cursor-pointer hover:opacity-90'>
                            <Icon path={mdiCalculatorVariant} size={.6} />
                            <p className=''>คำนวณยอดขาย</p>
                        </div>
                    </div>
                </div>
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
                                            {order.status !== "รายการถูกยกเลิก" && (
                                                <>
                                                    <div className='flex justify-end mt-5 '>
                                                        <PDFDownloadLink document={<RecieptPDF order={order} />} fileName={`ใบเสร็จ-${order?.table}-${order?._id}`}>
                                                            {({ loading }) => (
                                                                loading ?
                                                                    <p >กำลังเตรียมใบเสร็จ...</p> :
                                                                    <div className='bg-[#FFCC00] cursor-pointer flex items-center gap-1 rounded-lg w-fit px-3 py-1 hover:opacity-90 text-black transition-all'>
                                                                        <Icon path={mdiDownloadCircle} size={.8} />
                                                                        <p>ดาวน์โหลดใบเสร็จ</p>
                                                                    </div>
                                                            )}
                                                        </PDFDownloadLink>

                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ),
                                },
                            ];

                            return <Collapse key={index} items={items} />;
                        })}
                        <div className='mt-5 flex justify-end'>
                            <Pagination
                                current={currentPage}
                                total={filteredOrders.length}
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