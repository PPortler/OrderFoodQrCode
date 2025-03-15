import React, { useState } from 'react';

function NavbarOrder({ table, setBasketOpen }) {
    return (
        <div className="bg-[#333333] px-5 shadow py-3 text-white">
            <div className="flex justify-between items-center container mx-auto">
                <a href={`/order/${table}`} className="text-xl font-semibold"><span className=''>จิ้มจุ่มลานนา</span> <span className='text-[#FFCC00]'>มหาสารคาม</span></a>
                {/* <div className="flex">
                    <a href="/" className={`py-3 ${status === "order" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ออเดอร์</a>
                    <a href="/manage-menu" className={`py-3 ${status === "menu" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>รายการอาหาร</a>
                    <a href="/manage-table" className={`py-3 ${status === "table" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>จัดการโต๊ะ</a>
                    <a href="/order-history" className={`py-3 ${status === "order-history" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ประวัติออเดอร์</a>
                </div> */}
                <div onClick={() => setBasketOpen(true)}>
                   โต๊ะ: {table}
                </div>
            </div>
        </div>
    );
}

export default NavbarOrder;
