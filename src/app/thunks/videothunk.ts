import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/AxiosInterceptor.ts';

export const saveTheVideo = createAsyncThunk(
    "video/saveVideo",
    async(videoId:string|unknown,{getState,rejectWithValue})=>{
        try{            
            const req = await api.get(`/videos/${videoId}`)
            const video = req.data.data;

            const channerlRes=await axios.get(
                `/subscriptions/s/${video.owner._id}`
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

