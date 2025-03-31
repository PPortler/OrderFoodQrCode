import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";

Font.register({
    family: 'THSarabunNew',
    fonts: [
        {
            src: require('../assets/fonts/THSarabun/THSarabunNew.ttf'),
        },
        {
            src: require('../assets/fonts/THSarabun/THSarabunNew Bold.ttf'),
            fontWeight: 'bold', // น้ำหนักฟอนต์แบบหนา
        }
    ]
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        color: "#262626",
        fontFamily: "THSarabunNew",
        fontSize: "12px",
        padding: "30px 50px",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
    },
    textBold: {
        fontFamily: "THSarabunNew",
        fontWeight: 'bold'
    },
    spaceY: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    billTo: {
        marginBottom: 10,
    },
    table: {
        width: "100%",
        borderColor: "1px solid #f3f4f6",
        margin: "14px 0",
    },
    tableHeader: {
        backgroundColor: "#e5e5e5",
    },
    td: {
        padding: 6,
    },
    totals: {
        display: "flex",
        alignItems: "flex-end",
    },
});


const TotalSummary = ({ order, month }) => {
    const tableData = []; // สร้าง array เปล่าสำหรับเก็บข้อมูล
    const dailySummary = {}; // ใช้เก็บยอดรวมของแต่ละวัน

    let totalMonthlyPrice = 0; // ตัวแปรเก็บยอดรวมของ totalPrice ทั้งเดือน
    let totalMonthlyGetMoney = 0; // ตัวแปรเก็บยอดรวมของ getMoney ทั้งเดือน
    let totalMonthlyChangeMoney = 0; // ตัวแปรเก็บยอดรวมของ changeMoney ทั้งเดือน

    // เรียงวันที่จาก 1, 2, 3, ... โดยใช้ sort()
    const sortedDates = Object.keys(order).sort((a, b) => {
        return new Date(a) - new Date(b);  // เปรียบเทียบวันที่
    });

    sortedDates.forEach((date) => {
        console.log(`วันที่: ${date}`);
        const ordersOnDate = order[date];  // เอาข้อมูลของวันนั้น

        // เรียงคำสั่งซื้อ (ordersOnDate) ตาม createdAt (เวลา)
        const sortedOrders = ordersOnDate.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt); // เรียงจากเวลาที่เร็วสุด
        });

        let totalPriceForDate = 0; // ตัวแปรเก็บยอดรวม totalPrice ของวัน
        let getMoneyForDate = 0; // ตัวแปรเก็บยอดรวม getMoney ของวัน
        let changeMoneyForDate = 0; // ตัวแปรเก็บยอดรวม changeMoney ของวัน

        // วนลูปผ่าน orders ที่เรียงตามเวลา
        sortedOrders.forEach((orderItem) => {

            // แปลง createdAt เป็นเวลาที่ต้องการ
            const createdAt = new Date(orderItem.createdAt); // แปลง ISO string เป็น Date object
            const formattedTime = createdAt.toLocaleString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }); // แสดงเป็นรูปแบบไทย

            // เพิ่มข้อมูลของแต่ละออร์เดอร์ลงใน tableData
            tableData.push({
                date: date,
                table: orderItem.table,
                status: orderItem.status,
                totalPrice: orderItem.totalPrice.replace(/,/g, ''),
                getMoney: orderItem.getMoney,
                changeMoney: orderItem.changeMoney,
                createdAt: formattedTime,  // เพิ่มเวลา
            });

            if (orderItem.status !== "รายการถูกยกเลิก") {  // ถ้าสถานะไม่ใช่ "ยกเลิก"
                // คำนวณยอดรวมของแต่ละวัน (เฉพาะรายการที่ไม่ถูกยกเลิก)
                totalPriceForDate += orderItem.totalPrice ? Number(orderItem.totalPrice.replace(/,/g, '')) : 0;
                getMoneyForDate += orderItem.getMoney ? Number(orderItem.getMoney.replace(/,/g, '')) : 0;
                changeMoneyForDate += orderItem.changeMoney ? Number(orderItem.changeMoney.replace(/,/g, '')) : 0;
            }
        });

        // เก็บข้อมูลยอดรวมของแต่ละวัน
        dailySummary[date] = {
            totalPrice: totalPriceForDate,
            getMoney: getMoneyForDate,
            changeMoney: changeMoneyForDate
        };

        // คำนวณยอดรวมทั้งหมดของเดือน
        totalMonthlyPrice += totalPriceForDate; // เพิ่มยอดรวมของ totalPrice ทั้งเดือน
        totalMonthlyGetMoney += getMoneyForDate; // เพิ่มยอดรวมของ getMoney ทั้งเดือน
        totalMonthlyChangeMoney += changeMoneyForDate; // เพิ่มยอดรวมของ changeMoney ทั้งเดือน
    });

    const totalData = [
        {
            label: "รวมทั้งสิ้น",
            value: `${totalMonthlyPrice.toLocaleString()} บาท`,
        }
    ];

    // ฟังก์ชันแปลงเวลาเป็นรูปแบบที่ต้องการ
    function formatDateTime(date) {
        const createdAt = new Date(date); // แปลงเป็น Date object
        return createdAt.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }); // แสดงเป็นรูปแบบไทย
    }

    const currentTime = formatDateTime(new Date()); // ใช้เวลาปัจจุบัน (new Date()) และแปลงเป็นรูปแบบที่ต้องการ

    const renderTableHeader = () => (
        <TH style={[styles.tableHeader, styles.textBold]}>
            <TD style={styles.td}>วันที่</TD>
            <TD style={styles.td}>โต๊ะ</TD>
            <TD style={styles.td}>สถานะ</TD>
            <TD style={styles.td}>ยอดรวม</TD>
        </TH>
    );

    const itemsPerPage = 20; // ตั้งค่าแถวที่จะแสดงในแต่ละหน้า
    const pages = Math.ceil(tableData.length / itemsPerPage); // คำนวณจำนวนหน้าจากจำนวนข้อมูล

    return (
        <Document>
            {[...Array(pages)].map((_, pageIndex) => (
                <Page size="A4" style={styles.page} key={pageIndex}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, styles.textBold]}>สรุปยอดขาย</Text>
                            <Text>ยอดขายเดือน {month}</Text>
                            <Text>ณ วันที่: {currentTime}</Text>
                        </View>
                        <View style={styles.spaceY}>
                            <Text style={styles.textBold}>จิ้มจุ้มลานนา มหาสารคาม</Text>
                            <Text>147 ม.2 มหาสารคาม, ตำบลลานสะแก</Text>
                            <Text> อำเภอเมือง 44110</Text>
                        </View>
                    </View>

                    {/* Render the table header */}
                    <Table style={styles.table}>
                        {renderTableHeader()}

                        {/* Render rows for the current page */}
                        {(tableData || []).slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((item, index) => (
                            <TR key={index}>
                                <TD style={styles.td}>{item.createdAt}</TD>
                                <TD style={styles.td}>{item.table}</TD>
                                <TD style={styles.td}>{item.status}</TD>
                                <TD style={styles.td}>฿{parseFloat(item.totalPrice).toLocaleString()}</TD>
                            </TR>
                        ))}
                    </Table>
                    {/* Show total at the last page */}
                    {pageIndex === pages - 1 && (
                        <View style={styles.totals}>
                            <View style={{ minWidth: '256px' }}>
                                {totalData.map((item, index) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1px' }} key={index}>
                                        <Text style={item.label === 'Total' ? styles.textBold : {}}>{item.label}</Text>
                                        <Text style={item.label === 'Total' ? styles.textBold : {}}>
                                            {item.value.toLocaleString('th-TH')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </Page>
            ))}
        </Document>
    );
};

export default TotalSummary;
