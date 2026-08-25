import React,{useState,useEffect, useCallback, useRef, useMemo} from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton.tsx';
import { emptyArr } from '../../utility/emptyArrays.ts';
import { ErrorPage } from './ErrorPage.tsx';
import { Link } from 'react-router';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import {useSubscribedChannels, useVideosfromSubscribedChannels} from '../../features/subscriptions/subscriptions.queries.ts'


interface userSubscriptionsInterface{
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
}


const Subscriptions = ():React.JSX.Element => {

    const {userTemp} = useSelector((state:RootState)=>state.user)
    const [defaultChannel,setDefaultChannel] = useState<string>('')
    const videoContainerRef = useRef<HTMLDivElement>(null)

    const {data:followedChannels,isLoading:loadingFollowedChannels,error:errorFromFollowedChannels} = useSubscribedChannels(userTemp?._id)

    const {data:videosFromFollowedChannels,hasNextPage,isFetchingNextPage:fetchingMoreVideos,fetchNextPage,isLoading:loadingFollowedVideos,error:errorFromFollowedVideos} = useVideosfromSubscribedChannels(defaultChannel)

    const pageCallback = useCallback(()=>{
        if(hasNextPage&&!fetchingMoreVideos){
            fetchNextPage();
        }
    },[hasNextPage,fetchingMoreVideos,fetchNextPage])

    useIntersectionObserver(videoContainerRef,pageCallback)

    const userSubscriptions: userSubscriptionsInterface[] = useMemo(()=> followedChannels?.flatMap((page)=>page.subscribedTo)?? [],[followedChannels])

    const firstChannel = userSubscriptions[0]?._id

    const videosFromChannel = videosFromFollowedChannels?.pages.flatMap(
        page => page.allVideos
    ) ?? [];    

    useEffect(()=>{
        if(firstChannel.length>0&&!defaultChannel){
            setDefaultChannel(firstChannel);
        }
    },[ firstChannel,defaultChannel])
    

    function onChangeChannel(id:string):void{
        setDefaultChannel(id)
    }

    if(errorFromFollowedChannels||errorFromFollowedVideos){
        return<ErrorPage msg="Subscribed channels"/>
    }


  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.95)] relative'>
            <article className='w-[90%] mx-auto'>
            <SectionHeader title="Subscriptions" size="text-lg md:text-xl" />
            <div className='relative flex overflow-x-auto overflow-y-hidden px-2 gap-4 border-b border-gray-400 py-2'>
            {(!loadingFollowedChannels&& userSubscriptions.length>0)&&userSubscriptions.map((param,index)=>{
                return<div key={param._id} className='h-26 w-[5.4rem] overflow-hidden'>
                    <div className='w-full flex flex-col items-center justify-center py-1' onClick={()=>onChangeChannel(param._id)}>
                        <img src={param.avatar} className={`w-[90%] aspect-square rounded-full object-cover cursor-pointer ${defaultChannel===param._id?"outline-2 border-2 border-gray-950 outline-[rgb(37,192,239)]":'border-2 border-gray-950'}`} loading={index<6?'eager':'lazy'} />
                        <p className='w-full text-center font-roboto text-gray-200 truncate'>{param.fullName}</p>
                    </div>
                </div>
            })}
            </div>
            <section>
                <div>
                    {(videosFromChannel?.length!==0)&&videosFromChannel?.map((par,index)=>{
                        return <Link className='mx-auto w-[90%] py-2' key={par._id} to={`/v/${par._id}`}>
                            <VideoCard_v2 data={par} index={index} />
                            </Link>
                    })}

                    {(defaultChannel &&!loadingFollowedVideos &&videosFromChannel?.length==0)&&
                    <section className='h-[5rem] md:h-[15rem] lg:h-[25rem] flex justify-center items-center'>
                        <div className='font-roboto text-xl text-gray-200 text-center py-6'>No videos found :(</div> 
                    </section>}
                {(loadingFollowedVideos)&&(emptyArr.map((par)=>{
                    return<div className='mx-auto w-[96%] py-2' key={par.id}>
                    <VideoCard_v2_skeleton />
                    </div>
                }))}
                {(fetchingMoreVideos &&videosFromChannel.length>0) && (emptyArr.map((par)=>{
                    return<div className='mx-auto w-[96%] py-2' key={par.id}>
                    <VideoCard_v2_skeleton />
                    </div>
                }))
                }
                <div
                    ref={videoContainerRef}
                    style={{ height: "20px" }}
                />
                </div>
            </section>
            {(userSubscriptions&&userSubscriptions.length===0)&&
            <section className='h-[5rem] md:h-[15rem] lg:h-[25rem] flex justify-center items-center'>
                <p className='font-roboto text-lg text-gray-500'>No Subscriptions found</p>
            </section>}
            </article>
        </main>
    </div>
  )
}

export default Subscriptions;
