import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { host } from '../../Constants.ts'
import { SectionHeader } from '../Header/sectionHeader.tsx'
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx'


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
    const {playlistId} = useParams()

    if(!playlistId){
        return<div>Invalid Playlist</div>
    }

    useEffect(()=>{
        if (playlistId!==null&&playlistId!==undefined) fetchPlaylist(playlistId)
    },[playlistId])

    async function fetchPlaylist(par:string){
        try {
            const request = await axios.get(`${host}/api/v1/playlist/${par}`,
            {
                withCredentials:true,
            })
            if(request.status===200) {
                setPlaylistVideos(request.data.data)
                fetchVideosFromPlaylist(request.data.data.videos)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchVideosFromPlaylist(params:[]) {
            try {
                const req = await axios.post<playlistVidsResponse>(`${host}/api/v1/videos/playlist`,{
                    videos:params
                },
                {
                    withCredentials:true,
                })
                if(req.status===200) setPlaylistVids(req.data)
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
                {(playlistVids?.data.length!==0 &&playlistVids!==undefined)&&playlistVids.data.map((par,index)=>{
                    return<div key={index}>
                        <VideoCard_v2 data={par}/>
                        </div>
                })}
                {
                    playlistVids?.data.length===0&&
                    <div className='font-roboto flex items-center justify-center h-[8rem] text-gray-200'>
                        No Videos found in Playlist
                    </div>
                }
            </div>
        </main>
    </div>
  )
}

export default Playlist