import React from 'react';

function Navbar() {
    return (
        <div className="bg-blue-500 text-white py-2 px-5">
            <div className="flex justify-between items-center container mx-auto">
                <a href="#order" className="text-lg font-semibold">Order Food QR</a>
                <div className="flex">
                    <a href="#order" className="hover:bg-blue-700 px-3 py-2 rounded">ออเดอร์</a>
                    <a href="#menu" className="hover:bg-blue-700 px-3 py-2 rounded">รายการอาหาร</a>
                    <a href="#table" className="hover:bg-blue-700 px-3 py-2 rounded">จัดการโต๊ะ</a>
                    <a href="#order-history" className="hover:bg-blue-700 px-3 py-2 rounded">ประวัติออเดอร์</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
