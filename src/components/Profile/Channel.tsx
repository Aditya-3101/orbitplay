import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../app/store/store'
import { AccountTabs } from './AccountTabs'
import type {AppDispatch} from '../../app/store/store.ts';
import { useParams } from 'react-router';
import {getChannelDetails,getChannelPlaylist,getChannelPosts} from '../../app/thunks/channelThunk.ts'
import { api } from '../../api/AxiosInstance.ts';
import { Wrench } from 'lucide-react';
import {Link} from 'react-router'
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import {resetChannelVideos,resetChannelUser,toggleChannelSubscription} from '../../app/slices/channelSlice.ts';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import {openAccountBar} from '../../app/slices/toggleSlice.ts'
import { useAccountVideos } from '../../features/Accounts/accounts.queries.ts';
import OverLayDialouge from '../Layouts/OverLayDialouge.tsx';
import { convertImageExtension } from '../../utility/covertImageFormat.ts';
import { OpenVideoModal } from './OpenVideoEditModal.tsx';
import { OpenPlaylistModal } from './OpenPlaylistModal.tsx';
import { OpenDeleteVideoModal } from './OpenDeleteVideoModal.tsx';

interface subscriptionSuccessType{
    subscriber: string,
    channel: string,
    _id: string,
    createdAt: string,
    updatedAt: string,
}

interface toggleSubscriptionApiDataType{
    statusCode: number,
    data:subscriptionSuccessType|string,
    __v: number,
    message: string,
    success: number
}

interface userType{
    _id:string,
    username:string,
    email:string,
    fullName:string,
    avatar:string,
    coverImage?:string,
    watchHistory:Array<string>,
    createdAt?:string,
    updatedAt?:string,
    __v?:string,
}


