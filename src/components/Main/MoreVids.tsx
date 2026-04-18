import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { VideoCard } from './VideoCard';
import { api } from '../../api/AxiosInterceptor';


interface Video {
    _id: string;
    videoFile: string;
    thumbnail: string;
    owner: {
      _id:string,
      username:string,
      avatar:string
    };
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface GetVideosResponse {
    statusCode: number;
    data: Video[];
    message: string;
    success: number;
  }

export const MoreVids = () => {
    const {videoId} = useParams()

    const [vids,setVids] = useState<GetVideosResponse|null>()
    
    useEffect(()=>{
        if (videoId?.length!==0 && videoId!==undefined) fetchMoreVids()
    },[videoId])

    const fetchMoreVids = async() =>{
        try {
            const req = await api.get<GetVideosResponse>(`/videos/v/${videoId}`)
            if(req.status===200) setVids(req.data)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='bg-[#222] grid grid-cols-1'>
        <main className='bg-[#222222] relative py-4 '>
        {vids&&vids.data.map((par,index)=>{
          return<div key={index} className='py-2'>
          <VideoCard data={par}  />
          </div>
        })}
        </main>
    </div>
  )
}
