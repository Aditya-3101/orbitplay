import React from 'react'

const VideoCardSkeleton = ():React.JSX.Element => {
  return (
    <div className=''>
      <div className='flex flex-col border border-gray-500 aspect-video'>
        <div className='aspect-video animate-pulse bg-[rgba(0,0,0,0.8)]'></div>
        <div className='w-full p-2 flex flex-col gap-2'>
          <p className='h-[1.5rem] rounded-lg w-[100%] flex flex-row justify-between'>
            <span className='w-[10%] aspect-square rounded-full bg-[rgba(0,0,0,0.8)] animate-pulse block'>

            </span>
            <span className='w-[85%] rounded-lg bg-[rgba(0,0,0,0.8)] animate-pulse block'>

            </span>
          </p>
          <p className='bg-[rgba(0,0,0,0.8)] animate-pulse h-[1.5rem] rounded-lg w-[100%]'></p>
        </div>
      </div>
    </div>
  )
}

export default VideoCardSkeleton