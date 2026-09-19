import React,{memo} from 'react';
import { Link } from 'react-router';
import { getVideoDuration } from '../../utility/videoDuration';
import {convertImageExtension} from '../../utility/covertImageFormat.ts'
import { timeAgo } from '../../utility/timeStamp.ts';

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
    <div className='w-full h-full md:my-0'>
        <div className='bg-[rgb(20,20,20)] border-gray-500 w-[96%] h-full mx-auto cursor-pointer'>
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
            <div className='px-2 py-1 grid grid-cols-[16%_84%] gap-2 justify-center items-center border-red-500'>
            <Link to={`/Channel/${owner.username}`}>
            <img src={convertImageExtension(owner?.avatar,60)} loading='lazy' alt={owner.username} className='rounded-full aspect-square w-4/5 md:w-4/5 object-cover mx-auto' />
            </Link>
                <div className='grid grid-cols-[100%] w-full relative'>
                    <Link to={`/v/${_id}`}>
                    <span className="font-roboto text-white text-lg md:text-base leading-6 md:leading-5 line-clamp-2 h-12 md:h-10 overflow-hidden flex items-center">{title}</span>
                    </Link>
                    <p className='flex flex-col pr-1'>
                    <Link className='text-slate-400 md:text-sm tracking-wide' to={`/Channel/${owner.username}`}>{owner?.fullName}</Link>
                    <span className='text-slate-400 text-sm md:text-sm flex items-center '>{views} views • {timeAgo(createdAt)}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
})
