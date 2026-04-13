import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useSearchParams } from 'react-router'
import { host } from '../../Constants'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store/store'
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx'
import { Link } from 'react-router'
import {toggleSideBar} from "../../app/slices/toggleSlice.ts"
import { SectionHeader } from '../Header/sectionHeader.tsx'

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
    const {accessToken,userTemp} = useSelector((state:RootState)=>state.user)
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
            const req = await axios.get(`${host}/api/v1/videos?userId=${userTemp?._id}&query=${params}`,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                },
                signal:controller.signal
            })

            if(req.status===200) setQueryResults(req.data.data)

        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className='bg-[rgba(0,0,0,0.9)] flex flex-col gap-4 justify-center items-center'>
        <SectionHeader title="Subscriptions" size="2rem" />
        <section className='w-[90%]'>
            <p className='font-roboto text-slate-200 py-2'>Results for : {query}</p>
            {queryResults&&queryResults.allVideos.map((par,index)=>{
            return<Link to={`/v/${par._id}`} key={index}>
                <VideoCard_v2 data={par} />
            </Link>
            })}
        </section>
    </div>
  )
}

export default Results