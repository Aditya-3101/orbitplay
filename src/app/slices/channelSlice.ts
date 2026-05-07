import { createSlice } from "@reduxjs/toolkit";
import {getChannelDetails, getChannelVideos} from '../thunks/channelThunk.ts';

interface channelUserDetailsInterface{
    "_id": string
    "username": string,
    "email": string,
    "fullName": string,
    "avatar": string,
    "coverImage": string,
    "subscribersCount": number
    "channelSubscribedToCount": number
    "isSubscribed":boolean
}

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


interface channelPlaylistInterface {
    _id:string,
    name:string,
    description:string,
    videos:[],
    owner:string,
    __v:number,
}

interface channelDataInterface {
    channelUserDetail:channelUserDetailsInterface|null
    channelVideos:GetChannelVideosResponse|null;
    channelVideosLoading:boolean;
    hasMoreChannelVideos:boolean;
    channelPlaylist:channelPlaylistInterface[]|null;
    loading:boolean;
    error:string|unknown
}

const initialState:channelDataInterface = {
    channelUserDetail:null,
    channelVideos:null,
    channelVideosLoading:false,
    hasMoreChannelVideos:false,
    channelPlaylist:null,
    loading:true,
    error:''
}

export const channelDetailSlice = createSlice({
    name:"channel",
    initialState,
    reducers:{
        updateVideoVisibility:(state,action)=>{
            const updatedVisibility = action.payload
            if (state.channelVideos) {
              const userVideo = state.channelVideos.data.allVideos.find(p => p._id === updatedVisibility._id)
              if (userVideo) {
                userVideo.isPublished = action.payload.isPublished
              }
            }
        },
        deleteVideo:(state,action)=>{
            const selectedVideo = action.payload
            if (state.channelVideos!==undefined&&state.channelVideos!==null) {
              const userVideo = state?.channelVideos?.data.allVideos.filter(p => p._id !== selectedVideo)
              if (userVideo!==undefined&&userVideo!==null) {
                state.channelVideos.data.allVideos=userVideo;
              }
            }
        }
    },
    extraReducers(builder){
        builder.addCase(getChannelDetails.pending,(state)=>{
            state.loading=true,
            state.error=null;
        })
        .addCase(getChannelDetails.fulfilled,(state,action)=>{
            state.channelUserDetail=action.payload.channelUserDetails;
            state.channelPlaylist=action.payload.userPlaylist;
            state.loading=false;
            state.error=null;
        })
        .addCase(getChannelDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getChannelVideos.fulfilled,(state,action)=>{
            state.hasMoreChannelVideos= (action.payload.data.limit*action.payload?.data.page)<action.payload?.data.allVideoCount;
            if(state.channelVideos==null){
            state.channelVideos=action.payload;
            }else{
                const existingId = new Set(state.channelVideos.data.allVideos.map(v=>v._id))
                const filtered = action.payload.data.allVideos.filter(v=>!existingId.has(v._id))
                state.channelVideos.data.allVideos.push(...filtered);
            }
            state.channelVideosLoading=false;
        })
        .addCase(getChannelVideos.rejected,(state,action)=>{
            state.channelVideos=null
            state.channelVideosLoading=false;
            state.hasMoreChannelVideos=false
        })
        .addCase(getChannelVideos.pending,(state)=>{
            state.channelVideosLoading=true;
            state.hasMoreChannelVideos=false;
            state.channelVideos=null;
        })
    }
})

export const {updateVideoVisibility,deleteVideo} = channelDetailSlice.actions

export default channelDetailSlice.reducer;