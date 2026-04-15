import React,{useEffect, useState} from 'react';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import axios from 'axios';
import { host } from '../../Constants.ts';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';
import { dateAgo } from '../../utility/timeStamp.ts';
import { Link } from 'react-router';
interface watchHistoryVideoType{
    "_id": string,
    "video": {
        "_id": string,
        "videoFile": string,
        "thumbnail": string,
        "owner": {
            "_id": string,
            "username": string,
            "fullName":string,
            "avatar": string
        },
        "title": string,
        "description": string,
        "duration": number,
        "views": number,
        "isPublished": true,
        "createdAt": string,
        "updatedAt": string,
        "__v": number
    },
    "watchedOn": string
}

interface watchHistoryResponse{
    "statusCode": number
    "data": watchHistoryVideoType[]
    "message": string,
    "success": number
}

interface sortWatchHistoryType{
  today:watchHistoryVideoType[],
  yesterday:watchHistoryVideoType[],
  remaining:{
    [key:string]:watchHistoryVideoType[]
  }
}

const History:React.FC = () => {

  const [sortWatchHistory,setSortWatchHistory] = useState<sortWatchHistoryType>()

  useEffect(()=>{
    fetchHistory()
  },[])

  async function fetchHistory(){
    try {
      const request = await axios.get<watchHistoryResponse>(`${host}/api/v1/users/history`,{
        withCredentials:true,
      })
      if(request.status===200){
        //setWatchHistory(request.data)
        sortHistory(request.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function sortHistory(par:watchHistoryResponse) {

    let globalArr:sortWatchHistoryType = {
      today:[],
      yesterday:[],
      remaining:{}
    }
    let arr = par.data

    for(let i=0;i<arr.length;i++){
      const dateFlag = dateAgo(arr[i]?.watchedOn)
      if(dateFlag==='Today'){
        globalArr.today.push(arr[i])
      }else if(dateFlag==='Yesterday'){
        globalArr.yesterday.push(arr[i])
      }else{
        if(!globalArr.remaining[dateFlag]){
          globalArr.remaining[dateFlag] = []
        }
          globalArr.remaining[dateFlag].push(arr[i])
      }
      }

      setSortWatchHistory(globalArr)
    }

  return (
    <div>
      <div className='w-[100%] mx-auto bg-[rgba(0,0,0,0.9)]'>
      <SectionHeader title="Watch History" size="text-lg md:text-xl" />
      <div className='w-[96%] mx-auto py-4'>
        <div className='w-[100%]'>
          {(sortWatchHistory&&sortWatchHistory.today.length!==0)&&<SectionHeader title="Today" size="text-base md:text-lg" />}
          {(sortWatchHistory&&sortWatchHistory.today.length!==0)&&<div>
          {sortWatchHistory.today.map((par,index)=>{
            return<Link to={`/v/${par.video._id}`} key={index} className='w-[100%]'>
              <VideoCard_v2 data={par.video} />
            </Link>
          })}
          </div>}
          </div>

          <div className='w-[100%]'>
          {(sortWatchHistory&&sortWatchHistory.yesterday.length!==0)&&<SectionHeader title="Yesterday" size="text-base md:text-lg" />}
          {(sortWatchHistory&&sortWatchHistory.yesterday.length!==0)&&<div>
          {sortWatchHistory.yesterday.map((par,index)=>{
            return<Link to={`/v/${par.video._id}`} key={index} className='w-[100%]'>
              <VideoCard_v2 data={par.video} />
            </Link>
          })}
          </div>}
          </div>

          <div className='w-[100%]'>
          {(sortWatchHistory)&&
            Object.entries(sortWatchHistory.remaining).map(([label,arr])=>(
              <div key={label}>
                <SectionHeader title={label} size="text-base md:text-lg" />
                {arr&&arr?.map((par)=>{
                  return<Link to={`/v/${par.video._id}`} key={par._id}>
                    <VideoCard_v2 data={par.video} />
                  </Link>
                })}
              </div>
            ))
          }
          </div>
          
      </div>
      </div>
    </div>
  )
}

export default History;
