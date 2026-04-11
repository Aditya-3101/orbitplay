import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { host } from '../../Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { VideoCard } from './VideoCard';


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
    
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)

    useEffect(()=>{
        if (videoId?.length!==0 && videoId!==undefined) fetchMoreVids()
    },[videoId])

    const fetchMoreVids = async() =>{
        try {
            const req = await axios.get<GetVideosResponse>(`${host}/api/v1/videos/v/${videoId}`,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(req.status===200) setVids(req.data)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='bg-[#222] grid grid-cols-1'>
        <main className='bg-[#222222] relative py-4 '>
        {vids&&vids.data.map((par,index)=>{
          return<VideoCard key={index} data={par}  />
        })}
        </main>
    </div>
  )
}
