import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../app/store/store'
import { AccountTabs } from './AccountTabs'
import type {AppDispatch} from '../../app/store/store.ts';
import { useParams } from 'react-router';
import {getChannelDetails} from '../../app/thunks/channelThunk.ts'
import axios from 'axios';
import { host } from '../../Constants.ts';



const Account:React.FC = () => {
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const channelData = useSelector((state:RootState)=>state.channel)
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)
    const [subscribeStatus,setSubscribeStatus] = useState()
    const dispatch = useDispatch<AppDispatch>()
    const params = useParams();

    useEffect(()=>{
        if(params.channelName) {
            dispatch(getChannelDetails({userId:'',username:params.channelName}))
        }else{
            dispatch(getChannelDetails({userId:user?._id,username:''}))
        }
    },[subscribeStatus])

    const currentUser = params.channelName ? channelData.channelUserDetail : user;

    
    async function toggleSubscription(par1:string,par2:string){
        try {
            const request = await axios.post(`${host}/api/v1/subscriptions/c/${par1}`,
            {},
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })

            if(request.status===200) {
                setSubscribeStatus(request.data.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
        <section className='bg-[rgba(0,0,0,0.95)]'>
            <div className='relative'>
                <img src={currentUser?.coverImage} className='aspect-[16/6] object-cover w-[100%] md:w-[96%] md:aspect-[16/4] md:mx-auto' />
            </div>
            <section className='grid grid-cols-[35%_65%] md:grid-cols-[30%_70%] px-4 py-6 md:w-[100%] mx-auto'>
            <div className=''>
                    <img src={currentUser?.avatar} className='aspect-square rounded-full w-[100%] md:w-[60%] md:mx-auto object-cover' />
            </div>
            <div className='w-[90%] mx-auto '>
                <p className='text-gray-100 font-roboto text-2xl text-clip md:text-5xl my-1'>{currentUser?.fullName}</p>
                <p className='font-roboto text-gray-400 text-sm md:text-xl'>@{currentUser?.username}</p>
                <p className='py-4 flex items-center justify-between md:w-[60%]'>
                    <span>
                    {currentUser && "subscribersCount" in currentUser && (
                    <p className='font-roboto text-gray-400 text-sm md:text-2xl'>{currentUser.subscribersCount} Subscribers</p>
                    )}
                    </span>
                    <span className=''>
                        {currentUser && "isSubscribed" in currentUser && (
                            <button className={`font-roboto text-gray-400 text-sm ${currentUser.isSubscribed?
                            "border border-gray-300 p-2 my-2 rounded":"bg-red-500 p-2 my-2 text-gray-950 rounded"} md:text-2xl`} onClick={()=>toggleSubscription(currentUser._id,currentUser.username)}>
                                {currentUser.isSubscribed?"Subscribed":"Subscribe"}
                            </button>
                        )}
                    </span>
                </p>
            </div>
            </section>
        </section>
        {channelData!==undefined&&<AccountTabs data={channelData} />}
    </div>
  )
}

export default Account;
