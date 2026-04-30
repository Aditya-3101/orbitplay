import { api } from "../../api/AxiosInterceptor.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getVideoComments = createAsyncThunk(
    "video/videoCommentDetails",
    async(videoId:string|unknown,{getState,rejectWithValue})=>{
        try {
            const request = await api.get(`/comments/${videoId}`)

            if(request.status===200) return request.data

        } catch (error) {
            return rejectWithValue(error?.message||"failed to fetch video comments")
        }
    }
    )