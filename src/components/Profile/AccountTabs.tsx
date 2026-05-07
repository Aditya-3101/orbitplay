import React, { useState } from 'react';
import {ListVideo} from 'lucide-react'
import { Link } from 'react-router';
import { VideoCard_v2 } from '../Main/VideoCard_v2';
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton';
import { emptyArr } from '../../utility/emptyArrays';
import { api } from '../../api/AxiosInterceptor';
import { useDispatch } from 'react-redux';
import { messageModal } from '../../app/slices/toggleSlice';
import {updateVideoVisibility,deleteVideo} from '../../app/slices/channelSlice'

interface ChannelVideoOwner {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  }
  
  interface ChannelVideo {
    _id: string;
    videoFile: string;
    thumbnail: string;
    owner: ChannelVideoOwner;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface ChannelVideosData {
    allVideos: ChannelVideo[];
    allVideoCount: number;
    page: number;
    limit: number;
  }
  
  interface GetChannelVideosResponse {
    statusCode: number;
    data: ChannelVideosData;
    message: string;
    success: number;
  }

interface channelPlaylistInterface {
    _id:string,
    name:string,
    description:string,
    videos:[],
    owner:string,
    __v:number,
}

interface channelDataInterface {
    channelVideos:GetChannelVideosResponse|null;
    channelPlaylist:channelPlaylistInterface[]|null;
    channelVideosLoading:boolean;
    hasMoreChannelVideos:boolean;
    loading:boolean;
    error:string|unknown
}

interface togglePublishType{
    statusCode: number,
    data: {
        _id:string,
        videoFile: string,
        thumbnail: string,
        owner: string,
        title: string,
        description: string,
        duration: number,
        views: number,
        isPublished: boolean,
        createdAt: string,
        updatedAt: string,
        __v: number
    },
    message: string,
    success: number
}

interface videoObjectResponse {
    _id: string,
    videoFile: string,
    thumbnail: string,
    owner: {
        _id: string,
        username: string,
        avatar: string,
        fullName?:string
    },
    title: string,
    description: string,
    duration: number,
    views: number,
    isPublished: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export const AccountTabs = ({ data,loading }:{ data:channelDataInterface,loading:boolean }):React.JSX.Element => {

    const [defaultTab,setDefaultTab] = useState<string>("Videos")
    const dispatch = useDispatch()

    function tabChanger(e:React.MouseEvent<HTMLButtonElement>):void{
        setDefaultTab(e.currentTarget.name)
    }

    async function onDeleteVideo(e:React.MouseEvent,arg:string):Promise<void>{
        e.preventDefault()
        try {
            const req = await api.delete(`/videos/${arg}`)
            if(req.status===200) {
                dispatch(messageModal("Video Delete Successfully"))
                dispatch(deleteVideo(arg))
            }
        } catch (error) {
            dispatch(messageModal("something went wrong while deleting the video"))
        }
    }

    async function togglePublish(e:React.MouseEvent,arg:videoObjectResponse):Promise<void>{
        e.preventDefault()
        try {
            const request = await api.patch<togglePublishType>(`/videos/toggle/publish/${arg._id}`)
            if(request.status===200) {
                dispatch(updateVideoVisibility(request.data.data))
                dispatch(messageModal(`Video is now set to ${request.data.data.isPublished===false?"Public":"Private"}`))
            }
        } catch (error) {
            dispatch(messageModal("something went wrong while toggling video visibility"))
        }
    }

  return (
    <div>
        <section className='bg-[rgba(0,0,0,0.95)] px-4 py-2'>
            <ul className='flex'>
                <button className={`font-roboto text-slate-200 px-3 py-2 
                ${defaultTab==="Videos"&&'bg-[#222]'}`} name="Videos" onClick={tabChanger}>Videos</button>
                <button className={`font-roboto text-slate-200 p-2 px-3 py-2 ${defaultTab==="Playlists"&&'bg-[#222]'}`} name="Playlists" onClick={tabChanger}>Playlists</button>
            </ul>
        </section>
        <div className='bg-[rgba(0,0,0,0.90)] p-4'>
            {defaultTab==="Videos"&&
            <main>
                {(!loading && data.channelVideos?.data.allVideos.length!==0)&&data.channelVideos?.data.allVideos.map((par)=>{
                    return <Link to={`/v/${par._id}`} key={par._id} className='relative z-[0]'>
                    <VideoCard_v2 data={par} onDelete={onDeleteVideo} onTogglePublish={togglePublish} />
                    </Link>
                })}
                {
                    (!loading&&data.channelVideos?.data.allVideos.length===0) &&<div className='font-roboto h-[10rem] w-[100%] md:h-[20rem] flex items-center justify-center text-gray-400'>
                        No Videos Found
                    </div>
                }
                {loading&&(emptyArr.map((par)=>{
                    return<VideoCard_v2_skeleton key={par.id} />
                }))}
                </main>}
            {defaultTab==="Playlists"&&<main className=''>
                {(data.channelPlaylist && data.channelPlaylist.length!==0 )?data.channelPlaylist.map((par)=>{
                    return<div key={par._id} className=' mb-2'>
                        <Link to={`/playlists/${par._id}`}>
                        <div className='grid grid-cols-[40%_60%] gap-4'>
                        <section className='aspect-[16/9] relative flex flex-col items-center justify-center bg-[rgba(20,20,20,20.6)]'>
                            <div className='absolute top-0 right-0 left-0 bottom-0'></div>
                            <ListVideo size={36} color="rgba(240,240,240,0.9)" />
                            <p className='text-gray-200 text-xs'>({par.videos.length} Videos)</p>
                        </section>
                        <section>
                            <p className='text-slate-50 text-base md:text-2xl font-roboto'>{par.name}</p>
                            <p className='text-slate-500 text-xs md:text-sm font-roboto'>{par.description} views</p>
                        </section>
                        </div>
                    </Link>
                    </div>
                }):<div className='w-[100%] h-[40rem] flex items-center justify-center'>
                    <p className='font-roboto text-slate-300'>No Playlist found :(</p>
                  </div>}
            </main>}
        </div>
    </div>
  )
}
