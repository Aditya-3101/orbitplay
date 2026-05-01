import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useSearchParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx'
import { Link } from 'react-router'
import {messageModal, toggleSideBar} from "../../app/slices/toggleSlice.ts"
import { api } from '../../api/AxiosInterceptor.ts'
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton.tsx'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx'

interface allVideosInterface {
createdAt:string,
description:string,
duration:number,
isPublished:boolean
owner:{
    _id:string,
    fullName:string,
    avatar:string
},
thumbnail:string,
title:string,
updatedAt:string,
videoFile:string,
views:number
__v:number
_id:string
}

interface searchResultsInterface {
    statusCode:number,
    data:{
        allVideoCount:number,
        allVideos:allVideosInterface[],
        limit:number,
        page:number
    },
    message:string,
    success:number
}

const Results = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [queryResults,setQueryResults] = useState<allVideosInterface[]>([])
    const [loading,setLoading] = useState<boolean>(false)
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const [page,setPage] = useState(1)
    const [hasMore,setHasmore]=useState(false)
    const dispatch = useDispatch()
    const pageCallback = useCallback(()=>{
        if(!loading&&hasMore){
          setPage(prev=>prev+1)
        }
    },[loading,hasMore])

    useIntersectionObserver(videoContainerRef,pageCallback)

    const query = searchParams.get('q')

    useEffect(()=>{
        const abortController = new AbortController()

        if (query!==null) fetchSearchResult(page,query,abortController)
        dispatch(toggleSideBar(true))
        return() => abortController.abort()
    },[query,page])

    async function fetchSearchResult(page:number,params:string,controller:AbortController) {
        setLoading(true)
        try {
            const req = await api.get<searchResultsInterface>(`/videos?query=${params}&page=${page}`,
            {
                withCredentials:true,
                signal:controller.signal
            })

            if(req.status===200) {
                const newResults = req.data.data.allVideos;
                setQueryResults((prev)=>{
                    const existingIds = new Set(prev.map(v => v._id));
                    const filtered = newResults.filter(v => !existingIds.has(v._id));
                    return [...prev, ...filtered];
                });
                setLoading(false)
                setHasmore((req.data.data.limit*req.data.data.page)<req.data.data.allVideoCount)
            }

        } catch (error) {
            dispatch(messageModal("something went wrong while fetching results"))
        }finally{
            setLoading(false)
        }
    }    

  return (
    <div className='bg-[rgba(0,0,0,0.9)] flex flex-col gap-4 justify-center items-center'>
        <section className='w-[90%]'>
            <p className='font-roboto text-slate-200 py-2'>Results for : {query}</p>
            {(!loading&&queryResults)&&queryResults.map((par,index)=>{
            return<Link to={`/v/${par._id}`} key={par._id}>
                <VideoCard_v2 data={par} />
            </Link>
            })}
            {(loading)&&([...Array(9)].map((index)=>{
                    return<VideoCard_v2_skeleton key={index} />
                }))}
        <div ref={videoContainerRef} className='w-[100%] h-[30px]'/>
        </section>
        <section className='w-[90%]'>
            {queryResults&&queryResults.length===0&&<div className='flex items-center justify-center font-roboto text-gray-300 h-[10rem] md:h-[20rem]'>
                No Videos found
                </div>}
        </section>
    </div>
  )
}

export default Results