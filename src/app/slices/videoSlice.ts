import { createSlice } from "@reduxjs/toolkit";
import { saveTheVideo } from "../thunks/videothunk.ts";

interface videoInterface{
    _id:string,
    __v:number,
    views:number,
    videoFile:string,
    updatedAt:string,
    title:string,
    thumbnail:string,
    owner:{
        _id:string,
        username:string,
        avatar:string
    },
    isPublished:boolean,
    duration:number,
    description:string,
    createdAt:string
}

interface initialStateInterface{
    video:videoInterface|null;
    loading:boolean,
    error:string|unknown,
    subscribers:number
}

const initialState:initialStateInterface = {
    video:{
    _id:'',
    __v:0,
    views:0,
    videoFile:'',
    updatedAt:'',
    title:'',
    thumbnail:'',
    owner:{
        _id:'',
        username:'',
        avatar:''
    },
    isPublished:true,
    duration:0,
    description:'',
    createdAt:''
},
loading:true,
error:'',
subscribers:0
}

export const videoDetailSlice = createSlice({
    name:"video",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder.addCase(saveTheVideo.pending,(state)=>{
            state.loading=true,
            state.error=null;
        })
        .addCase(saveTheVideo.fulfilled,(state,action)=>{
            const videoDetails = {
                _id:action.payload.video._id,
                __v:action.payload.video.__v,
                views:action.payload.video.views,
                videoFile:action.payload.video.videoFile,
                updatedAt:action.payload.video.updatedAt,
                title:action.payload.video.title,
                thumbnail:action.payload.video.thumbnail,
                owner:{
                    _id:action.payload.video.owner._id,
                    username:action.payload.video.owner.username,
                    avatar:action.payload.video.owner.avatar
                },
                isPublished:action.payload.video.isPublished,
                duration:action.payload.video.duration,
                description:action.payload.video.description,
                createdAt:action.payload.video.createdAt
            }
            state.loading=false,
            state.video=videoDetails;
            state.subscribers=action.payload.subscribers
        })
        .addCase(saveTheVideo.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })
    },
})

//export const {addVideoDetails} = videoDetailSlice.actions

export default videoDetailSlice.reducer;