const ChannelPage = ():React.JSX.Element => {
    const user:userType | null = useSelector((state:RootState)=>state.user.userTemp)
    const channelData = useSelector((state:RootState)=>state.channel)
    const {data,error,fetchNextPage,isLoading,hasNextPage,isFetchingNextPage} = useAccountVideos(channelData.channelUserDetail?._id)

    // const openCreatePlaylistOverLay = useSelector((state:RootState)=>state.toggle.createPlaylistOverlay);
    const {deleteVideoOverlay,editVideoOverlay:openEditVideoOverLay,createPlaylistOverlay:openCreatePlaylistOverLay} = useSelector((state:RootState)=>state.toggle)
    const [loading,setLoading] = useState({
        profile:false,
    })
    const dispatch = useDispatch<AppDispatch>()
    const params = useParams<string>();
    const videoContainerRef = useRef(null)

    const pageCallback = useCallback(()=>{
        if(hasNextPage&&!isFetchingNextPage){
          fetchNextPage();
        }
    },[hasNextPage,isFetchingNextPage,fetchNextPage])

    useIntersectionObserver(videoContainerRef,pageCallback)

    const channelVideos = data;

    const formattedVideos = channelVideos?.pages
    ? {
        ...channelVideos.pages[0],
        data: {
            ...channelVideos.pages[0].data,
            allVideos: channelVideos.pages.flatMap(
                page => page.data.allVideos
            )
        }
    }
    : undefined;

    useEffect(()=>{
            if(channelData.channelUserDetail?._id!==null&&channelData.channelUserDetail?._id!==undefined) {
                dispatch(getChannelPlaylist({userId:channelData.channelUserDetail._id}))
                //dispatch(getChannelVideos({pageNum:page,userId:channelData.channelUserDetail._id}))
                dispatch(getChannelPosts({userId:channelData.channelUserDetail._id}))
            }
    },[channelData.channelUserDetail?._id,dispatch])

    useEffect(()=>{
        return () => {
            dispatch(resetChannelUser())
            dispatch(resetChannelVideos())
        }
    },[dispatch])

    useEffect(()=>{

        dispatch(resetChannelUser())
        dispatch(resetChannelVideos())
        dispatch(openAccountBar(false))

        async function fetchData():Promise<void> {
        setLoading({
            profile:true
        })
            try{
                if(params.channelName!==null&&params.channelName!==undefined) await dispatch(getChannelDetails({userId:'',username:params.channelName}));
            }finally{
                setLoading({
                    profile:false
                })
            }
        }
        fetchData()
    },[params.channelName,dispatch])

    if(channelData.error!==null||error){
        return<ErrorPage msg="Channel Details"/>
    }

    const currentUser = params.channelName ? channelData.channelUserDetail : null

    
    async function toggleSubscription(par1:string,par2?:string):Promise<void>{
        try {
            const request = await api.post<toggleSubscriptionApiDataType>(`/subscriptions/c/${par1}`,
            {})

            if(request.status===200) {
                //setSubscribeStatus(request.data.data)
                dispatch(toggleChannelSubscription((typeof request.data.data==="object")?true:false))
            }

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <React.Fragment>
    {(openCreatePlaylistOverLay===false&&openEditVideoOverLay==false&&deleteVideoOverlay===false)?<div className={`relative ${(openCreatePlaylistOverLay||openEditVideoOverLay||deleteVideoOverlay)&&'h-dvh overflow-hidden'}`}>
        <section className='bg-[rgba(0,0,0,0.95)]'>
            <div className='relative'>
                {(!loading.profile&&currentUser?.coverImage)&&<img src={convertImageExtension(currentUser?.coverImage,720)} className='aspect-[16/6] object-cover w-full md:w-[96%] md:aspect-[16/4] md:mx-auto' />}
                {
                    (!loading.profile&&currentUser?.coverImage==undefined) && <div className='aspect-[16/4] w-full md:w-[96%] md:mx-auto font-roboto text-gray-400 flex items-center justify-center bg-[rgba(0,0,0,0.8)] border border-gray-700'>
                        No Cover Image
                    </div>
                }
                {loading.profile&&<div className='aspect-[16/6] object-cover w-full md:w-[96%] md:aspect-[16/4] md:mx-auto animate-pulse bg-gray-800'></div>}
            </div>
            <section className='grid grid-cols-[35%_65%] md:grid-cols-[25%_75%] px-4 py-6 md:w-full mx-auto'>
            <div className=''>
                    {!loading.profile&&<img src={currentUser?.avatar} className='aspect-square rounded-full w-full md:w-[70%] md:mx-auto object-cover border border-gray-300' />}
                    {loading.profile&&<div className='aspect-square rounded-full w-full md:w-[70%] md:mx-auto border animate-pulse bg-gray-800 border-gray-500'></div>}
            </div>
            <div className='w-[96%] mx-auto '>
                {(!loading.profile&&currentUser?.fullName!==undefined)&&<p className='text-gray-100 font-roboto text-2xl text-clip md:text-5xl my-1'>{currentUser?.fullName}</p>}
                {(loading.profile)&&<p className='text-gray-100 font-roboto w-[70%] h-[2rem] bg-gray-700 animate-pulse text-2xl text-clip md:text-5xl my-1'></p>}
                {!loading.profile&&<p className='font-roboto text-gray-400 text-sm md:text-xl'>@{currentUser?.username}</p>}
                {loading.profile&&<p className='font-roboto text-gray-400 animate-pulse h-[1rem] bg-gray-700 w-[40%] text-sm md:text-xl mt-1'></p>}
                <div className='py-4 flex items-center justify-between md:w-[60%]'>
                    <p>
                    {currentUser && "subscribersCount" in currentUser && (
                    <span className='font-roboto text-gray-400 text-sm md:text-xl'>{currentUser.subscribersCount} Followers</span>
                    )}
                    </p>
                    <span className=''>
                        {(currentUser && "isSubscribed" in currentUser) && (
                            <button className={`font-roboto text-gray-400 text-sm ${currentUser.isSubscribed?
                            "border border-gray-300 p-2 my-2 rounded":"bg-red-500 p-2 my-2 text-gray-950 rounded"} md:text-xl cursor-pointer`} onClick={()=>toggleSubscription(currentUser._id,currentUser.username)}>
                                {currentUser.isSubscribed?"Following":"Follow"}
                            </button>
                        )}
                    </span>
                    {(currentUser===user)&&<Link className='text-gray-300' to="/settings">
                        <Wrench/>
                    </Link>}
                </div>
            </div>
            </section>
        </section>
        {/* {channelData!==undefined&&<AccountTabs data={channelData} loading={loading.videos} />} */}
        {(formattedVideos&&channelData.channelPlaylist!==null)&&<AccountTabs videos={formattedVideos} playlists={channelData.channelPlaylist} loading={isLoading} channelPosts={channelData.channelPosts} />}
        <div
        ref={videoContainerRef}
        style={{ height: "20px" }}/>
        <OverLayDialouge/>
        </div>:<div className='overflow-hidden h-dvh'></div>}
        {openCreatePlaylistOverLay===true&& <OpenPlaylistModal />}
        {openEditVideoOverLay===true&&<OpenVideoModal/>}
        {deleteVideoOverlay===true&&<OpenDeleteVideoModal/>}
        </React.Fragment>

  )
}

export default ChannelPage;
