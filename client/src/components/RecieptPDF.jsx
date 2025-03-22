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
        margin: "20px 0",
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


const RecieptPDF = ({ order }) => {
    const tableData = order.menu.map(item => ({
        description: item.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        total: parseFloat(item.price) * item.quantity,
    }));

    const totalData = [
        {
            label: "รวมทั้งสิ้น",
            value: `${order.totalPrice} บาท`,
        },
        {
            label: "รับมา",
            value: `${order.getMoney || 0} บาท`,
        },
        {
            label: "เงินทอน",
            value: `${order.changeMoney || 0} บาท`,
        },
    ];

    const formatDateTimeThai = (isoDate) => {
        const date = new Date(isoDate);
        const thaiMonths = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // เพิ่ม 543 เพื่อแปลงเป็นปี พ.ศ.

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day} ${month} ${year} เวลา ${hours}:${minutes}:${seconds}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, styles.textBold]}>ใบเสร็จค่าอาหาร</Text>
                        <Text>เลขที่ใบเสร็จ: {order._id}</Text>
                        <Text>วันที่: {formatDateTimeThai(order.updatedAt)}</Text>
                        <Text>เลขโต๊ะ: {order.table}</Text>
                    </View>
                    <View style={styles.spaceY}>
                        <Text style={styles.textBold}>จิ้มจุ้มลานนา มหาสารคาม</Text>
                        <Text>147 ม.2 มหาสารคาม, ตำบลลานสะแก</Text>
                        <Text> อำเภอเมือง 44110</Text>
                    </View>
                </View>
                {/* Render the table */}
                <Table style={styles.table}>
                    <TH style={[styles.tableHeader, styles.textBold]}>
                        <TD style={styles.td}>ชื่อรายการ</TD>
                        <TD style={styles.td}>จำนวน</TD>
                        <TD style={styles.td}>ราคา</TD>
                        <TD style={styles.td}>ยอดรวม</TD>
                    </TH>
                    {(tableData || []).map((item, index) => (
                        <TR key={index}>
                            <TD style={styles.td}>{item.description}</TD>
                            <TD style={styles.td}>{item.quantity}</TD>
                            <TD style={styles.td}>฿{item.unitPrice.toFixed(2)}</TD>
                            <TD style={styles.td}>฿{item.total.toFixed(2)}</TD>
                        </TR>
                    ))}
                </Table>
                <View style={styles.totals}>
                    <View
                        style={{
                            minWidth: "256px",
                        }}
                    >
                        {totalData.map((item, index) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: "1px",
                                }}
                                key={index}
                            >
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.label}
                                </Text>
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default RecieptPDF;
