import React,{useEffect, useState} from 'react';
import { VideoCard } from './VideoCard.tsx';
import { useDispatch } from 'react-redux';
import { toggleSideBar } from '../../app/slices/toggleSlice.ts';
import VideoCardSkeleton from './VideoCardSkeleton.tsx';
import { api } from '../../api/AxiosInterceptor.ts';

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
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    fetchHomeVideos();
    dispatch(toggleSideBar(true))
  },[])

  async function fetchHomeVideos(){
    setLoading(true)
    try{
    const req = await api.get<GetVideosResponse>(`/videos/all/v`)
    if(req.status===200) {
      setVideos(req.data)
      setLoading(false)
    }
    }catch(err){
      setError(err?.message)
      setLoading(false)
    }
  }

  return (
    <div className={`relative grid`}>
      <main className='bg-[#222222] py-2 px-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6'>
        {(!loading&&videos)&&videos.data.map((par,index)=>{
          return<VideoCard key={index} data={par}  />
        })}
        {loading&&[...Array(12)].map((index)=>{
          return<VideoCardSkeleton key={index}/>
        })
        }
      </main>
    </div>
  )
}
