import React from 'react'
import { assets } from '../assets/assets/assets'

const AppDownload = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto my-20 '>
      <div className='relative bg-gradient-to-tr from-[#F5F7FF] to-[#E8E9FF] rounded-lg p-8 lg:w-1/2'>
        <div>
            <h1 className='text-2xl sm-text-4xl font-bold mb-8 max-w-md'>Download Mobile App For Better Experience</h1>
            <div className='flex gap-4 mb-8'>
                <a href="#" className='inline-block'>
                    <img  className='h-12' src={assets.play_store} alt="" />
                </a>
                 <a href="#" className='inline-block'>
                    <img className='h-12' src={assets.app_store} alt="" />
                </a>
            </div>
        </div>
        <img className='absolute w-50 right-0 bottom-0 mr-32 max-lg:hidden 'src={assets.app_main_img} alt="" />
      </div>
    </div>
  ) 
}

export default AppDownload
