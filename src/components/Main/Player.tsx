import React,{useEffect, useState} from 'react';
import { useParams,useNavigate } from 'react-router';
import { useSelector,useDispatch } from 'react-redux';
import { saveTheVideo } from '../../app/thunks/videothunk.ts';
import { RootState } from '../../app/store/store.ts';
import { Plus } from 'lucide-react';
import { Comments } from './Comments.tsx';
import { VideoMenu } from './VideoMenu.tsx';
import type {AppDispatch} from '../../app/store/store.ts';
import { format } from 'date-fns';
import { MoreVids } from './MoreVids.tsx';
import {toggleSideBar} from '../../app/slices/toggleSlice.ts'
import OverLayDialouge from '../Layouts/OverLayDialouge.tsx'
import { api } from '../../api/AxiosInterceptor.ts';



const Player:React.FC = () => {
    const {videoId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [didUserPlayed,setDidUserPlayed] = useState(false)
    const [checkSubscription,setCheckSubscription] = useState<null|boolean>()
    const video = useSelector((state:RootState)=>state.video)

    useEffect(()=>{
        if(videoId){
            dispatch(saveTheVideo(videoId));
            (video!==null) && checkSubscriptionStatus()
        }else{
            navigate('/')   
        }
        dispatch(toggleSideBar(false))
    },[videoId])

       

    async function pushVideosIntoHistory(vidId:string){
        try {
            const request = await api.post(`/users/history/add`,{
                "videoId":vidId
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

    async function checkSubscriptionStatus() {
        try {
            const request = await api.get(`/subscriptions/check/${video.video?.owner._id}`)
            if(request.status===200){
                if(request.data.data===null){
                    setCheckSubscription(false)
                }else{
                    setCheckSubscription(true)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function trackUserPlay(param:string|undefined){
        if(didUserPlayed) return 
        if(param!==undefined){
        setTimeout(()=>pushVideosIntoHistory(param),2000)
        setDidUserPlayed(true)
        }
    }

    async function followChannel(par:string|undefined){
        try {//{{server}}/subscriptions/c/:channeld
            const request = await api.post(`/subscriptions/c/${par}`,{})
            if(request.status===200)  checkSubscriptionStatus()

        } catch (error) {
            console.log(error);
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
        <VideoMenu uploadTime={uploadedDate}/>
        <div className='flex justify-between items-center p-4 border-t border-[rgba(255,255,255,0.2)]'>
            <div className='flex items-center gap-3'>
                {video.video.owner.avatar&&<img src={video.video.owner.avatar} className='aspect-square w-[2rem] rounded-full object-cover' />}
                <p className='flex flex-col'>
                    <span className='text-slate-300 text-base font-poppins'>{video.video?.owner.username}</span>
                    <span className='text-[#AAAAAA] text-[12px]'>{video.subscribers} subscriber</span>
                </p>
            </div>
            <div className='text-slate-500 flex items-center justify-center' onClick={()=>followChannel(video.video?.owner._id)}>
            {!checkSubscription?
            <><Plus />
                Follow</>:<><Plus /> Following</>}
            </div>
        </div>
        </div>}
        <Comments />
        </section>
        <MoreVids/>
        <OverLayDialouge/>
    </div>
  )
}

export default Player;
