import React,{useState,useEffect} from 'react';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';
import { api } from '../../api/AxiosInterceptor.ts';
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton.tsx';
import { emptyArr } from '../../utility/emptyArrays.ts';
import { ErrorPage } from './ErrorPage.tsx';
import { Link } from 'react-router';

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

const LikedVideos = ():React.JSX.Element => {

    const [likedVideos,setLikedVideos] = useState<likedVideoType>()
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<string|null>(null)

    useEffect(()=>{
        fetchLikedVideos()
    },[])

    async function fetchLikedVideos() {
        setLoading(true)
        try {
            const request = await api.get<likedVideoType>(`/likes/videos`)
            if(request.status===200){
                setLikedVideos(request.data)
                setLoading(false)
                setError(null)
            }
        } catch (err) {
            setError(err?.message)
        }finally{
            setLoading(false)
        }
    }

    if(error!==null){
        return<ErrorPage msg="Liked videos"/>
    }


  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.9)]'>
            <SectionHeader title="Liked Videos" size="text-lg text-xl" />
            <section className='w-[90%] mx-auto py-2'>
                {((!loading&&likedVideos)&&likedVideos.data.length!==0)&&<div>
                    <section>
                        {likedVideos.data.map((par)=>{
                            return<Link key={par._id} to={`/v/${par.likedVideo._id}`}>
                                <VideoCard_v2 data={par.likedVideo} />
                            </Link>
                        })}
                    </section>
                    </div>}
            </section>
            <div className='mx-auto py-2 w-[90%]'>
            {loading&&emptyArr.map((par)=>{
                    return<VideoCard_v2_skeleton key={par.id} />
                })}
            </div>
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