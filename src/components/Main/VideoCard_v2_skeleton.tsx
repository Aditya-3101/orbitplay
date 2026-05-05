import React from 'react'

const VideoCard_v2_skeleton = () => {
  return (
    <div>
        <div>
        <div className='grid grid-cols-[40%_60%] grid-rows-[6rem] md:grid-rows-[10rem] lg:grid-rows-[12rem] md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] gap-2 my-4 border border-gray-500'>
            <section className='relative flex justify-center'>
                <div className='w-[100%] h-[100%] aspect-video object-cover block animate-pulse bg-[rgba(240,240,240,0.16)]'></div>
                <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'></p>
            </section>
            <section className='flex flex-col gap-1 md:gap-2 justify-around relative w-[100%] h-[100%]'>
                <p className='text-slate-50 text-lg md:text-xl lg:text-2xl font-roboto w-[80%] h-[1rem] md:h-[1.4rem] truncate animate-pulse bg-[rgba(240,240,240,0.16)]'></p>
                <p className=' text-slate-500 text-sm font-roboto w-[80%] animate-pulse bg-[rgba(240,240,240,0.16)] h-[1rem] md:h-[1.4rem]'></p>
                <div className='flex items-center gap-2'>
                    <div className='aspect-square object-cover w-[1.2rem] md:w-[2rem] rounded-full animate-pulse bg-[rgba(240,240,240,0.16)]' ></div>
                    <p className='text-slate-500 text-sm font-roboto animate-pulse bg-[rgba(240,240,240,0.16)] h-[1rem] md:h-[1.5rem] w-[50%] md:w-[20%]'></p>
                </div>
            </section>
        </div>
    </div>
    </div>
  )
}

export default VideoCard_v2_skeleton