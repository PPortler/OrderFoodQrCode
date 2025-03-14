import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Card, Button } from 'antd';
import { QRCodeCanvas } from 'qrcode.react'; // ใช้ QRCodeCanvas แทน QRCode
import tableData from '../../assets/table.js'

function ManageTablePage() {
  // สร้างข้อมูลตัวอย่างของโต๊ะ
  const [tables, setTables] = useState(tableData);

  const handleDownloadQRCode = (url) => {
    const canvas = document.getElementById('qrcode-canvas');
    const imageUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'qrcode.png'; // ชื่อไฟล์ที่ต้องการให้ดาวน์โหลด
    link.click();
  };

  return (
    <>
      <Navbar status="table" />
      <div className="container border rounded-lg mx-auto p-5 px-10 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <Card
              key={table.id}
              title={table.tableName}
              extra={<Button type="link" onClick={() => handleDownloadQRCode(table.url)}>ดาวน์โหลด QR</Button>}
              hoverable
              style={{ width: 240 }}
            >
              {/* ใช้ QRCodeCanvas แทน QRCode */}
              <QRCodeCanvas id="qrcode-canvas" value={table.url} size={150} />
              <div className="mt-4">
                <p>ลิงค์สำหรับสั่งอาหาร</p>
                <p className=' overflow-hidden text-ellipsis whitespace-nowrap'>{table.url}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default ManageTablePage;
