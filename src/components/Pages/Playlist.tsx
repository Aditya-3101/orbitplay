import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router'
import { SectionHeader } from '../Header/sectionHeader.tsx'
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx'
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton.tsx'
import { api } from '../../api/AxiosInterceptor.ts'


interface playlistVideos{
    "_id": string,
    "name": string,
    "description": string,
    "videos": [
        string
    ],
    "owner": string,
    "__v": number
}

interface singlePlaylistVid{
    
        "_id": string,
        "thumbnail": string,
        "owner": {
            "_id": string,
            "username": string,
            "fullName": string,
            "avatar": string
        },
        "title": string,
        "duration": number,
        "views": number,
        "isPublished": boolean,
        "createdAt": string
}

interface playlistVidsResponse{
    "statusCode": number,
    "data": singlePlaylistVid[]
    "message": string,
    "success": number
}


const Playlist = () => {
    const [playlistVideos,setPlaylistVideos] = useState<playlistVideos>()
    const [playlistVids,setPlaylistVids] = useState<playlistVidsResponse>()
    const [loading,setLoading] = useState(false)
    const {playlistId} = useParams()

    if(!playlistId){
        return<div>Invalid Playlist</div>
    }

    useEffect(()=>{
        if (playlistId!==null&&playlistId!==undefined) fetchPlaylist(playlistId)
    },[playlistId])

    async function fetchPlaylist(par:string){
        try {
            const request = await api.get(`/playlist/${par}`)
            if(request.status===200) {
                setPlaylistVideos(request.data.data)
                fetchVideosFromPlaylist(request.data.data.videos)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    async function fetchVideosFromPlaylist(params:[]) {
        setLoading(true)

            try {
                const req = await api.post<playlistVidsResponse>(`/videos/playlist`,{
                    videos:params
                },
                {
                    withCredentials:true,
                })
                if(req.status===200) {
                    setPlaylistVids(req.data);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
            }
    }

  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.9)]'>
            <SectionHeader title="Playlists" size="text-xl" />
            <div className=' mx-auto border-t border-b border-gray-300'>
                {playlistVideos&&
                <div className='w-[96%] mx-auto py-2'>
                    <p className='font-roboto text-4xl text-gray-200'>{playlistVideos.name}</p>
                    <p className='font-roboto text-lg text-gray-500'>{playlistVideos.description}</p>
                </div>
                }
            </div>
            <div className='w-[90%] mx-auto py-2'>
                {(!loading&&(playlistVids?.data.length!==0 && playlistVids!==undefined))&&playlistVids.data.map((par,index)=>{
                    return<div key={index}>
                        <VideoCard_v2 data={par}/>
                        </div>
                })}
                {
                    (!loading&&playlistVids?.data.length===0)&&
                    <div className='font-roboto flex items-center justify-center h-[4rem] md:h-[8rem] text-gray-200'>
                        No Videos found in Playlist
                    </div>
                }
                {(loading)&&([...Array(9)].map((index)=>{
                    return<VideoCard_v2_skeleton key={index} />
                }))}
            </div>
        </main>
    </div>
  )
}

export default Playlist