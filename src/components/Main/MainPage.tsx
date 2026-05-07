import React,{useCallback, useEffect, useRef, useState} from 'react';
import { VideoCard } from './VideoCard.tsx';
import { useDispatch } from 'react-redux';
import { messageModal, toggleSideBar } from '../../app/slices/toggleSlice.ts';
import VideoCardSkeleton from './VideoCardSkeleton.tsx';
import { api } from '../../api/AxiosInterceptor.ts';
import {useIntersectionObserver} from '../../hooks/useIntersectionObserver.tsx';
import { AppDispatch } from '../../app/store/store.ts';
import { emptyArr } from '../../utility/emptyArrays.ts';
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import { Link } from 'react-router';

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

interface videoDataType{
  result:Video[],
  videosCount: number,
  page: number,
  limit: number
}

interface GetVideosResponse {
  statusCode: number;
  data: videoDataType;
  message: string;
  success: number;
}

export const MainPage = ():React.JSX.Element => {

  const dispatch = useDispatch<AppDispatch>()
  const [videos,setVideos] = useState<Video[]>([])
  const [loading,setLoading] = useState<boolean>(false)
  const [page,setPage] = useState<number>(1)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [hasMore,setHasmore]=useState<boolean>(false)
  const [error,setError] = useState<string|null>(null)
  
  const pageCallback = useCallback(()=>{
    if(!loading&&hasMore){
      setPage(prev=>prev+1)
    }
    },[loading,hasMore])

  useIntersectionObserver(videoContainerRef,pageCallback)

  useEffect(()=>{
    fetchHomeVideos(page);
    dispatch(toggleSideBar(true))
  },[page])


  async function fetchHomeVideos(par:number):Promise<void>{
    setLoading(true)
    
    try{
    const req = await api.get<GetVideosResponse>(`/videos/all/v?page=${par}`)
    if(req.status===200) {
      const newVideos = req.data.data.result
      setVideos((prev)=>{
        const existingIds = new Set(prev.map(v => v._id));

        const filtered = newVideos.filter(v => !existingIds.has(v._id));
      
        return [...prev, ...filtered];
      });
      setError(null)
      setLoading(false)
      setHasmore((req.data.data.limit*req.data.data.page)<req.data.data.videosCount)
    }
    }catch(err){
      setError(err?.message)
      dispatch(messageModal("Encountered error while fetching videos :("))
    }finally {
      setLoading(false);
    }
  }  

  if(error!==null){
    return<ErrorPage msg="Videos"/>
  }

  return (
    <div className={`relative grid`}>
      <main className=' py-2 px-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6'>
        {(videos&&videos.length!==0)&&videos.map((par,index)=>{
          return<VideoCard key={par._id} data={par}  />
        })}
        {loading&&emptyArr.map((par)=>{
          return<VideoCardSkeleton key={par.id}/>
        })
        }
      </main>
      <div
      ref={videoContainerRef}
      style={{ height: "20px" }}
      />
    </div>
  )
}
