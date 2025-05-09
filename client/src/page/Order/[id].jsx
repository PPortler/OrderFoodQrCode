import React, { useState, useEffect } from 'react'
import NavbarOrder from '../../components/NavbarOrder'
import Icon from '@mdi/react';
import { mdiPlus, mdiCart, mdiMinus } from '@mdi/js';
import { useParams, useNavigate } from 'react-router-dom';
import BasketOrder from './BasketOrder';
import menu from '../../assets/menu.json'
import axios from 'axios';
import Loader from '../../components/Loader';
import { Tabs } from 'antd';
import tableData from '../../assets/table.js'

function OrderFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่า id มีอยู่ใน tableData หรือไม่
    const isValidTable = tableData.some(table => table.tableName === id);

    if (!isValidTable) {
      navigate("/notfound"); // เปลี่ยนเส้นทางไป NotFound ถ้า id ไม่ถูกต้อง
    }
  }, [id, navigate]);

  //เรียก order ที่มัอยู่
  useEffect(() => {
    getOrder();
    getHistoryOrder();
  }, [])

  //loader 
  const [loader, setLoader] = useState(false);

  //ตะกร้ารายการ
  const [basket, setBasket] = useState([]);
  const [basketOpen, setBasketOpen] = useState(false)

  //เพิ่มรายการอาหาร
  const handleAddBasket = (menu) => {
    setBasket((prevBasket) => {
      // ตรวจสอบว่า prevBasket.menu เป็น array หรือไม่ ถ้าไม่ใช่ ให้เป็น array ว่าง
      const menuList = Array.isArray(prevBasket.menu) ? prevBasket.menu : [];

      // ตรวจสอบว่ามีเมนูนี้ใน basket หรือไม่
      const existingMenuIndex = menuList.findIndex(item => item.key === menu.key);

      // ถ้ามีเมนูนี้อยู่แล้ว ให้เพิ่ม quantity ขึ้น 1
      if (existingMenuIndex !== -1) {
        // ใช้ spread operator เพื่อสร้าง array ใหม่และเพิ่ม quantity ขึ้น 1
        const updatedMenu = menuList.map((item, index) => {
          if (index === existingMenuIndex) {
            return { ...item, quantity: item.quantity + 1 }; // เพิ่ม quantity
          }
          return item; // เก็บรายการอื่นๆ ไว้เหมือนเดิม
        });

        return {
          ...prevBasket,
          menu: updatedMenu, // อัพเดท menu ที่มีการเพิ่ม quantity
        };
      }

      // ถ้ายังไม่มีเมนูนี้ใน basket ให้เพิ่มเมนูใหม่ด้วย quantity = 1 และ status = "waiting"
      return {
        ...prevBasket,
        menu: [
          ...menuList, // เก็บรายการเก่าไว้
          { ...menu, quantity: 1, status: "waiting" } // เพิ่มเมนูใหม่พร้อม status
        ]
      };
    });
  };

  // ฟังก์ชันลบรายการอาหาร
  const handleDeleteBasket = (menu) => {
    setBasket((prevBasket) => {
      // ตรวจสอบว่า prevBasket.menu เป็น array หรือไม่ ถ้าไม่ใช่ ให้เป็น array ว่าง
      const menuList = Array.isArray(prevBasket.menu) ? prevBasket.menu : [];

      // ตรวจสอบว่ามีเมนูนี้ใน basket หรือไม่
      const existingMenuIndex = menuList.findIndex(item => item.key === menu.key);

      // ถ้ามีเมนูนี้อยู่แล้ว ให้ลด quantity ลง 1
      if (existingMenuIndex !== -1) {
        const updatedMenu = menuList.map((item, index) => {
          if (index === existingMenuIndex) {
            if (item.quantity > 1) {
              // ถ้า quantity > 1 ให้ลดลง 1
              return { ...item, quantity: item.quantity - 1 };
            } else {
              // ถ้า quantity เหลือ 1 ให้ลบเมนูออกจาก basket
              return null;
            }
          }
          return item;
        }).filter(item => item !== null); // ลบรายการที่เป็น null (กรณีลบเมนูที่ quantity เหลือ 1)

        return {
          ...prevBasket,
          menu: updatedMenu, // อัพเดท menu หลังจากลด quantity หรือ ลบรายการ
        };
      }

      return prevBasket; // ถ้าไม่มีเมนูใน basket ไม่ต้องทำอะไร
    });
  };

  const [order, setOrder] = useState([])

  const getOrder = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order/${id}`);
      setOrder(res.data);  // เก็บข้อมูลที่ได้จาก API ลงใน state


    } catch (err) {
      console.log(err)
    }

  }

  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด'); // สถานะเก็บประเภทที่เลือก

  const handleChange = (value) => {
    setSelectedCategory(value); // ตั้งค่าสถานะประเภทที่เลือก
  };

  // กรองเมนูตามประเภทที่เลือก
  const filteredMenu =
    selectedCategory === 'ทั้งหมด'
      ? menu
      : menu?.filter((m) => m.type === selectedCategory);

  //ประเภทอาหาร
  const categories = ['ทั้งหมด', 'แนะนำ', 'ตำ', 'ผัด', 'ทอด', 'ยำ', 'ลาบ', 'ต้ม', 'จิ้มจุ่ม', 'ย่าง', 'กับแกล้ม', 'เครื่องดื่ม'];

  //เรียก order ที่มีอยู่
  const [historyOrder, setHistoryOrder] = useState([])

  const getHistoryOrder = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order-history`);
      // เรียงข้อมูลตามวันที่จากล่าสุดไปหาน้อยสุด
      const sortedOrders = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setHistoryOrder(sortedOrders);  // เก็บข้อมูลที่ได้จาก API ลงใน state
      setTimeout(() => {
        setLoader(false); // เปลี่ยนสถานะการโหลด
      }, 500); // หน่วงเวลา 500 มิลลิวินาที
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  }

  const [filteredOrders, setFilteredOrders] = useState([])
  useEffect(() => {
    // หาวันที่ 7 วันก่อนจากวันนี้
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // คัดกรองออเดอร์จาก historyOrder ที่อยู่ในช่วง 7 วันล่าสุด
    const filteredOrders = historyOrder.filter(order => {
      const orderDate = new Date(order?.updatedAt);  // แปลง string เป็น Date

      // เช็คว่าออเดอร์นี้อยู่ในช่วง 7 วันล่าสุด และตรงปีและเดือนที่เลือก
      return orderDate >= sevenDaysAgo;
    });

    setFilteredOrders(filteredOrders);

  }, [historyOrder]);

  // ฟังก์ชันกำหนดเมนูขายดีแต่ละสัปดาห์
  const [sellingWell, setSellingWell] = useState([])

  useEffect(() => {
    // วนลูปผ่านทุกออเดอร์ใน filteredOrders
    const allMenus = [];

    filteredOrders.forEach(order => {
      if (order.status !== "รายการถูกยกเลิก") {
        // วนลูปผ่าน menu ของแต่ละออเดอร์
        order.menu.forEach(menuItem => {
          allMenus.push(menuItem);  // รวมเมนูทั้งหมดเข้ามา
        });
      }
    });

    // นับจำนวนการขายของแต่ละเมนู
    const menuCount = allMenus.reduce((acc, menuItem) => {
      const existingMenu = acc.find(item => item.key === menuItem.key);

      if (existingMenu) {
        existingMenu.quantity += menuItem.quantity;  // เพิ่มจำนวนการสั่งซื้อ
      } else {
        acc.push({
          ...menuItem,
          quantity: menuItem.quantity,  // สร้างข้อมูลใหม่ถ้าเมนูยังไม่มี
        });
      }
      return acc;
    }, []);

    // เรียงเมนูตามจำนวนการขาย (ขายดีที่มีจำนวนมากที่สุด)
    const sortedMenus = menuCount.sort((a, b) => b.quantity - a.quantity);

    // เก็บ 5 อันดับเมนูที่ขายดีที่สุด
    const topSellingMenus = sortedMenus.slice(0, 5); // หรือปรับจำนวนตามต้องการ

    // กำหนดค่าให้ sellingWell
    setSellingWell(topSellingMenus);

  }, [filteredOrders]);


  console.log(filteredOrders)
  console.log("sellingWell: ", sellingWell)
  return (
    <>
      <NavbarOrder table={id} setBasketOpen={setBasketOpen} orderCount={order?.menu?.length} />
      {basketOpen ? (
        <BasketOrder setBasketOpen={setBasketOpen} basket={basket} setBasket={setBasket} table={id} order={order} getOrder={getOrder} setLoader={setLoader} />
      ) : (
        <div>
          <div>
            <img src="/poster.jpg" alt="porter" className='w-full h-56 md:h-96' />
          </div>
          <div className='bg-white relative bottom-10 rounded-tr-2xl rounded-tl-2xl pt-16'>
            <div className='flex justify-center flex-col items-center absolute top-[-57px] w-full'>
              <div className='bg-white rounded-full p-2  '>
                <img src="/logo.jpg" alt="porter" className='w-24 h-24 rounded-full' />
              </div>
            </div>
            <div className='flex justify-center'>
              <p>จิ้มจุ่มลานนา มหาสารคาม</p>
            </div>
            <div className='relative  px-3 lg:px-16 mt-3 '>
              <Tabs
                defaultActiveKey="ทั้งหมด"
                centered
                onChange={handleChange}
                items={categories.map((category) => ({
                  label: `เมนู${category}`,
                  key: category,
                  children: (
                    <div className="">
                      {sellingWell?.length > 0 && category === "ทั้งหมด" && (
                        <div>
                          <p className='mb-4 text-lg'>เมนูขายดี ประจำสัปดาห์</p>
                          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 '> 
                            {sellingWell.map((m) => (
                              <div className="p-3 bg-white border shadow rounded-sm flex gap-3" key={m.key}>
                                <img src={m.image} alt="menu" className="min-w-24 w-24 h-24" />
                                <div className="flex flex-col justify-between w-full">
                                  <div>
                                    <p>{m.name}</p>
                                    <p>฿ {m.price}</p>
                                  </div>
                                  <div className="flex justify-between w-full items-end">
                                    <div className='text-gray-400 text-xs'>
                                      ขายแล้ว {m.quantity}
                                    </div>
                                    <div>
                                      {basket?.menu?.some((n) => n.key === m.key) ? (
                                        <div className="flex items-center gap-2">
                                          <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleDeleteBasket(m)}>
                                            <Icon path={mdiMinus} size={1} />
                                          </div>
                                          <p>{basket?.menu.find((n) => n.key === m.key)?.quantity}</p>
                                          <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleAddBasket(m)}>
                                            <Icon path={mdiPlus} size={1} />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleAddBasket(m)}>
                                          <Icon path={mdiPlus} size={1} />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* เมนูตามประเภท */}
                      <div>
                        <p className='my-4 text-lg'>เมนู{category}</p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                          {menu
                            .filter((m) => selectedCategory === 'ทั้งหมด' || m.type === selectedCategory) // กรองเมนูตามประเภท
                            .map((m) => (
                              <div className="p-3 bg-white border shadow rounded-sm flex gap-3" key={m._id}>
                                <img src={m.image} alt="menu" className="min-w-24 w-24 h-24" />
                                <div className="flex flex-col justify-between w-full">
                                  <div>
                                    <p>{m.name}</p>
                                    <p>฿ {m.price}</p>
                                  </div>
                                  <div className="flex justify-end w-full">
                                    {basket?.menu?.some((n) => n.key === m.key) ? (
                                      <div className="flex items-center gap-2">
                                        <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleDeleteBasket(m)}>
                                          <Icon path={mdiMinus} size={1} />
                                        </div>
                                        <p>{basket?.menu.find((n) => n.key === m.key)?.quantity}</p>
                                        <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleAddBasket(m)}>
                                          <Icon path={mdiPlus} size={1} />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-[#ffcc02] cursor-pointer" onClick={() => handleAddBasket(m)}>
                                        <Icon path={mdiPlus} size={1} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ),
                }))}
              />

            </div>
          </div>
          {(basket?.menu?.length > 0) && (
            <div className='w-full bg-white p-5 shadow sticky bottom-0 cursor-pointer'>
              <div onClick={() => setBasketOpen(true)} className='w-full rounded-lg flex gap-2  justify-center items-center p-3 bg-[#ffcc02] cursor-pointer'>
                <Icon path={mdiCart} size={1} />
                <p>{basket.menu.length} รายการในตะกร้า</p>
              </div>
            </div>
          )}
        </div>
      )}
      {loader && (
        <Loader />
      )}
    </>
  )
}

export default OrderFood
