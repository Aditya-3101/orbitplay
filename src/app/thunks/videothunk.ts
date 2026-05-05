import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/AxiosInterceptor.ts';

export const saveTheVideo = createAsyncThunk(
    "video/saveVideo",
    async(videoId:string|unknown,{getState,rejectWithValue})=>{
        try{            
            const req = await api.get(`/videos/${videoId}`)
            const video = req.data.data;

            let channerlRes

            if(video){
            const commentReq=await api.get(
                `/subscriptions/s/${video.owner._id}`
            )
            if(commentReq.status===200) channerlRes = commentReq
            }

            return {
                video,
                subscribers:channerlRes.data.data||0
            }

        }catch(err){
            console.log(err)
            return rejectWithValue(err?.message||"failed to fetch video")
        }
    }
)

