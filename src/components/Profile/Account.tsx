import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../app/store/store'
import { AccountTabs } from './AccountTabs.tsx'
import type {AppDispatch} from '../../app/store/store.ts';
import { useParams } from 'react-router';
import {getChannelDetails,getChannelPlaylist,getChannelVideos} from '../../app/thunks/channelThunk.ts'
import { api } from '../../api/AxiosInterceptor.ts';
import { Wrench, X } from 'lucide-react';
import {Link} from 'react-router'
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import {resetChannelVideos,resetChannelUser} from '../../app/slices/channelSlice.ts';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import {messageModal, openAccountBar, toggleCreatePlaylistOverlay} from '../../app/slices/toggleSlice.ts'

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

interface playlistDetailType{
    playlistName:string,
    playlistDescription:string
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
    const openCreatePlaylistOverLay = useSelector((state:RootState)=>state.toggle.createPlaylistOverlay)
    const [newPlaylistDetails,setNewPlaylistDetails]=useState<playlistDetailType>({
        playlistName:'',
        playlistDescription:''
    })
    const [page,setPage]=useState<number>(1)
    const videoContainerRef = useRef(null)
    const pageCallback = useCallback(()=>{
        if(!channelData.channelVideosLoading&&channelData.hasMoreChannelVideos){
          setPage(prev=>prev+1)
        }
    },[channelData.channelVideosLoading,channelData.hasMoreChannelVideos])

    useIntersectionObserver(videoContainerRef,pageCallback)

    useEffect(()=>{
            if(user?._id!==undefined) dispatch(getChannelVideos({pageNum:page,userId:user?._id}))
    },[page,user?._id])

    useEffect(()=>{
        return () => {
            dispatch(resetChannelUser())
            dispatch(resetChannelVideos())
        }
    },[dispatch])

    useEffect(()=>{
        setLoading({
            videos:true,
            profile:true
        })
        setPage(1)
        dispatch(resetChannelUser())
        dispatch(resetChannelVideos())
        dispatch(openAccountBar(false))

        async function fetchData():Promise<void> {
            try{
                if(user?._id!==undefined) await dispatch(getChannelDetails({userId:user?._id,username:''}));
                if(user?._id!==undefined) await dispatch(getChannelPlaylist({userId:user?._id}))
            }finally{
                setLoading({
                    videos:false,
                    profile:false
                })
            }
        }
    fetchData()
    },[subscribeStatus])

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


