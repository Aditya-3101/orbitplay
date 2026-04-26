import { createSlice } from "@reduxjs/toolkit";
import {getChannelDetails} from '../thunks/channelThunk.ts';


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

interface channelVideoInterface{
    allVideoCount:number,
    allVideos:{
        _id:string,
        createdAt: string,
        description:string,
        duration:number
        isPublished:boolean,
        owner:string,
        thumbnail:string,
        title:string,
        updatedAt:string,
        videoFile:string,
        views:number,
        __v:number
    }[],
    limit:number,
    page:number
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
    channelVideos:channelVideoInterface|null;
    channelPlaylist:channelPlaylistInterface[]|null;
    loading:boolean;
    error:string|unknown
}

const initialState:channelDataInterface = {
    channelUserDetail:null,
    channelVideos:null,
    channelPlaylist:null,
    loading:true,
    error:''
}

export const channelDetailSlice = createSlice({
    name:"channel",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(getChannelDetails.pending,(state)=>{
            state.loading=true,
            state.error=null;
        })
        .addCase(getChannelDetails.fulfilled,(state,action)=>{
            state.channelUserDetail=action.payload.channelUserDetails;
            state.channelVideos=action.payload.userVideos;
            state.channelPlaylist=action.payload.userPlaylist;
            state.loading=false;
        })
        .addCase(getChannelDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    }
})

export default channelDetailSlice.reducer;