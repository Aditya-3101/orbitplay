import React,{memo} from 'react';
import { Link } from 'react-router';
import { getVideoDuration } from '../../utility/videoDuration';
import {convertImageExtension} from '../../utility/covertImageFormat.ts'

interface videoCardProps{
    data:{
        _id: string;
        videoFile: string;
        thumbnail: string;
        owner: {
          _id:string,
          username:string,
          avatar:string,
          fullName?:string
        };
        title: string;
        description: string;
        duration: number;
        views: number;
        isPublished: boolean;
        createdAt: string;
        updatedAt: string;
    },
    index:number
}


export const VideoCard = memo(({data,index}:videoCardProps):React.JSX.Element => {

    const {createdAt,
        description,
        isPublished,
        owner,
        thumbnail,
        title,
        updatedAt,
        videoFile,
        views,
        duration,
        _id,} = data

    return (
    <div className='w-full md:my-0'>
        <div className='bg-[rgb(20,20,20)] border-gray-500 w-[96%] mx-auto aspect-video cursor-pointer'>
            <Link className='relative' to={`/v/${_id}`}>            
            <img src={convertImageExtension(thumbnail,640)} 
            className='object-cover aspect-video w-full' 
            loading={index<6?'eager':'lazy'} 
            fetchPriority={index ===0 ? "high" : "auto"} 
            srcSet={`
                ${convertImageExtension(thumbnail, 320)} 320w,
                ${convertImageExtension(thumbnail, 480)} 480w,
                ${convertImageExtension(thumbnail, 640)} 640w,
                ${convertImageExtension(thumbnail, 960)} 960w
                `}
              sizes="(max-width: 767px) 96vw,
              (max-width: 1279px) 31vw,
              24vw"
            alt={title} />
            <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(duration)}</p>
            </Link>
            <div className='px-2 py-1 grid grid-cols-[15%_85%] gap-2 justify-center items-center border-slate-500'>
                <Link to={`/Channel/${owner.username}`}>
            <img src={convertImageExtension(owner?.avatar,60)} loading='lazy' alt={owner.username} className='rounded-full aspect-square w-[2rem] md:w-[1.9rem] object-cover mx-auto' />
            </Link>
                <div className='grid grid-cols-[100%] w-full relative'>
                    <Link to={`/v/${_id}`}>
                    <span className='font-roboto text-white text-lg md:text-base truncate overflow-hidden wrap-break-word line-clamp-1 md:line-clamp-2'>{title}</span>
                    </Link>
                    <p className='flex items-center justify-between pr-2'>
                    <Link className='text-slate-400 md:text-sm tracking-wider' to={`/Channel/${owner.username}`}>{owner?.fullName}</Link>
                    <span className='text-slate-400 text-xs md:text-sm flex items-center justify-end'>{views} views</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
})
