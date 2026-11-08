/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../app/store/store'
import { AccountTabs } from './AccountTabs.tsx'
import type {AppDispatch} from '../../app/store/store.ts';
import { useParams } from 'react-router';
import {getChannelDetails,getChannelPlaylist,getChannelPosts} from '../../app/thunks/channelThunk.ts'
import { Wrench } from 'lucide-react';
import {Link} from 'react-router'
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import {resetChannelVideos,resetChannelUser} from '../../app/slices/channelSlice.ts';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import {openAccountBar} from '../../app/slices/toggleSlice.ts'
import { useAccountVideos } from '../../features/Accounts/accounts.queries.ts';
import OverLayDialouge from '../Layouts/OverLayDialouge.tsx';
import {OpenVideoModal} from './OpenVideoEditModal.tsx'
import {convertImageExtension} from '../../utility/covertImageFormat.ts'
import { OpenPlaylistModal } from './OpenPlaylistModal.tsx';
import {OpenDeleteVideoModal} from './OpenDeleteVideoModal.tsx'
import {OpenVisibilityModal} from './OpenVisibilityModal.tsx'


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
    const {data,error,fetchNextPage,isLoading,hasNextPage,isFetchingNextPage} = useAccountVideos(user?._id)
    const channelData = useSelector((state:RootState)=>state.channel)
    const [loading,setLoading] = useState({
        profile:false,
    })
    const dispatch = useDispatch<AppDispatch>()
    const params = useParams<string>();
    const {deleteVideoOverlay,editVideoOverlay:openEditVideoOverLay,createPlaylistOverlay:openCreatePlaylistOverLay,visibilityVideoOverlay} = useSelector((state:RootState)=>state.toggle)
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

    if(error){
        return<ErrorPage msg="Account Details"/>
    }

    useEffect(()=>{
            if(user?._id!==undefined) {
                dispatch(getChannelPosts({userId:user?._id}))
            }
            dispatch(openAccountBar(false))
    },[user?._id,dispatch])

    useEffect(()=>{
        return () => {
            dispatch(resetChannelUser())
            dispatch(resetChannelVideos())
        }
    },[dispatch])
    
    
    useEffect(() => {
        if (!user?._id) return;
        dispatch(resetChannelUser());
        dispatch(resetChannelVideos());
        //dispatch(openAccountBar(false));
        
        const fetchData = async ():Promise<void> => {
        setLoading({
            profile: true
        });
            try {
                await dispatch(
                    getChannelDetails({
                        userId: user._id,
                        username: ''
                    })
                );
                
                await dispatch(
                    getChannelPlaylist({
                        userId: user._id
                    })
                );
            } finally {
                setLoading({
                    profile: false
                });
            }
        };
        fetchData();
    
    }, [dispatch, user?._id]);

    if(channelData.error!==null){
        return<ErrorPage msg="Channel Details"/>
    }

    const currentUser = params.channelName ? channelData.channelUserDetail : user;

    function precheckModalStatus(){
        if(openCreatePlaylistOverLay===false&&openEditVideoOverLay===false&&deleteVideoOverlay===false&&visibilityVideoOverlay===false){
            return true
        }

        return false;
    }
   

  return (
    <React.Fragment>
    {precheckModalStatus()?<div className={`relative ${(openCreatePlaylistOverLay||openEditVideoOverLay||deleteVideoOverlay)&&'h-dvh overflow-hidden'}`}>
    
        <section className='bg-[rgba(0,0,0,0.95)]'>
            <div className='relative'>
                {(!loading.profile&&currentUser?.coverImage)&&<img src={convertImageExtension(currentUser?.coverImage,720)} className='aspect-16/6 object-cover w-full md:w-[96%] md:aspect-16/4 md:mx-auto' alt="" loading='lazy' />}
                {
                    (!loading.profile&&currentUser?.coverImage==undefined) && <div className='aspect-16/4 w-full md:w-[96%] md:mx-auto font-roboto text-gray-400 flex items-center justify-center bg-[rgba(0,0,0,0.8)] border border-gray-700'>
                        No Cover Image
                    </div>
                }
                {loading.profile&&<div className='aspect-16/6 object-cover w-full md:w-[96%] md:aspect-16/4 md:mx-auto animate-pulse bg-gray-800'></div>}
            </div>
            <section className='grid grid-cols-[35%_65%] md:grid-cols-[25%_75%] px-4 py-6 md:w-full mx-auto '>
            <div className=''>
                    {!loading.profile&&<img src={currentUser?.avatar} className='aspect-square rounded-full w-full md:w-[70%] md:mx-auto object-cover border border-gray-300' />}
                    {loading.profile&&<div className='aspect-square rounded-full w-full md:w-[70%] md:mx-auto border animate-pulse bg-gray-800 border-gray-500'></div>}
            </div>
            <div className='w-[96%] mx-auto'>
                {(!loading.profile&&currentUser?.fullName!==undefined)&&<p className='text-gray-100 font-roboto text-2xl text-clip md:text-5xl my-1'>{currentUser?.fullName}</p>}
                {(loading.profile)&&<p className='text-gray-100 font-roboto w-[70%] h-[2rem] bg-gray-700 animate-pulse text-2xl text-clip md:text-5xl my-1'></p>}
                {!loading.profile&&<p className='font-roboto text-gray-400 text-sm md:text-xl'>@{currentUser?.username}</p>}
                {loading.profile&&<p className='font-roboto text-gray-400 animate-pulse h-[1rem] bg-gray-700 w-[40%] text-sm md:text-xl mt-1'></p>}
                <div className='py-4 flex items-center justify-between md:w-[60%]'>
                    <p>
                    {currentUser && "subscribersCount" in currentUser && (
                    <span className='font-roboto text-gray-400 text-sm md:text-2xl'>{currentUser.subscribersCount} Followers</span>
                    )}
                    </p>
                    {(currentUser===user)&&<Link className='text-gray-300' to="/settings">
                        <Wrench/>
                    </Link>}
                </div>
            </div>
            </section>
        </section>
        {(formattedVideos&&channelData.channelPlaylist!==null)&&
        <AccountTabs videos={formattedVideos} playlists={channelData.channelPlaylist} loading={isLoading} channelPosts={channelData.channelPosts}  />}
        <div
        ref={videoContainerRef}
        style={{ height: "20px" }}/>
        <OverLayDialouge/>
    </div>:<div className='overflow-hidden h-dvh'></div>}
    {openCreatePlaylistOverLay===true&&<OpenPlaylistModal/>}
    {openEditVideoOverLay===true&&<OpenVideoModal/>}
    {deleteVideoOverlay===true&&<OpenDeleteVideoModal/>}
    {visibilityVideoOverlay===true&&<OpenVisibilityModal/>}
    </React.Fragment>
  )
}

export default Account;
