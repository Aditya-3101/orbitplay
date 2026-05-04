import React from 'react'
import { getVideoDuration } from '../../utility/videoDuration';
import { timeAgo } from '../../utility/timeStamp.ts';

interface videoObjectResponse {
    "_id": string,
    "videoFile": string,
    "thumbnail": string,
    "owner": {
        "_id": string,
        "username": string,
        "avatar": string,
        "fullName"?:string
    },
    "title": string,
    "description": string,
    "duration": number,
    "views": number,
    "isPublished": boolean,
    "createdAt": string,
    "updatedAt": string,
    "__v": number
}

export const VideoCard_v2 = (props) => {

    const par:videoObjectResponse = props.data

  return (
    <div>
        <div className='grid grid-cols-[40%_60%] grid-rows-[6rem] md:grid-rows-[10rem] lg:grid-rows-[12rem] md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] gap-2 my-4'>
            <section className='relative flex justify-center'>
                <img src={par?.thumbnail} className='w-[100%] h-[100%] aspect-video object-cover block' />
                <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(par.duration)}</p>
            </section>
            <section className='flex flex-col gap-1 md:gap-4 relative w-[100%] aspect-[16/9] h-[100%]'>
                <p className='text-slate-50 text-lg md:text-xl lg:text-2xl font-roboto w-[80%] truncate'>{par.title}</p>
                <p className=' text-slate-500 text-sm font-roboto w-[80%]'>{par.views} views | {timeAgo(par.createdAt)}</p>
                <div className='flex items-center gap-2'>
                    <img src={par.owner.avatar} className='aspect-square object-cover w-[1rem] md:w-[2rem] rounded-full' />
                    <p className='text-slate-500 text-sm font-roboto'>{par.owner.fullName}</p>
                </div>
            </section>
        </div>
    </div>
  )
}
