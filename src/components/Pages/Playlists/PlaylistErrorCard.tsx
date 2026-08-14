import { VideoOff } from 'lucide-react'
import {memo} from 'react'

export const PlaylistErrorCard = memo(({playlistVideosLength,playlistVidsLength}:{
    playlistVideosLength:number,
    playlistVidsLength:number
}) => {

    const diff = Math.max(0, playlistVideosLength - playlistVidsLength);
    const playlistDiff:undefined[] = [...Array(diff)]

  return (
    <div>
        {playlistDiff.length>0&&playlistDiff.map((_,index)=>{
            return<div key={index} className='grid grid-cols-[40%_60%] grid-rows-[7rem] md:grid-rows-[10rem] lg:grid-rows-[12rem] md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] gap-2 my-4 border border-gray-500'>
            <section className='relative flex justify-center'>
                <div className='w-full h-full aspect-video object-cover bg-[rgba(240,240,240,0.1)] flex items-center justify-center'>
                    <VideoOff color='rgb(140,140,140)' size={56} />
                </div>
                <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'></p>
            </section>
            <section className='flex flex-col md:gap-2 relative w-full h-full'>
                <p className='text-lg md:text-xl lg:text-2xl mt-4 font-roboto w-[80%] truncate text-[rgba(240,240,240,0.86)]'>
                    Deleted Video 
                </p>
            </section>
        </div>
        })}
    </div>
  )
})
