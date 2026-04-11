import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { host } from '../../Constants';
import { SectionHeader } from '../Header/sectionHeader.tsx';

interface userSubscriptionsInterface{
    "_id": string,
    "subscribedTo": [
        {
            "_id": string,
            "username": string,
            "email": string,
            "fullName": string,
            "avatar": string,
            "coverImage": string,
        }
    ]
}



const Subscriptions:React.FC = () => {
    const {accessToken, userTemp} = useSelector((state:RootState)=>state.user)
    const [userSubscriptions,setUserSubscriptions] = useState<userSubscriptionsInterface>()
    const [videosFromChannel,setVideosFromChannel] = useState()


    useEffect(()=>{
        fetchSubscribedChannels()
    },[])

    useEffect(()=>{

       if(userSubscriptions!==null&&userSubscriptions!==undefined) fetchVideosFromSubscribedChannels(userSubscriptions.subscribedTo[0]._id)

    },[userSubscriptions])

    
    async function fetchVideosFromSubscribedChannels(params:string) {
        try {
            const req = await axios.get(`${host}/api/v1/videos/subscriptions/v/${params}`,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(req.status===200) setVideosFromChannel(req.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(videosFromChannel)



    async function fetchSubscribedChannels() {
        try {
            const req = await axios.get(`${host}/api/v1/subscriptions/c/${userTemp?._id}`,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(req.status===200){
                setUserSubscriptions(req.data.data)
            }
        } catch (error) {
            console.log(error)   
        }
    }


  return (
    <div>
        <main className='bg-[rgba(0,0,0,0.95)]'>
            <SectionHeader title="Subscriptions" size="text-lg md:text-xl" />
            <div className='h-[7rem] relative flex overflow-x-auto px-2'>
            {userSubscriptions&&userSubscriptions.subscribedTo.map((param,index)=>{
                return<div key={index} className='h-[4.5rem] w-[5rem]'>
                    <div className='flex flex-col items-center justify-center'>
                        <img src={param.avatar} className='aspect-square rounded-full object-cover w-[100%]' />
                        <p className='font-roboto text-gray-200'>{param.fullName}</p>
                    </div>
                </div>
            })}
            </div>
            <section>
                <div>
                </div>
            </section>
        </main>
    </div>
  )
}

export default Subscriptions;
