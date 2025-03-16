import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPlus, mdiCart, mdiMinus } from '@mdi/js';

function NavbarOrder({ table, setBasketOpen, orderCount }) {
    return (
        <div className=" sticky top-0 z-10 bg-white px-3 shadow py-2 text-[#333333]">
            <div className="flex justify-between items-center container mx-auto">
                <a href={`/order/${table}`} className="text-xl font-semibold"><span className=''>โต๊ะ: {table}</span></a>
                {/* <div className="flex">
                    <a href="/" className={`py-3 ${status === "order" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ออเดอร์</a>
                    <a href="/manage-menu" className={`py-3 ${status === "menu" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>รายการอาหาร</a>
                    <a href="/manage-table" className={`py-3 ${status === "table" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>จัดการโต๊ะ</a>
                    <a href="/order-history" className={`py-3 ${status === "order-history" ? "border-b-white border-b-4 rounded-none":""} hover:bg-blue-700 px-3 py-2 `}>ประวัติออเดอร์</a>
                </div> */}
                <div className=' border-black border-2 cursor-pointer flex gap-1 px-2 py-1 rounded-lg justify-center items-center' onClick={() => setBasketOpen(true)}>
                    <Icon path={mdiCart} size={.7} />|
                    <p>{orderCount || 0}</p>
                </div>
            </div>
        </div>
    );
}

export default NavbarOrder;
