import React,{useEffect, useState} from 'react';
import { useParams,useNavigate } from 'react-router';
import { useSelector,useDispatch } from 'react-redux';
import { saveTheVideo } from '../../app/thunks/videothunk.ts';
import { RootState } from '../../app/store/store.ts';
import { Plus } from 'lucide-react';
import { Comments } from './Comments.tsx';
import { LikeVideo } from './LikeVideo.tsx';
import type {AppDispatch} from '../../app/store/store.ts';
import { format } from 'date-fns';
import { MoreVids } from './MoreVids.tsx';
import {toggleSideBar} from '../../app/slices/toggleSlice.ts'
import axios from 'axios';
import { host } from '../../Constants.ts';



const Player:React.FC = () => {
    const {videoId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)
    const [didUserPlayed,setDidUserPlayed] = useState(false)

    useEffect(()=>{
        if(videoId){
            dispatch(saveTheVideo(videoId))
        }else{
            navigate('/')   
        }
        dispatch(toggleSideBar(false))
    },[videoId])

    const video = useSelector((state:RootState)=>state.video)   

    async function pushVideosIntoHistory(vidId:string){
        try {
            const request = await axios.post(`${host}/api/v1/users/history/add`,{
                "videoId":vidId
            },{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(request.status==200) {
                console.log("video is added into watch history")
            }
        } catch (error) {
            console.log(error)
        }
    }

    let uploadedDate:string|undefined

    if(video.video?.createdAt!==undefined && (video.video!==null&&video.video.createdAt.length!==0)) uploadedDate = format(new Date(video?.video.createdAt),"dd MMMM yyyy");    

    if(video.error!==null){
        return <div>Error....</div>
    }

    if(video.loading){
        return <div>Loading..</div>
    }

    async function trackUserPlay(param:string|undefined){
        if(didUserPlayed) return 
        if(param!==undefined){
        setTimeout(()=>pushVideosIntoHistory(param),5000)
        setDidUserPlayed(true)
        }
    }

  return (
    <div className='grid grid-cols-1 md:grid-cols-[70%_30%] relative'>
        <section>
        {video.video&&<div className='aspect-video bg-[#222222]'>
        {video.video.videoFile&&<video src={video.video.videoFile} controls={true} onPlay={()=>trackUserPlay(video.video?._id)} className='aspect-video w-[100%]'/>}
        <p className='p-2 flex justify-between'>
            <span className='font-poppins text-xl text-slate-200'>{video.video?.title}</span>
            <span className='text-slate-200'>{video.video?.views} views</span>
        </p>
        <LikeVideo uploadTime={uploadedDate}/>
        <div className='flex justify-between items-center p-4 border-t border-[rgba(255,255,255,0.2)]'>
            <div className='flex items-center gap-3'>
                {video.video.owner.avatar&&<img src={video.video.owner.avatar} className='aspect-square w-[2rem] rounded-full object-cover' />}
                <p className='flex flex-col'>
                    <span className='text-slate-300 text-base font-poppins'>{video.video?.owner.username}</span>
                    <span className='text-[#AAAAAA] text-[12px]'>{video.subscribers} subscriber</span>
                </p>
            </div>
            <div className='text-slate-500 flex items-center justify-center'>
            <Plus />
                Follow
            </div>
        </div>
        </div>}
        <Comments />
        </section>
        <MoreVids/>
    </div>
  )
}

export default Player;
