import { createSlice } from "@reduxjs/toolkit";
import {getUserPosts} from '../thunks/postThunk.ts'

interface userPostDataType{
    _id: string,
    content: string,
    createdAt: string,
    likeCount: number,
    isLiked: boolean,
    avatar: string,
    username: string
}

interface userPostResponseType{
    "statusCode": number|null,
    "data": userPostDataType[]|null,
    "message": string|null,
    "success": number|null
}

const initialState:userPostResponseType = {
    statusCode:null,
    data:null,
    message:null,
    success:null
}

export const userPostsDetail = createSlice({
    name:"post",
    initialState,
    reducers:{
        updateIsLikedBy:(state,action)=>{
            const postId = action.payload

            if (state.data) {
              const post = state.data.find(p => p._id === postId)
          
              if (post) {
                post.isLiked = !post.isLiked;
                post.likeCount = post.isLiked
                  ? post.likeCount + 1
                  : post.likeCount - 1
              }
            }
        },
        deletePostById:(state,action)=>{
            const postId = action.payload
            if(state.data){
                const filtered = state.data.filter(v=>v._id!==postId)
                state.data=filtered;
            }
        },
        updateUserPost:(state,action)=>{
            const updatedPost = action.payload;

            if (state.data) {
              const post = state.data.find(p => p._id === updatedPost._id)
          
              if (post) {
                post.content = updatedPost.content;
                post.createdAt = updatedPost.createdAt;
              }
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(getUserPosts.pending,(state)=>{
            state.data=null,
            state.statusCode=null
            state.message=null
            state.success=null
        })
        .addCase(getUserPosts.fulfilled,(state,action)=>{
            state.statusCode=action.payload.statusCode,
            state.data=action.payload.data,
            state.message=action.payload.message,
            state.success=action.payload.success
        })
        .addCase(getUserPosts.rejected,(state,action)=>{
            state.statusCode=500,
            state.data=null,
            state.message="failed to fetch user posts",
            state.success=null
        })
    },
})

export const {updateIsLikedBy,deletePostById,updateUserPost} = userPostsDetail.actions

export default userPostsDetail.reducer;