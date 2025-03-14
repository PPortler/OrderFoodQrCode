import React, { useState, useEffect } from 'react'
import NavbarOrder from '../../components/NavbarOrder'
import Icon from '@mdi/react';
import { mdiPlus, mdiCart, mdiMinus } from '@mdi/js';
import { useParams } from 'react-router-dom';
import BasketOrder from './BasketOrder';
import menu from '../../assets/menu.json'
import axios from 'axios';
import Loader from '../../components/Loader';

function OrderFood() {
  const { id } = useParams();

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
  //เรียก order ที่มัอยู่
  useEffect(() => {
    getOrder();
  }, [])

  const getOrder = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_PORT_API}/api/order/${id}`);
      setOrder(res.data);  // เก็บข้อมูลที่ได้จาก API ลงใน state


    } catch (err) {
      console.log(err)
    }

  }
  return (
    <>
      <NavbarOrder table={id} setBasketOpen={setBasketOpen} />
      {basketOpen ? (
        <BasketOrder setBasketOpen={setBasketOpen} basket={basket} setBasket={setBasket} table={id} order={order} getOrder={getOrder} setLoader={setLoader}/>
      ) : (
        <>
          <div>
            <img src="/poster.jpg" alt="porter" className='w-full h-56' />
          </div>
          <div className='bg-white relative bottom-10 rounded-tr-2xl rounded-tl-2xl '>
            <div className='flex justify-center flex-col items-center relative bottom-14'>
              <div className='bg-white rounded-full p-2  '>
                <img src="/logo.jpg" alt="porter" className='w-24 h-24 rounded-full' />
              </div>
              <p>จิ้มจุ่มลานนา มหาสารคาม</p>
            </div>

            <div className='relative bottom-14 px-3 mt-3 '>
              <h1 className='font-bold'>เมนูทั้งหมด</h1>
              <div className='mt-2 overflow-y-scroll'>
                {menu?.map((m, index) => (
                  <div className='p-3 bg-white border shadow rounded-sm flex gap-3 ' key={m._id}> {/* เพิ่ม key ที่ไม่ซ้ำกัน */}
                    <img src={m.image} alt="porter" className='w-24 h-24' />
                    <div className='flex flex-col justify-between w-full'>
                      <div>
                        <p>{m.name}</p>
                        <p>฿ {m.price}</p>
                      </div>
                      <div className='flex justify-end w-full'>
                        {basket?.menu?.some((n) => n.key === m.key) ? (
                          <div className='flex items-center gap-2'>
                            <div className='bg-[#ffcc02]' onClick={() => handleDeleteBasket(m)}>
                              <Icon path={mdiMinus} size={1} />
                            </div>
                            <p>{basket?.menu.find((n) => n.key === m.key)?.quantity}</p>
                            <div className='bg-[#ffcc02]' onClick={() => handleAddBasket(m)}>
                              <Icon path={mdiPlus} size={1} />
                            </div>
                          </div>
                        ) : (
                          <div className='bg-[#ffcc02]' onClick={() => handleAddBasket(m)}>
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
          {(basket?.menu?.length > 0) && (
            <div className='w-full bg-white p-5 shadow fixed bottom-0 cursor-pointer'>
              <div onClick={() => setBasketOpen(true)} className='w-full rounded-lg flex gap-2  justify-center items-center p-3 bg-[#ffcc02]'>
                <Icon path={mdiCart} size={1} />
                <p>{basket.menu.length} รายการในตะกร้า</p>
              </div>
            </div>
          )}
        </>
      )}
      {loader && (
        <Loader/>
      )}
    </>
  )
}

export default OrderFood
