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
import { emptyArr } from '../../utility/emptyArrays.ts';
import VideoCard_v2_skeleton from './VideoCard_v2_skeleton.tsx';
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import { Link } from 'react-router-dom';

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
            if (video!==null&&video.video?._id.length!==0) checkSubscriptionStatus()
        }else{
            navigate('/')   
        }
        dispatch(toggleSideBar(false))
        window.scrollTo(0,0)
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

    if(video.video?.createdAt!==undefined && (video.video!==null&&video.video.createdAt.length!==0)) uploadedDate = format(new Date(video?.video.createdAt),"MMM dd yyyy");    

    async function checkSubscriptionStatus():Promise<void> {
        
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

    async function trackUserPlay(param:string|undefined):Promise<void>{
        if(didUserPlayed) return 
        if(param!==undefined){
        setTimeout(()=>pushVideosIntoHistory(param),2000)
        setDidUserPlayed(true)
        }
    }

    async function followChannel(par:string|undefined):Promise<void>{
        try {
            const request = await api.post(`/subscriptions/c/${par}`,{})
            if(request.status===200)  checkSubscriptionStatus()

        } catch (error) {
            console.log(error);
        }
    }

    if(video.error!==null){
        return<ErrorPage msg="video" />
    }

  return (
    <>
    <div className='grid grid-cols-1 md:grid-cols-[70%_30%] relative'>
        <section>
        {video.loading&&<div className='aspect-video bg-[rgba(20,20,20,0.9)] animate-pulse flex items-center justify-center'>
            <div className="loader"></div>
        </div>}
        {(video.video&&!video.loading)&&<div className='aspect-video bg-[rgba(20,20,20,0.9)]'>
        {video.video.videoFile&&<video src={video.video.videoFile} controls={true} onPlay={()=>trackUserPlay(video.video?._id)} className='aspect-video w-[100%]'/>}
        <p className='p-2 flex justify-between'>
            <span className='font-poppins text-xl text-slate-200'>{video.video?.title}</span>
            {/* <span className='text-slate-200'>{video.video?.views} views</span> */}
        </p>
        {(uploadedDate!==undefined&&!video.loading)&&<VideoMenu uploadTime={uploadedDate}/>}
        <div className='flex justify-between items-center p-4 border-t border-[rgba(255,255,255,0.2)]'>
            <div className='flex items-center gap-3'>
                {video.video.owner.avatar&&<img src={video.video.owner.avatar} className='aspect-square w-[2rem] rounded-full object-cover' />}
                <Link className='flex flex-col' to={`/channel/${video.video.owner.username}`}>
                    <span className='text-slate-300 text-base md:text-lg font-poppins'>{video.video?.owner.username}</span>
                    <span className='text-[#AAAAAA] text-[12px]'>{video.subscribers} subscribers</span>
                </Link>
            </div>
            <div className='text-slate-500 flex items-center justify-center cursor-pointer' onClick={()=>followChannel(video.video?.owner._id)}>
            {!checkSubscription?
            <><Plus />
                Follow</>:<><Plus /> Following</>}
            </div>
        </div>
        </div>}
        {video.loading&&<div className='w-full h-[6rem] md:h-[8rem] px-4 py-2'>
            <div className='w-[100%] h-[2rem] bg-[rgba(20,20,20,0.7)] animate-pulse'>
            </div>
            <div className='w-[60%] h-[2rem] bg-[rgba(20,20,20,0.7)] animate-pulse mt-2'>
            </div>
        </div>}
        {video.loading&&<div className='flex justify-between items-center p-4 border-t border-[rgba(255,255,255,0.2)]'>
            <div className='flex items-center gap-3'>
                <div className='aspect-square w-[2rem] rounded-full object-cover animate-pulse bg-[rgba(20,20,20,0.6)]'></div>
                <p className='flex flex-col gap-2'>
                    <span className='text-slate-300 w-[10rem] h-4 text-base md:text-lg font-poppins animate-pulse bg-[rgba(20,20,20,0.6)]'></span>
                    <span className='text-[#AAAAAA] w-[6rem] h-4 text-[12px] animate-pulse bg-[rgba(20,20,20,0.6)]'></span>
                </p>
            </div>
            <div className='text-slate-500 flex items-center justify-center'>
            </div>
        </div>}
        {!video.loading&&<Comments />}
        </section>
        {!video.loading&&<MoreVids/>}
        {video.loading&&<div className='bg-[rgba(20,20,20,0.9)] relative py-4 '>
            <div className='mx-auto py-1 w-[90%]'>
            {emptyArr.map((par)=>{
                return<VideoCard_v2_skeleton key={par.id} />
            })}</div>
            </div>}
        <OverLayDialouge/>
    </div>
    </>
  )
}

export default Player;
