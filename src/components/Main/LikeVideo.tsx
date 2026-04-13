import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { RootState } from '../../app/store/store.ts';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { host } from '../../Constants.ts';
import { ThumbsUp } from 'lucide-react';

export const LikeVideo = ({uploadTime}) => {
    const videoDetails = useSelector((state:RootState)=>state.video.video)
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)
    const {videoId} = useParams()
    const [likes,setLikes] = useState({
        count:0,
        likedByUser:false
    })

    useEffect(()=>{
        const v_id: string|unknown = videoDetails?._id?videoDetails._id:videoId
        fetchLikes(v_id);
    },[])

    
    

    async function fetchLikes(par:string|unknown) {

        try {
            const req = await axios.get(`${host}/api/v1/likes/v/${par}`,{
                withCredentials:true,
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(req.status===200){
                setLikes((prev)=>({
                    ...prev,
                    count:req.data.data
                }))
            }

        } catch (error) {
            console.log(error)
        }
    }


    async function toggleLikes() {
        
        try {
            const req = await axios.post(`${host}/api/v1/likes/toggle/v/${videoDetails?._id}`,{},{
                withCredentials:true,
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if(req.status===200){
                setLikes((prev)=>({
                    count:req.data.data.likeCount,
                    likedByUser:req.data.data.likedByUser
                }))
            }

        } catch (error) {
            console.log(error)
        }
    }

    const likeVideo = () =>{
        const initialState = likes.likedByUser
        setLikes((prev)=>({
            ...prev,
            likedByUser:!initialState
        }))

        toggleLikes()
    }

  return (
    <div>
        <section className='text-[#f1f1f1] p-2 flex justify-between'>
        <div className='flex flex-col justify-center w-[20%] items-center text-xs'>
         {likes.likedByUser?<ThumbsUp color="red" onClick={likeVideo}/>:<ThumbsUp color="white" onClick={likeVideo} />}
         <p className='text-xs'>{likes.count}</p>
         </div>
         <div className='w-[80%] flex items-center'>
            <p className='text-[#f1f1f190] text-[14px]'>Uploaded on {uploadTime}</p>
         </div>
        </section>
    </div>
  )
}
