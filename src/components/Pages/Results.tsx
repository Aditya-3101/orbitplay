import React,{useEffect, useState} from 'react'
import { useSearchParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx'
import { Link } from 'react-router'
import {toggleSideBar} from "../../app/slices/toggleSlice.ts"
import { api } from '../../api/AxiosInterceptor.ts'

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
    allVideoCount:number,
    allVideos:allVideosInterface[]
    limit:10,
    page:1
}

const Results = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [queryResults,setQueryResults] = useState<searchResultsInterface>()
    const dispatch = useDispatch()

    const query = searchParams.get('q')

    useEffect(()=>{
        const abortController = new AbortController()

        if (query!==null) fetchSearchResult(query,abortController)
        dispatch(toggleSideBar(true))
        return() => abortController.abort()
    },[query])

    async function fetchSearchResult(params:string,controller:AbortController) {
        try {
            const req = await api.get(`/videos?query=${params}`,
            {
                withCredentials:true,
                signal:controller.signal
            })

            if(req.status===200) setQueryResults(req.data.data)

        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className='bg-[rgba(0,0,0,0.9)] flex flex-col gap-4 justify-center items-center'>
        <section className='w-[90%]'>
            <p className='font-roboto text-slate-200 py-2'>Results for : {query}</p>
            {queryResults&&queryResults.allVideos.map((par,index)=>{
            return<Link to={`/v/${par._id}`} key={index}>
                <VideoCard_v2 data={par} />
            </Link>
            })}
        </section>
        <section className='w-[90%]'>
            {queryResults&&queryResults.allVideos.length===0&&<div className='flex items-center justify-center font-roboto text-gray-300 h-[10rem] md:h-[20rem]'>
                No Videos found
                </div>}
        </section>
    </div>
  )
}

export default Results