import React from 'react'
import { emptyArr } from '../../utility/emptyArrays'
import VideoCard_v2_skeleton from './VideoCard_v2_skeleton'

export const Player_Skeleton = () => {

  return (
    <div className='grid grid-cols-1 md:grid-cols-[70%_30%] relative px-2'>
        <section>
        <div className='aspect-video bg-[rgb(20,20,20)]'>
            <div className='animate-pulse aspect-video w-[100%] bg-[#222222]'></div>
        <p className='p-2 flex justify-between flex-col gap-2'>
            <span className='font-poppins text-xl text-slate-200 animate-pulse bg-[rgba(240,240,240,0.4)] h-[2rem] w-full'></span>
            <span className='text-slate-200 animate-pulse bg-[rgba(240,240,240,0.4)] h-[1.4rem] w-2/3'></span>
        </p>
        {/* {(uploadedDate!==undefined&&uploadedDate!==null)&&<VideoMenu uploadTime={uploadedDate}/>} */}
        <div className='flex justify-between items-center p-4 border-t border-[rgba(255,255,255,0.2)]'>
            <div className='flex items-center gap-3'>
                <div className='aspect-square w-[2rem] rounded-full object-cover animate-pulse bg-[rgba(240,240,240,0.4)]' />
                <p className='flex flex-col'>
                    <span className='text-slate-300 text-base md:text-lg font-poppins animate-pulse bg-[rgba(240,240,240,0.4)]h-[1rem]'></span>
                    <span className='text-[#AAAAAA] text-[12px]'></span>
                </p>
            </div>
            <div className='text-slate-500 flex items-center justify-center w-full animate-pulse bg-[rgba(240,240,240,0.4)] h-[2.4rem]'>
            </div>
        </div>
        <div className='w-full h-[4rem] animate-pulse bg-[rgba(240,240,240,0.4)]'>
        </div>
        </div>
        </section>
        <div className='relative'>
        {emptyArr.map((par)=>{
            return<VideoCard_v2_skeleton key={par.id} />
            })}
        </div>
    </div>
  )
}
