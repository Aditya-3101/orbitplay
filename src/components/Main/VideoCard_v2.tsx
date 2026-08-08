import React, { memo, useState } from 'react'
import { getVideoDuration } from '../../utility/videoDuration';
import { timeAgo } from '../../utility/timeStamp.ts';
import { EllipsisVertical, Eye, EyeClosed, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import { useNavigate } from 'react-router';
import type { VideoType } from "../../types/video.ts";

interface VideoCardProps {
    data: VideoType;

    onDelete?: (
        e: React.MouseEvent,
        arg: string
    ) => void | Promise<void>;

    onTogglePublish?: (
        e: React.MouseEvent<HTMLButtonElement>,
        video: VideoType
    ) => void | Promise<void>;

    index: number;
}


export const VideoCard_v2 = memo(({data:par,onDelete,onTogglePublish,index}:VideoCardProps):React.JSX.Element => {
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const navigate = useNavigate()
    const [options,setOptions]=useState<boolean>(false)
    const userLocation = window.location.pathname==="/history" ? "invalid": window.location.pathname==="/Liked-videos"?"invalid":"valid"

    function toggleOptions(e: React.MouseEvent):void{
        e.preventDefault()
        e.stopPropagation()
        setOptions(!options)
    }

    function navigateToChannel(e:React.SyntheticEvent,arg:string):void{
        e.preventDefault();
        navigate(`/channel/${arg}`)
    }

  return (
    <div>
        <div className='grid grid-cols-[40%_60%] grid-rows-[6rem] md:grid-rows-[10rem] lg:grid-rows-[12rem] md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] xl:grid-cols-[30%_70%] gap-4 my-4 relative'>
            <section className='relative flex justify-center'>
                <img src={par?.thumbnail} className='w-full h-full aspect-video object-cover block' loading={index<5?'eager':'lazy'} alt={par.title} />
                <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(par.duration)}</p>
            </section>
            <section className='grid grid-rows-[25%_75%] md:grid-rows-[40%_60%] relative min-w-0 w-full aspect-[16/9] h-full overflow-hidden'>
                <div className='text-slate-50 font-roboto w-full flex justify-between items-start'>
                    <p className='text-base md:text-xl lg:text-2xl line-clamp-1 overflow-hidden max-w-4/5'>{par.title}</p>
                    {((userLocation==="valid")&&(user?._id===par.owner._id))&&<div className='block relative max-w-[50%]'>
                    <button 
                    type="button"
                    onClick={toggleOptions} 
                    className="relative"
                    >
                        <EllipsisVertical color="rgba(240,240,240)" className='cursor-pointer w-4 h-4 lg:w-5 lg:h-5 z-10'/></button>
                        {options===true&&
                        <section className='absolute top-[110%] right-full border border-gray-600 flex flex-col items-start px-1 z-20'>
                        <button className='flex items-center gap-2 border-b border-gray-400 p-1' role="button" onClick={(e)=>onTogglePublish?.(e,par)}>
                            {!par.isPublished?<Eye className='w-3 lg:w-4 h-[12x] lg:h-4 ' />:<EyeClosed className='w-3 lg:w-4 h-[12x] lg:h-4 ' />}
                            {par.isPublished?"Private":"Public"}</button>
                        <p onClick={(e)=>onDelete?.(e,par._id)} className='flex items-center gap-1 p-1'>
                            <Trash className='w-3 h-3 lg:w-4 lg:h-4' />Delete</p>
                        </section>}
                    </div>}
                    </div>
                    <div className='flex flex-col justify-between py-2'>   
                <p className=' text-slate-400 text-xs md:text-sm font-roboto w-[80%] truncate'>{par.description}</p>
                <p className=' text-slate-400 text-xs md:text-sm font-roboto w-[80%] '>{par.views} views | {timeAgo(par.createdAt)}</p>
                <div className='flex items-center gap-2'>
                    <div onClick={(e)=>navigateToChannel(e,par.owner.username)}><img src={par.owner.avatar} className='aspect-square object-cover w-[1rem] md:w-[2rem] rounded-full' /></div>
                    <div onClick={(e)=>navigateToChannel(e,par.owner.username)} className='text-slate-500 text-xs md:text-sm font-roboto'>{par.owner.fullName}</div>
                </div>
                </div>
            </section>
        </div>
    </div>
  )
})


