import React from 'react'
import { Spin } from 'antd';

function Loader() {
  return (
    <div className='w-screen h-screen flex justify-center items-center absolute top-0 left-0'>
      <Spin size="large"/>
    </div>
  )
}

export default Loader
