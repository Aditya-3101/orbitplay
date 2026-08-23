import React,{useCallback, useRef} from 'react';
import { VideoCard } from './VideoCard.tsx';
import VideoCardSkeleton from './VideoCardSkeleton.tsx';
import {useIntersectionObserver} from '../../hooks/useIntersectionObserver.tsx';
import { emptyArr } from '../../utility/emptyArrays.ts';
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import { useHomeVideos } from '../../features/videos/videos.queries.ts';


export const MainPage = ():React.JSX.Element => {

  const {data,error,fetchNextPage,isLoading,isFetchingNextPage,hasNextPage} = useHomeVideos();

  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videos = data?.pages.flatMap((page) => page.result) ?? [];
  
  const pageCallback = useCallback(()=>{
    if(hasNextPage&&!isFetchingNextPage){
      fetchNextPage();
    }
    },[hasNextPage,isFetchingNextPage,fetchNextPage])

  useIntersectionObserver(videoContainerRef,pageCallback)  

  if(error!==null){
    return<ErrorPage msg="Videos"/>
  }

  return (
    <div className={`relative grid`}>
      <main className=' py-2 px-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4'>
        {(videos&&videos.length!==0)&&videos.map((par,index)=>{
          return<VideoCard key={par._id} data={par} index={index}  />
        })}
        {isLoading||isFetchingNextPage&&emptyArr.map((par)=>{
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
