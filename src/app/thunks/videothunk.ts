import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { host } from '../../Constants.ts';
import { RootState } from '../store/store.ts';


export const saveTheVideo = createAsyncThunk(
    "video/saveVideo",
    async(videoId:string|unknown,{getState,rejectWithValue})=>{
        try{
            const state = getState() as RootState;
            const token = state.user.accessToken;
            
            const req = await axios.get(`${host}/api/v1/videos/${videoId}`,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            const video = req.data.data;

            const channerlRes=await axios.get(
                `${host}/api/v1/subscriptions/s/${video.owner._id}`,
                {  withCredentials:true,
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )

            return {
                video,
                subscribers:channerlRes.data.data
            }

        }catch(err){
            return rejectWithValue(err?.message||"failed to fetch video")
        }
    }
)
