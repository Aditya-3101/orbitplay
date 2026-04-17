import React from 'react';
import { useNavigate,Link } from 'react-router';
import { getVideoDuration } from '../../utility/videoDuration';


export const VideoCard = ({data}) => {

    const navigate = useNavigate()

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

    function navigatePlayer(){
        navigate(`/v/${_id}`)
    }

    return (
    <div className='w-[100%] md:my-4'>
        <div className='border border-gray-200 rounded w-[90%] mx-auto aspect-video cursor-pointer'>
            <div className='relative' onClick={navigatePlayer}>            
            <img src={thumbnail} className='object-cover aspect-video w-[100%]' />
            <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(duration)}</p>
            </div>
            <div className='p-1 grid grid-cols-[15%_85%] gap-2 justify-center items-center border-t border-slate-400'>
            <img src={owner?.avatar} className='rounded-full aspect-square w-[2rem] md:w-[1.9rem] object-cover mx-auto' />
                <div className='grid grid-cols-[100%] w-[100%] relative'>
                    <span className='font-poppins text-white text-lg md:text-base overflow-auto '>{title}</span>
                    <p className='flex items-center justify-between pr-2'>
                    <Link className='text-slate-400 md:text-sm' to={`/Channel/${owner.username}`}>{owner?.username}</Link>
                    <span className='text-slate-400 flex items-center justify-end'>{views} views</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}
