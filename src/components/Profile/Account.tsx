import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../app/store/store'
import { AccountTabs } from './AccountTabs'
import type {AppDispatch} from '../../app/store/store.ts';
import { useParams } from 'react-router';
import {getChannelDetails,getChannelVideos} from '../../app/thunks/channelThunk.ts'
import { api } from '../../api/AxiosInterceptor.ts';
import { Wrench } from 'lucide-react';
import {Link} from 'react-router'
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';

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


const Account = ():React.JSX.Element => {
    const user:userType | null = useSelector((state:RootState)=>state.user.userTemp)
    const channelData = useSelector((state:RootState)=>state.channel)
    const [subscribeStatus,setSubscribeStatus] = useState<subscriptionSuccessType|string>()
    const [loading,setLoading] = useState({
        profile:false,
        videos:false
    })
    const dispatch = useDispatch<AppDispatch>()
    const params = useParams<string>();
    const [page,setPage]=useState<number>(1)
    const videoContainerRef = useRef(null)

    const pageCallback = useCallback(()=>{
        if(!channelData.channelVideosLoading&&channelData.hasMoreChannelVideos){
          setPage(prev=>prev+1)
        }
    },[channelData.channelVideosLoading,channelData.hasMoreChannelVideos])

    useIntersectionObserver(videoContainerRef,pageCallback)

    useEffect(()=>{
        if(channelData.channelUserDetail?._id!==null){
            
            if(channelData.channelUserDetail?._id!==undefined) dispatch(getChannelVideos({pageNum:page,userId:channelData.channelUserDetail?._id}))
        }
    },[channelData.channelUserDetail?._id,page])


    useEffect(()=>{
        setLoading((prev)=>({
            ...prev,
            videos:true
        }))
        async function fetchData():Promise<void> {
            try{
                if(params.channelName) {
                    await dispatch(getChannelDetails({userId:'',username:params.channelName}));
                }else{
                    await dispatch(getChannelDetails({userId:user?._id,username:''}));
                }
            }finally{
                setLoading((prev)=>({
                    ...prev,
                    videos:false
                }))
            }
        }
    fetchData()
    },[subscribeStatus,params.channelName])

    if(channelData.error!==null){
        return<ErrorPage msg="Channel Details"/>
    }

    const currentUser = params.channelName ? channelData.channelUserDetail : user;
    const checkUserAsChannel = (user?.username === channelData.channelUserDetail?.username) ? true : false

    
    async function toggleSubscription(par1:string,par2:string):Promise<void>{
        try {
            const request = await api.post<toggleSubscriptionApiDataType>(`/subscriptions/c/${par1}`,
            {})

            if(request.status===200) {
                setSubscribeStatus(request.data.data)
            }

        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div>
        <section className='bg-[rgba(0,0,0,0.95)]'>
            <div className='relative'>
                {currentUser?.coverImage&&<img src={currentUser?.coverImage} className='aspect-[16/6] object-cover w-[100%] md:w-[96%] md:aspect-[16/4] md:mx-auto' />}
                {
                    (currentUser?.coverImage==undefined||currentUser?.coverImage.length==0) && <div className='aspect-[16/4] w-[100%] md:w-[96%] md:mx-auto font-roboto text-gray-400 flex items-center justify-center bg-[rgba(0,0,0,0.8)]'>
                        No Cover Image
                    </div>
                }
                {loading.profile&&<div className='aspect-[16/6] object-cover w-[100%] md:w-[96%] md:aspect-[16/4] md:mx-auto animate-pulse bg-gray-800'></div>}
            </div>
            <section className='grid grid-cols-[35%_65%] md:grid-cols-[30%_70%] px-4 py-6 md:w-[100%] mx-auto'>
            <div className=''>
                    <img src={currentUser?.avatar} className='aspect-square rounded-full w-[100%] md:w-[60%] md:mx-auto object-cover border border-gray-300' />
            </div>
            <div className='w-[90%] mx-auto '>
                <p className='text-gray-100 font-roboto text-2xl text-clip md:text-5xl my-1'>{currentUser?.fullName}</p>
                <p className='font-roboto text-gray-400 text-sm md:text-xl'>@{currentUser?.username}</p>
                <div className='py-4 flex items-center justify-between md:w-[60%]'>
                    <p>
                    {currentUser && "subscribersCount" in currentUser && (
                    <span className='font-roboto text-gray-400 text-sm md:text-2xl'>{currentUser.subscribersCount} Subscribers</span>
                    )}
                    </p>
                    <span className=''>
                        {(currentUser && "isSubscribed" in currentUser) && (
                            checkUserAsChannel!==true &&
                            <button className={`font-roboto text-gray-400 text-sm ${currentUser.isSubscribed?
                            "border border-gray-300 p-2 my-2 rounded":"bg-red-500 p-2 my-2 text-gray-950 rounded"} md:text-2xl`} onClick={()=>toggleSubscription(currentUser._id,currentUser.username)}>
                                {currentUser.isSubscribed?"Subscribed":"Subscribe"}
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
        {channelData!==undefined&&<AccountTabs data={channelData} loading={loading.videos} />}
        <div
        ref={videoContainerRef}
        style={{ height: "20px" }}/>
    </div>
  )
}

export default Account;
