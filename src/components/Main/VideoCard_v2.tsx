import React from 'react'
import { getVideoDuration } from '../../utility/videoDuration';
import {format} from 'date-fns'

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
    function getUploadeDate(param:string){
        return format(new Date(param),"dd MMMM yyyy")
    }

  return (
    <div>
        <div className='grid grid-cols-[40%_60%] md:w-[45%_55%] gap-4 my-4'>
            <section className='aspect-[16/9] relative'>
                <img src={par?.thumbnail} className='w-[100%] aspect-video object-cover' />
                <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(par.duration)}</p>
            </section>
            <section className='flex flex-col gap-2'>
                <p className='text-slate-50 text-xl font-roboto'>{par.title}</p>
                <p className='truncate text-slate-500 text-sm font-roboto'>{par.views} views | Uploaded on {getUploadeDate(par.createdAt)}</p>
                <div className='flex items-center gap-2'>
                    <img src={par.owner.avatar} className='aspect-square object-cover w-[2rem] rounded-full' />
                    <p className='text-slate-500 text-sm font-roboto'>{par.owner.fullName}</p>
                </div>
            </section>
        </div>
    </div>
  )
}
