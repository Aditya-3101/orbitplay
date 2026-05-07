import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { api } from "../../api/AxiosInterceptor";

interface ChannelVideoOwner {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  }
  
  interface ChannelVideo {
    _id: string;
    videoFile: string;
    thumbnail: string;
    owner: ChannelVideoOwner;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface ChannelVideosData {
    allVideos: ChannelVideo[];
    allVideoCount: number;
    page: number;
    limit: number;
  }
  
  interface GetChannelVideosResponse {
    statusCode: number;
    data: ChannelVideosData;
    message: string;
    success: number;
  }

export const getChannelDetails = createAsyncThunk(
    "channel/channelDetails",
    async({userId,username}:{userId?:string|unknown,username?:string|unknown},{getState,rejectWithValue})=>{
        try {
            const state = getState() as RootState;
            const token = state.user.accessToken;

            let finalUserId = userId

            if(!finalUserId && username){

            const channelUser = await api.get(`/users/c/${username}`,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })


            const channelUserDetails = channelUser.data.data
            finalUserId = channelUserDetails._id;
            var userDetails = channelUserDetails
           }

           if (!finalUserId) {
            throw new Error("No userId or username provided");
          }

            const userPlaylists = await api.get(`/playlist/user/${finalUserId}`,
            {  withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            return {
                channelUserDetails:userDetails,
                userPlaylist:userPlaylists.data.data
            }

        } catch (err) {
            return rejectWithValue(err?.message||"failed to fetch Account Data")
        }
    }
)

export const getChannelVideos = createAsyncThunk(
    "channel/channelVideos",
    async({pageNum,userId}:{pageNum:number,userId:string},{getState,rejectWithValue})=>{
        try {
            const req = await api.get<GetChannelVideosResponse>(`/videos/channel?page=${pageNum}&userId=${userId}`)
            return req.data;
        } catch (error) {
            return rejectWithValue(error?.message||"failed to fetch channel videos")
        }
    }
)