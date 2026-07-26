import { createSlice } from "@reduxjs/toolkit";
import {getChannelDetails, getChannelVideos,getChannelPlaylist,getChannelPosts} from '../thunks/channelThunk.ts';

interface channelUserDetailsInterface{
    "_id": string,
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

interface channelPostsType{
    statusCode: number,
    data:{
            _id: string,
            content: string,
            createdAt: string,
            likeCount: number,
            isLiked: boolean,
            avatar: string,
            username: string,
            owner:{
                _id:string
            }
        }[],
    message: string,
    success: number
}

interface channelDataInterface {
    channelUserDetail:channelUserDetailsInterface|null
    channelVideos:GetChannelVideosResponse|null;
    channelVideosLoading:boolean;
    hasMoreChannelVideos:boolean;
    channelPlaylistError:unknown|string;
    channelPlaylist:channelPlaylistInterface[]|null;
    channelPosts: channelPostsType | null;
    loading:boolean;
    error:string|unknown
}

const initialState:channelDataInterface = {
    channelUserDetail:null,
    channelVideos:null,
    channelVideosLoading:false,
    hasMoreChannelVideos:false,
    channelPlaylistError:'',
    channelPlaylist:null,
    channelPosts:null,
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
        },
        resetChannelVideos:(state)=>{
            state.channelVideos=null;
            state.channelVideosLoading=false;
            state.hasMoreChannelVideos=false;
        },
        resetChannelUser:(state)=>{
            state.channelUserDetail=null;
        },
        toggleChannelSubscription:(state,action)=>{
            if(typeof state.channelUserDetail?.isSubscribed==="boolean"&&state.channelUserDetail.isSubscribed!==undefined){
             state.channelUserDetail.isSubscribed=action.payload
            }
            // console.log(state.channelUserDetail?.isSubscribed)
            // let currentSubscriptionDetail=state.channelUserDetail?.isSubscribed
            // if (state.channelUserDetail?.isSubscribed!==undefined&&currentSubscriptionDetail!==undefined) state.channelUserDetail.isSubscribed=action.payload
        }
    },
    extraReducers(builder){
        builder.addCase(getChannelDetails.pending,(state)=>{
            state.loading=true,
            state.error=null;
        })
        .addCase(getChannelDetails.fulfilled,(state,action)=>{
            state.channelUserDetail=action.payload.channelUserDetails;
            // state.channelPlaylist=action.payload.userPlaylist;
            state.loading=false;
            state.error=null;
        })
        .addCase(getChannelDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getChannelPlaylist.fulfilled,(state,action)=>{
            state.channelPlaylist=action.payload?.userPlaylist
        })
        .addCase(getChannelPlaylist.rejected,(state,action)=>{
            state.channelPlaylistError=action.payload;
        })
        .addCase(getChannelVideos.fulfilled,(state,action)=>{
            state.hasMoreChannelVideos= (action.payload.data.limit*action.payload?.data.page)<action.payload?.data.allVideoCount;
            if(state.channelVideos===null||state.channelVideos.data.allVideos.length===0){
            state.channelVideos=action.payload;
            }else{
                const existingId = new Set(state.channelVideos.data.allVideos.map(v=>v._id))
                const filtered = action.payload.data.allVideos.filter(v=>!existingId.has(v._id))
                // console.log(filtered)
                state.channelVideos.data.allVideos.push(...filtered);
                // state.channelVideos = { ...action.payload, data: { ...action.payload.data, allVideos: [ ...state.channelVideos.data.allVideos, ...filtered ] } };
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
        })

        .addCase(getChannelPosts.pending,(state)=>{
            state.channelPosts=null
        })
        .addCase(getChannelPosts.fulfilled,(state,action)=>{
            state.channelPosts=action.payload;
        })
        .addCase(getChannelPosts.rejected,(state)=>{
            state.channelPosts=null;
        })
    }
})

export const {updateVideoVisibility,deleteVideo,resetChannelVideos,resetChannelUser,toggleChannelSubscription} = channelDetailSlice.actions

export default channelDetailSlice.reducer;