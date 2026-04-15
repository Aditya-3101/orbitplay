import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { host } from '../../Constants';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import { VideoCard_v2 } from '../Main/VideoCard_v2.tsx';

interface userSubscriptionsInterface{
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
}

export interface SubscriptionGroup {
    _id: string; // subscriber id
    subscribedTo: userSubscriptionsInterface[];
  }

interface userSubscriptionsResponse
{
    statusCode: number, 
    data: SubscriptionGroup[], 
    message: string, 
    success: number
}

interface videoObjectResponse {
    "_id": string,
    "videoFile": string,
    "thumbnail": string,
    "owner": {
        "_id": string,
        "username": string,
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

interface videosFromChannelInterface{
    "statusCode": number,
    "data": videoObjectResponse[]
    "message": string,
    "success": number
}



const Subscriptions:React.FC = () => {
    const {userTemp} = useSelector((state:RootState)=>state.user)
    const [userSubscriptions,setUserSubscriptions] = useState<userSubscriptionsResponse>()
    const [videosFromChannel,setVideosFromChannel] = useState<videosFromChannelInterface>()
    const [defaultChannel,setDefaultChannel] = useState<string>()


    useEffect(()=>{
        fetchSubscribedChannels()
    },[])

    
    async function fetchVideosFromSubscribedChannels(params:string) {
        try {
            const req = await axios.get<videosFromChannelInterface>(`${host}/api/v1/videos/subscriptions/v/${params}`,
            {
                withCredentials:true,
            })
            if(req.status===200) {
                setVideosFromChannel(req.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchSubscribedChannels() {
        try {
            const req = await axios.get<userSubscriptionsResponse>(`${host}/api/v1/subscriptions/c/${userTemp?._id}`,
            {
                withCredentials:true,
            })
            if(req.status===200){
                setUserSubscriptions(req.data)
                fetchVideosFromSubscribedChannels(req.data.data[0].subscribedTo[0]._id)
                setDefaultChannel(req.data.data[0].subscribedTo[0]._id)
            }
        } catch (error) {
            console.log(error)   
        }
    }

    function onChangeChannel(id:string){
        setDefaultChannel(id)
        fetchVideosFromSubscribedChannels(id)
    }
    


  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.95)] relative'>
            <article className='w-[96%] mx-auto'>
            <SectionHeader title="Subscriptions" size="text-lg md:text-xl" />
            <div className='relative flex overflow-x-auto px-2 gap-4 border-b border-gray-400 py-2'>
            {userSubscriptions&&userSubscriptions.data[0].subscribedTo.map((param,index)=>{
                return<div key={index} className='h-[6.5rem] w-[5.4rem]'>
                    <div className='flex flex-col items-center justify-center' onClick={()=>onChangeChannel(param._id)}>
                        <img src={param.avatar} className={`aspect-square rounded-full object-cover w-[100%] ${defaultChannel===param._id?"outline-2 outline-gray-200":''}`} />
                        <p className='font-roboto text-gray-200'>{param.fullName}</p>
                    </div>
                </div>
            })}
            </div>
            <section>
                <div>
                    {videosFromChannel?.data.length!==0&&videosFromChannel?.data.map((par,index)=>{
                        return <div className='mx-auto w-[90%] py-2' key={index}>
                            <VideoCard_v2 data={par} />
                            </div>
                    })}
                    {videosFromChannel?.data.length==0&&<div className='font-roboto text-xl text-gray-200 text-center py-6'>No videos found :(</div>}
                </div>
            </section>
            </article>
        </main>
    </div>
  )
}

export default Subscriptions;
