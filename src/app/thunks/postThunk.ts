import { api } from "../../api/AxiosInterceptor.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserPosts = createAsyncThunk(
    "post/userPostDetails",
    async(userId:string|unknown,{getState,rejectWithValue})=>{
        try {
            const request = await api.get(`/tweets/user/${userId}`)

            if(request.status===200) return request.data

        } catch (error) {
            return rejectWithValue(error?.message||"failed to fetch user posts")
        }
    }
    )