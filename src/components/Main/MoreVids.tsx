import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { VideoCard } from './VideoCard';
import { api } from '../../api/AxiosInterceptor';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import { emptyArr } from '../../utility/emptyArrays.ts';
import VideoCard_v2_skeleton from './VideoCard_v2_skeleton.tsx';
import { useDispatch } from 'react-redux';
import { messageModal } from '../../app/slices/toggleSlice.ts';

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
    data: {
      result:Video[];
      videosCount: number,
      page: number,
      limit: number
    }
    message: string;
    success: number;
  }

export const MoreVids = () => {
    const {videoId} = useParams()
    const [page,setPage] = useState(1)
    const [hasMore,setHasmore]=useState(false)
    const [loading,setLoading] = useState<boolean>(false)
    const [vids,setVids] = useState<Video[]>([])
    const videoContainerRef = useRef(null)
    const dispatch = useDispatch()
    const pageCallback = useCallback(()=>{
      if(!loading&&hasMore){
        setPage(prev=>prev+1)
      }
  },[loading,hasMore])

  useIntersectionObserver(videoContainerRef,pageCallback)
    
    useEffect(()=>{
        if (videoId?.length!==0 && videoId!==undefined) fetchMoreVids(videoId,page)
    },[videoId,page])

    const fetchMoreVids = async(par:string,page:number) =>{
      setLoading(true)
        try {
            const req = await api.get<GetVideosResponse>(`/videos/v/${par}?page=${page}`)
            if(req.status===200) {
              const newResults = req.data.data.result;
              setVids((prev)=>{
                const existingIds = new Set(prev.map(v => v._id));
                const filtered = newResults.filter(v => !existingIds.has(v._id));
                return [...prev, ...filtered];
            })
              setLoading(false)
              setHasmore((req.data.data.limit*req.data.data.page)<req.data.data.videosCount)
            }
        } catch (error) {
            dispatch(messageModal("Encountered error while videos :("))
            setLoading(false)
        }finally{
          setLoading(false)
        }
    }

  return (
    <div className='bg-[rgba(20,20,20,0.9)] border-l border-gray-300 grid grid-cols-1'>
        <main className=' relative py-4 '>
        {vids&&vids.map((par,index)=>{
          return<div key={par._id} className='py-1'>
          <VideoCard data={par}  />
          </div>
        })}
        <div className='mx-auto py-1 w-[90%]'>
          {loading&&(emptyArr.map((par)=>{
            return<VideoCard_v2_skeleton key={par.id} />
            }))}
        </div>
        </main>
        <div ref={videoContainerRef} className='w-[100%] h-[20px]'/>
    </div>
  )
}
