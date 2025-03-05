import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Card, Button } from 'antd';
import { QRCodeCanvas } from 'qrcode.react'; // ใช้ QRCodeCanvas แทน QRCode

function ManageTablePage() {
  // สร้างข้อมูลตัวอย่างของโต๊ะ
  const [tables, setTables] = useState([
    { id: 1, tableName: 'A01', url: `${process.env.REACT_APP_REACT_URL}/order/1` },
    { id: 2, tableName: 'A02', url: `${process.env.REACT_APP_REACT_URL}/order/2` },
    { id: 3, tableName: 'A03', url: `${process.env.REACT_APP_REACT_URL}/order/3` },
    { id: 4, tableName: 'A04', url: `${process.env.REACT_APP_REACT_URL}/order/4` },
    { id: 5, tableName: 'A05', url: `${process.env.REACT_APP_REACT_URL}/order/5` },
    { id: 6, tableName: 'A06', url: `${process.env.REACT_APP_REACT_URL}/order/6` },
    { id: 7, tableName: 'A07', url: `${process.env.REACT_APP_REACT_URL}/order/7` },
    { id: 8, tableName: 'A08', url: `${process.env.REACT_APP_REACT_URL}/order/8` },
  ]);

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
                <p>{table.url}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default ManageTablePage;
