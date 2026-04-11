import React, { useState } from 'react';
import { format } from 'date-fns';
import { getVideoDuration } from '../../utility/videoDuration';
import {ListVideo} from 'lucide-react'
import { Link } from 'react-router';
import { VideoCard_v2 } from '../Main/VideoCard_v2';


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

export const AccountTabs = ({ data }:{ data:channelDataInterface }) => {

    const [defaultTab,setDefaultTab] = useState("Videos")

    function tabChanger(e:React.MouseEvent<HTMLButtonElement>){
        setDefaultTab(e.currentTarget.name)
    }

    function getUploadeDate(param:string){
        return format(new Date(param),"dd MMMM yyyy")
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
            {/* {defaultTab==="Videos"&&<main>
                {data&&data.channelVideos?.allVideos.map((par,index)=>{
                    return<Link key={index} to={`/v/${par._id}`}>
                        <div className='grid grid-cols-[40%_60%] gap-4 my-4'>
                        <section className='aspect-[16/9] relative'>
                            <img src={par.thumbnail} className='w-[100%] aspect-video object-cover' />
                            <p className='absolute right-0 bottom-0 px-1 bg-[rgba(0,0,0,0.5)] text-slate-100 text-sm font-roboto'>{getVideoDuration(par.duration)}</p>
                        </section>
                        <section>
                            <p className='text-slate-50 text-xl font-roboto'>{par.title}</p>
                            <p className='truncate text-slate-400 text-sm font-roboto'>Uploaded on {getUploadeDate(par.createdAt)}</p>
                            <p className='text-slate-500 text-sm font-roboto'>{par.views} views</p>
                        </section>
                        </div>
                    </Link>
                })}
            </main>} */}
            {defaultTab==="Videos"&&<main>
                {data&&data.channelVideos?.allVideos.map((par,index)=>{
                    return <Link to={`/v/${par._id}`} key={index}>
                    <VideoCard_v2 data={par} />
                    </Link>
                })}
                </main>}
            {defaultTab==="Playlists"&&<main>
                {(data.channelPlaylist && data.channelPlaylist.length!==0 )?data.channelPlaylist.map((par,index)=>{
                    return<div key={index}>
                        <div>
                        <div className='grid grid-cols-[40%_60%] gap-4 my-4'>
                        <section className='aspect-[16/9] relative flex flex-col items-center justify-center'>
                            <div className='absolute top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.6)]'></div>
                            <ListVideo size={40} color="rgba(240,240,240,0.9)" />
                            <p className='text-gray-200 text-xs'>({par.videos.length} Videos)</p>
                        </section>
                        <section>
                            <p className='text-slate-50 text-xl font-roboto'>{par.name}</p>
                            <p className='text-slate-500 text-sm font-roboto'>{par.description} views</p>
                        </section>
                        </div>
                    </div>
                    </div>
                }):<div className='w-[100%] h-[40rem] flex items-center justify-center'>
                    <p className='font-roboto text-slate-300'>No Playlist found :(</p>
                  </div>}
            </main>}
        </div>
    </div>
  )
}