    function changePlaylistHandler(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        e.preventDefault();
        const {name,value} = e.target

        setNewPlaylistDetails((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    async function createPlaylist():Promise<void> {
        try {
            const request = await api.post('/playlist',{name:newPlaylistDetails.playlistName,description:newPlaylistDetails.playlistDescription})
            if(request.status===201) {
                dispatch(messageModal("New playlist has been created"))
                if(user?._id!==undefined) await dispatch(getChannelPlaylist({userId:user?._id}))
                dispatch(()=>dispatch(toggleCreatePlaylistOverlay()))

            }

        } catch (error) {
            console.warn(error)
        }
    }

    function closePlaylistOverlay():void{
        dispatch(()=>dispatch(toggleCreatePlaylistOverlay()))
    }

  return (
    <div className={`relative ${openCreatePlaylistOverLay&&'h-[100dvh] overflow-hidden'}`}>
        <section className='bg-[rgba(0,0,0,0.95)]'>
            <div className='relative'>
                {(!loading.profile&&currentUser?.coverImage)&&<img src={currentUser?.coverImage} className='aspect-[16/6] object-cover w-[100%] md:w-[96%] md:aspect-[16/4] md:mx-auto' />}
                {
                    (!loading.profile&&currentUser?.coverImage==undefined) && <div className='aspect-[16/4] w-[100%] md:w-[96%] md:mx-auto font-roboto text-gray-400 flex items-center justify-center bg-[rgba(0,0,0,0.8)] border border-gray-700'>
                        No Cover Image
                    </div>
                }
                {loading.profile&&<div className='aspect-[16/6] object-cover w-[100%] md:w-[96%] md:aspect-[16/4] md:mx-auto animate-pulse bg-gray-800'></div>}
            </div>
            <section className='grid grid-cols-[35%_65%] md:grid-cols-[30%_70%] px-4 py-6 md:w-[100%] mx-auto'>
            <div className=''>
                    {!loading.profile&&<img src={currentUser?.avatar} className='aspect-square rounded-full w-[100%] md:w-[60%] md:mx-auto object-cover border border-gray-300' />}
                    {loading.profile&&<div className='aspect-square rounded-full w-[100%] md:w-[60%] md:mx-auto border animate-pulse bg-gray-800 border-gray-500'></div>}
            </div>
            <div className='w-[90%] mx-auto '>
                {(!loading.profile&&currentUser?.fullName!==undefined)&&<p className='text-gray-100 font-roboto text-2xl text-clip md:text-5xl my-1'>{currentUser?.fullName}</p>}
                {(loading.profile)&&<p className='text-gray-100 font-roboto w-[70%] h-[2rem] bg-gray-700 animate-pulse text-2xl text-clip md:text-5xl my-1'></p>}
                {!loading.profile&&<p className='font-roboto text-gray-400 text-sm md:text-xl'>@{currentUser?.username}</p>}
                {loading.profile&&<p className='font-roboto text-gray-400 animate-pulse h-[1rem] bg-gray-700 w-[40%] text-sm md:text-xl mt-1'></p>}
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
        {(channelData.channelVideos!==null&&channelData.channelPlaylist!==null)&&<AccountTabs videos={channelData.channelVideos} playlists={channelData.channelPlaylist} loading={loading.videos} />}
        <div
        ref={videoContainerRef}
        style={{ height: "20px" }}/>
        {openCreatePlaylistOverLay===true&&
        <div className='absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-[rgba(20,20,20,0.96)] z-20 flex items-center justify-center font-roboto'>
            <div className='border-gray-300 border rounded-3xl flex flex-col items-center w-[30rem] p-4 bg-[rgb(10,10,10)]'>
                <p className='text-lg md:text-xl mb-2 w-[90%] text-gray-200 flex justify-between items-center'>
                    <span>Create Playlist</span>
                    <span className='border border-gray-400 rounded-lg cursor-pointer'><X onClick={closePlaylistOverlay} /></span>
                </p>
                <div className='w-[90%] flex flex-col'>
                    <p className='text-gray-300'>Playlist Name</p>
                    <input type="text" value={newPlaylistDetails.playlistName} name="playlistName" placeholder='Enter your playlist name' className='p-2 text-gray-200 border-gray-300 border rounded-lg' onChange={changePlaylistHandler} />
                </div>
                <div className='w-[90%] flex flex-col my-4'>
                    <p className='text-gray-300'>Playlist Description</p>
                    {/* {<p className='text-red-400 text-sm'>Playlist Description should not remain empty</p>} */}
                    <textarea value={newPlaylistDetails.playlistDescription} name="playlistDescription" placeholder='Enter your playlist description' className='p-2 text-gray-200 border-gray-300 border resize-y min-h-12 max-h-18 rounded-lg' onChange={changePlaylistHandler} />
                </div>
                <button 
                className={`text-[rgb(10,10,10)] text-center p-2 rounded-lg bg-gray-300 border border-gray-300 ${(newPlaylistDetails.playlistDescription.trim().length>0&&newPlaylistDetails.playlistName.trim().length>0)?"cursor-pointer":"cursor-no-drop"} `} disabled={(newPlaylistDetails.playlistDescription.trim().length>0&&newPlaylistDetails.playlistName.trim().length>2)?false:true} onClick={createPlaylist}>
                    Create Playlist</button>
            </div>
            </div>}
    </div>
  )
}

export default Account;
