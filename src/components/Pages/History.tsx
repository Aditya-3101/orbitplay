import React,{useEffect, useState} from 'react';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';
import { dateAgo } from '../../utility/timeStamp.ts';
import { Link } from 'react-router';
import { api } from '../../api/AxiosInterceptor.ts';
import VideoCard_v2_skeleton from '../Main/VideoCard_v2_skeleton.tsx';
import { ErrorPage } from './ErrorPage.tsx';
import { emptyArr } from '../../utility/emptyArrays.ts';
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
  const [checkIfEmpty,setCheckIfEmpty] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState<null|string>(null)

  useEffect(()=>{
    fetchHistory()
  },[])

  async function fetchHistory(){
    setLoading(true)
    try {
      const request = await api.get<watchHistoryResponse>(`/users/history`)
      if(request.status===200){
        //setWatchHistory(request.data)
        if(request.data.data.length!==0) {
          sortHistory(request.data)
        }else{
          setCheckIfEmpty(true)
        }
        setLoading(false)
        setError(null)
      }
    } catch (err) {
      setError(err?.message)
      setLoading(false)
    }
  }

  if(error!==null){
    return<ErrorPage msg="Watch history"/>
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
      {checkIfEmpty&&<div className='flex justify-center items-center h-[6rem] md:h-[15rem]'>
        <p className='text-gray-500 text-lg font-roboto'>No Watch history found</p>
        </div>}
        {loading&&(emptyArr.map((par)=>{
          return<div key={par.id} className='p-2'><VideoCard_v2_skeleton /></div>
        }))}
      </div>
    </div>
  )
}

export default History;
