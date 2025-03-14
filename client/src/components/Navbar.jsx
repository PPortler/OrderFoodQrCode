import React, { useState } from 'react';

function Navbar({ status }) {
    return (
        <div className="bg-blue-500 text-white px-5">
            <div className="flex justify-between items-center container mx-auto">
                <a href="#order" className="text-lg font-semibold">จิ้มจุ่มลานนา มหาสารคาม</a>
                <div className="flex">
                    <a href="/" className={`py-3 ${status === "order" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ออเดอร์</a>
                    <a href="/manage-menu" className={`py-3 ${status === "menu" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>รายการอาหาร</a>
                    <a href="/manage-table" className={`py-3 ${status === "table" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>จัดการโต๊ะ</a>
                    <a href="/order-history" className={`py-3 ${status === "order-history" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ประวัติออเดอร์</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
