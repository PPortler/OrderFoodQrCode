import React from 'react'
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - ไม่พบหน้า</h1>
            <p className=''>ขออภัย! ไม่พบหน้าที่คุณต้องการ</p>
            <p className='mb-5'>กรุณาย้อนกลับ</p>
            {/* <Link className='border px-2 py-1 rounded-lg ' to="/">กลับไปหน้าหลัก</Link> */}
        </div>
    )
}

export default NotFound
