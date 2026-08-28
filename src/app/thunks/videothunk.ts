import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/AxiosInterceptor.ts';

export const saveTheVideo = createAsyncThunk(
    "video/saveVideo",
    async(videoId:string|unknown,{getState,rejectWithValue})=>{
        try{            
            const req = await api.get(`/videos/${videoId}`)
            const video = req.data.data;

            return {
                video
            }

        }catch(err){
            console.log(err)
            return rejectWithValue(err?.message||"failed to fetch video")
        }
    }
)

