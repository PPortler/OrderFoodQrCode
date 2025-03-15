import React, { useState } from 'react';

function Navbar({ status }) {
    return (
        <div className="bg-[#333333] text-white px-5 shadow">
            <div className="flex justify-between items-center container mx-auto ">
                <a href="/" className="text-lg font-semibold"><span className=''>จิ้มจุ่มลานนา</span> <span className='text-[#FFCC00]'>มหาสารคาม</span></a>
                <div className="flex ">
                    <a href="/" className={`py-3 ${status === "order" ? "border-b-white border-b-4 rounded-none":""} hover:bg-[#FFCC00] hover:text-black px-3 py-2 transtion-all duration-75`}>ออเดอร์</a>
                    <a href="/manage-menu" className={`py-3 ${status === "menu" ? "border-b-white border-b-4 rounded-none":""} hover:bg-[#FFCC00] hover:text-black px-3 py-2 transtion-all duration-75`}>รายการอาหาร</a>
                    <a href="/manage-table" className={`py-3 ${status === "table" ? "border-b-white border-b-4 rounded-none":""} hover:bg-[#FFCC00] hover:text-black px-3 py-2 transtion-all duration-75`}>จัดการโต๊ะ</a>
                    <a href="/order-history" className={`py-3 ${status === "order-history" ? "border-b-white border-b-4 rounded-none":""} hover:bg-[#FFCC00] hover:text-black px-3 py-2 transtion-all duration-75`}>ประวัติออเดอร์</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
