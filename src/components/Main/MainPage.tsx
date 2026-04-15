import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {host} from '../../Constants.ts';
import { VideoCard } from './VideoCard.tsx';
import { useDispatch } from 'react-redux';
import { toggleSideBar } from '../../app/slices/toggleSlice.ts';

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

export const MainPage:React.FC = () => {

  const dispatch = useDispatch()

  const [videos,setVideos] = useState<GetVideosResponse|null>()
  const [error,setError] = useState('')

  useEffect(()=>{
    fetchHomeVideos();
    dispatch(toggleSideBar(true))
  },[])

  async function fetchHomeVideos(){
    try{
    const req = await axios.get<GetVideosResponse>(`${host}/api/v1/videos/all/v`,{withCredentials:true,})
    if(req.status===200) setVideos(req.data)
    }catch(err){
      console.log(err)
      setError(err?.message)
    }
  }

  return (
    <div className={`relative grid`}>
      <main className='bg-[#222222] py-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6'>
        {videos&&videos.data.map((par,index)=>{
          return<VideoCard key={index} data={par}  />
        })}
      </main>
    </div>
  )
}
