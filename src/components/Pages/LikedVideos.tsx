import React,{useState,useEffect} from 'react';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';
import { api } from '../../api/AxiosInterceptor.ts';

interface likedVideoDataType{
    "likedVideo": {
        "_id": string,
        "videoFile": string,
        "thumbnail": string,
        "owner": {
            "_id": string,
            "username": string,
            "fullName": string,
            "avatar": string
        },
        "title": string,
        "description": string,
        "duration": number,
        "views": number,
        "isPublished": boolean,
        "createdAt": string,
        "updatedAt": string,
        "__v": number
    }
    "_id": string,
}

interface likedVideoType{
        "statusCode": number,
        "data": likedVideoDataType[]
        "message": string,
        "success": number
}

const LikedVideos = () => {

    const [likedVideos,setLikedVideos] = useState<likedVideoType>()

    useEffect(()=>{
        fetchLikedVideos()
    },[])

    async function fetchLikedVideos() {
        try {
            const request = await api.get<likedVideoType>(`/likes/videos`)
            if(request.status===200){
                setLikedVideos(request.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.9)]'>
            <SectionHeader title="Liked Videos" size="text-lg text-xl" />
            <section className='w-[90%] mx-auto py-2'>
                {(likedVideos&&likedVideos.data.length!==0)&&<div>
                    <section>
                        {likedVideos.data.map((par)=>{
                            return<div key={par._id}>
                                <VideoCard_v2 data={par.likedVideo} />
                            </div>
                        })}
                    </section>
                    </div>}
            </section>
            {(!likedVideos||likedVideos.data.length===0)&&<section>
                <div className='h-[14rem] font-roboto text-gray-300 flex items-center justify-center'>
                    No Liked Videos Found
                </div>
                </section>}
        </main>
    </div>
  )
}

export default LikedVideos