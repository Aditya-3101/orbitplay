import { createSlice } from "@reduxjs/toolkit";
import { saveTheVideo } from "../thunks/videothunk.ts";
import { getVideoComments } from "../thunks/CommentThunk.ts";

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

interface CommentLikeType{
    "_id": string,
    "likedBy": string
}
interface commentsInterfaceDocs {
    "_id": string,
    "comment": string,
    "owner": {
        _id:string,
        username:string,
        avatar:string
    },
    "createdAt": string,
    "comment_likes": CommentLikeType[],
    "commentLikeCount": number,
    "isLiked": boolean
}
interface commentInterface{
    "data": {
        "docs": commentsInterfaceDocs[],
        "totalDocs": number,
        "limit": number,
        "page": number,
        "totalPages": number,
        "pagingCounter": number,
        "hasPrevPage": boolean,
        "hasNextPage": boolean,
        "prevPage": null|unknown,
        "nextPage": null|unknown
    },
}
interface initialStateInterface{
    video:videoInterface|null;
    loading:boolean,
    loadingComments:boolean,
    loadingVideoId:unknown|null,
    hasMoreComments:boolean,
    comments:commentInterface|null;
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
comments:null,
loadingComments:true,
hasMoreComments:false,
loading:true,
loadingVideoId:'',
error:'',
subscribers:0
}

export const videoDetailSlice = createSlice({
    name:"video",
    initialState,
    reducers:{
        toggleCommentLikes:(state,action)=>{
            const selectedComment = state.comments?.data.docs.find(c=>c._id===action.payload);
            if (selectedComment){
                selectedComment.isLiked=!selectedComment.isLiked;
                selectedComment.commentLikeCount=selectedComment.isLiked?selectedComment.commentLikeCount+1:selectedComment.commentLikeCount-1;
            }
        },
        updateUserComment:(state,action)=>{
            const updatedComment = action.payload
            if (state.comments) {
              const userComment = state.comments?.data?.docs?.find(p => p._id === updatedComment._id)
              if (userComment) {
                userComment.comment = updatedComment.comment;
                userComment.createdAt = updatedComment.createdAt;
              }
            }
        },
        deleteCommentById:(state,action)=>{
            const commentId = action.payload
            if(state.comments!==undefined&&state.comments!==null){
                const filtered = state.comments?.data.docs.filter(v=>v._id!==commentId)
                if(filtered!==undefined&&filtered!==null){
                state.comments.data.docs=filtered;
                }
            }
        },
        addComment:(state,action)=>{
            state.comments?.data.docs.push(action.payload)
        }
    },
    extraReducers(builder) {
        builder.addCase(saveTheVideo.pending,(state,action)=>{
            state.loading=true,
            state.error=null;
            state.loadingVideoId=action.meta.arg
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
            state.loadingVideoId=null

        })
        .addCase(saveTheVideo.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.loadingVideoId=null
        })

        .addCase(getVideoComments.pending,(state,action)=>{
            state.loadingComments=true
        })

        .addCase(getVideoComments.rejected,(state,action)=>{
            state.comments=null;
            state.loadingComments=false
        })

        .addCase(getVideoComments.fulfilled,(state,action)=>{
            state.loadingComments=false
            state.hasMoreComments= (action.payload.data.limit*action.payload?.data.page)<action.payload?.data.totalDocs
            state.comments=action.payload
        })
    },
})

export const {toggleCommentLikes,updateUserComment,deleteCommentById,addComment} = videoDetailSlice.actions

//export const {addVideoDetails} = videoDetailSlice.actions

export default videoDetailSlice.reducer;