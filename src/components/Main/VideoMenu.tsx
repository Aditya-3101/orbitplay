import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { RootState } from '../../app/store/store.ts';
import { useSelector, useDispatch } from 'react-redux';
import { ListPlus, ThumbsUp } from 'lucide-react';
import { timeAgo } from '../../utility/timeStamp.ts';
import {messageModal} from '../../app/slices/toggleSlice.ts'
import { api } from '../../api/AxiosInterceptor.ts';

interface playlistType{
    "_id": string,
    "name": string,
    "description": string,
    "videos": [],
    "owner": string,
    "__v": number
}

interface playlistFormat{
    "data": playlistType[]
    "status":number,
    "message":string,
    "statusCode":number
}

interface fetchLikeType{
    statusCode: number,
    data: []|[
        {
            "_id": null,
            "likeCount": number,
            "isLiked": boolean
        }
    ],
    message: string,
    success: number
}

export const VideoMenu = ({uploadTime}) => {
    const videoDetails = useSelector((state:RootState)=>state.video.video)
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch = useDispatch()
    const {videoId} = useParams()
    const [likes,setLikes] = useState({
        count:0,
        likedByUser:false
    })
    const [playlistToggle,setPlaylistToggle] = useState<boolean>(false)
    const [userPlaylist,setUserPlaylist] = useState<playlistFormat>()
    const [selectedPlayList,setSelectedPlaylist] = useState({
        status:false,
        id:null,
    })

    useEffect(()=>{
        const v_id: string|unknown = videoDetails?._id?videoDetails._id:videoId
        fetchLikes(v_id);
        fetchPlaylist()
    },[videoId])
    
    async function addTheVideoInPlaylist() {
        let par = selectedPlayList.id;
        try {
            const request = await api.patch(`/playlist/add/${videoDetails?._id}/${par}`,{})
            if(request.status===200 ) {
                setPlaylistToggle(false)
                dispatch(messageModal("Video added into playlist"))
            }
            
        } catch (error) {
            const errorCode = String(error.message).includes('409')
            if(errorCode){
                setPlaylistToggle(false)
                dispatch(messageModal("Video is already part of playlist"))
            }
        }
    }

    async function fetchLikes(par:string|unknown) {
        try {
            const req = await api.get<fetchLikeType>(`/likes/v/${par}`)
            if(req.status===200){
                const response = req.data.data
                setLikes((prev)=>({
                    ...prev,
                    count:response!=undefined?response.length!==0? response[0].likeCount:0:0,
                    likedByUser:response!=undefined?response.length!==0?response[0].isLiked:false:false
                }))
                console.log(req.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchPlaylist() {
        try {
            const request = await api.get(`/playlist/user/${user?._id}`)
            if(request.status===200) {
                setUserPlaylist(request.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function onSelectPlaylist(param){
        setSelectedPlaylist((prev)=>({
            status:true,
            id:param
        }))
    }


    async function toggleLikes() {
        
        try {
            const req = await api.post(`/likes/toggle/v/${videoDetails?._id}`,{},{
                withCredentials:true,
            })

            if(req.status===200){
                setLikes((prev)=>({
                    count:req.data.data.likeCount,
                    likedByUser:req.data.data.likedByUser
                }))

                dispatch(messageModal(`you have ${req.data.data.likedByUser?"liked":"disliked"} the video`))
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

    function togglePlaylistBtn(){
        setPlaylistToggle(!playlistToggle)
        if(userPlaylist?.data.length===0)  dispatch(messageModal(`No Playlists Found`))

    }
    

  return (
    <div>
        <section className='text-[#f1f1f1] p-2 flex justify-between relative'>
        <div className='flex flex-col justify-center w-[20%] items-center text-xs'>
         {likes.likedByUser?<ThumbsUp color="red" onClick={likeVideo}/>:<ThumbsUp color="white" onClick={likeVideo} />}
         <p className='text-xs'>{likes.count}</p>
         </div>
         <div className='w-[80%] flex items-center justify-evenly'>
            <div className='font-roboto text-sm rounded-2xl  relative'>
            
                <p className='flex items-center gap-1 cursor-pointer' onClick={togglePlaylistBtn}>
                <ListPlus />
                <span>Add to Playlist</span></p>
                <div>
                {((playlistToggle&&userPlaylist)&&userPlaylist?.data.length!==0)&&<section className='z-10 absolute top-[100%] bottom-0 right-0 left-[50%] md:left-[100%] w-[10rem] md:w-[15rem] h-[6rem] md:h-[10rem] overflow-y-auto bg-[rgba(0,0,0,0.7)]'>
                    {userPlaylist.data.map((par)=>{
                        return<div key={par._id} className={`p-1 flex items-center gap-2 border-b border-gray-300 cursor-pointer ${par._id===selectedPlayList.id?"bg-[rgba(255,255,255,0.2)]":""}`} onClick={()=>onSelectPlaylist(par._id)}>
                            <ListPlus />
                            <span className='text-sm md:text-base'>{par.name}</span>
                        </div>
                    })}
                    {selectedPlayList.id!==null&&<div className='flex justify-end mx-2 py-2'>
                        <button className={`${selectedPlayList.id!==null?"text-gray-700  bg-gray-100":"text-gray-700 bg-gray-300"} cursor-pointer rounded ml-auto p-1 text-sm`} onClick={addTheVideoInPlaylist}>Add</button></div>}
                    </section>}
            </div>
                </div>

            {uploadTime&&<p className='text-[#f1f1f190] text-[14px]'>{timeAgo(uploadTime)}</p>}
         </div>
        </section>
    </div>
  )
}
