import React,{memo} from 'react';
import { Link } from 'react-router';
import { getVideoDuration } from '../../utility/videoDuration';

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
            <img src={thumbnail} className='object-cover aspect-video w-full' loading={index<4?'eager':'lazy'} alt={title} />
            <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(duration)}</p>
            </Link>
            <div className='px-2 py-1 grid grid-cols-[15%_85%] gap-2 justify-center items-center border-slate-500'>
            <img src={owner?.avatar} loading='lazy' alt={owner.username} className='rounded-full aspect-square w-[2rem] md:w-[1.9rem] object-cover mx-auto' />
                <div className='grid grid-cols-[100%] w-full relative'>
                    <span className='font-roboto text-white text-lg md:text-base truncate'>{title}</span>
                    <p className='flex items-center justify-between pr-2'>
                    <Link className='text-slate-400 md:text-sm' to={`/Channel/${owner.username}`}>{owner?.fullName}</Link>
                    <span className='text-slate-400 text-xs md:text-sm flex items-center justify-end'>{views} views</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
})
