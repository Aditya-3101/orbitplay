import React, { useState } from 'react';
import {ListVideo} from 'lucide-react'
import { Link } from 'react-router';
import { VideoCard_v2 } from '../Main/VideoCard_v2';
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton';


interface channelVideoInterface{
    allVideoCount:number,
    allVideos:{
        _id:string,
        createdAt: string,
        description:string,
        duration:number
        isPublished:boolean,
        owner:string,
        thumbnail:string,
        title:string,
        updatedAt:string,
        videoFile:string,
        views:number,
        __v:number
    }[],
    limit:number,
    page:number
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
    channelVideos:channelVideoInterface|null;
    channelPlaylist:channelPlaylistInterface[]|null;
    loading:boolean;
    error:string|unknown
}

export const AccountTabs = ({ data,loading }:{ data:channelDataInterface,loading:boolean }) => {

    const [defaultTab,setDefaultTab] = useState("Videos")

    function tabChanger(e:React.MouseEvent<HTMLButtonElement>){
        setDefaultTab(e.currentTarget.name)
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
                {(!loading && data.channelVideos?.allVideos.length!==0)&&data.channelVideos?.allVideos.map((par,index)=>{
                    return <Link to={`/v/${par._id}`} key={index}>
                    <VideoCard_v2 data={par} />
                    </Link>
                })}
                {
                    (!loading&&data.channelVideos?.allVideos.length===0) &&<div className='font-roboto h-[10rem] w-[100%] md:h-[20rem] flex items-center justify-center text-gray-400'>
                        No Videos Found
                    </div>
                }
                {loading&&([...Array(9)].map((index)=>{
                    return<VideoCard_v2_skeleton key={index} />
                }))}
                </main>}
            {defaultTab==="Playlists"&&<main>
                {(data.channelPlaylist && data.channelPlaylist.length!==0 )?data.channelPlaylist.map((par,index)=>{
                    return<div key={index}>
                        <Link to={`/playlists/${par._id}`}>
                        <div className='grid grid-cols-[40%_60%] gap-4 my-4'>
                        <section className='aspect-[16/9] relative flex flex-col items-center justify-center'>
                            <div className='absolute top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.6)]'></div>
                            <ListVideo size={40} color="rgba(240,240,240,0.9)" />
                            <p className='text-gray-200 text-xs'>({par.videos.length} Videos)</p>
                        </section>
                        <section>
                            <p className='text-slate-50 text-2xl font-roboto'>{par.name}</p>
                            <p className='text-slate-500 text-sm font-roboto'>{par.description} views</p>
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
