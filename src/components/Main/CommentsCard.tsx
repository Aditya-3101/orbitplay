import React from 'react';
import { timeAgo } from '../../utility/timeStamp.ts';
import { Heart } from 'lucide-react';
import { api } from '../../api/AxiosInterceptor.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch} from "../../app/store/store.ts"
import {updateIsLikedBy} from '../../app/slices/postSlice.ts'
import {toggleCommentLikes} from '../../app/slices/videoSlice.ts'

interface CommentLikeType{
    "_id": string,
    "likedBy": string
}

interface commentsInterfaceDocs {
    par:
    {
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
    },
    post:{
        "_id": string,
        "content": string,
        "createdAt": string,
        "likeCount": number,
        "isLiked": boolean,
        "avatar": string,
        "username": string
    }
}

export const CommentsCard = (props) => {
    const {par,post} = props as commentsInterfaceDocs
    const dispatch = useDispatch<AppDispatch>()

    async function toggleLike(){
        try {
            const request = await api.post(`/likes/toggle/t/${post._id}`)
            if(request.status===200) {
                dispatch(updateIsLikedBy(post._id))
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function toggleCommentLike(){
        try {
            const request = await api.post(`/likes/toggle/c/${par._id}`,{})
            if(request.status===200) {
                dispatch(toggleCommentLikes(par._id))
            }
        } catch (error) {
            console.log(error)
        }
    }
    

  return (
    <div>
        {par&&<div className='postcontainer place-content-center border-b border-[rgba(0,0,0,0.5)] p-1.5 md:w-[90%]'>
                   <div className='flex items-center justify-center userAvatar'>
                    <img src={par.owner.avatar} className='aspect-square w-[1.5rem] object-cover' />
                   </div>
                    <p className='flex justify-between username'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{par.owner.username}</span>
                        
                    </p>
                    <p className='text-sm text-[#f1f1f1d0] lastupdated'>{timeAgo(par.createdAt)}</p>
                    <p className='blank'></p>
                    <p className='text-base text-[#f1f1f1] font-roboto userContent'>{par.comment}</p>
                    <div className='flex flex-col items-end justify-center postReactions'>
                        <p className='text-center text-sm'>
                        <span className='cursor-pointer' onClick={toggleCommentLike}>{par?.isLiked===true?<Heart fill='red' />:<Heart className='text-gray-600' />}</span>
                        <span className='text-gray-600'>{par.commentLikeCount}</span>
                        </p>
                    </div>
        </div>}
        {post&&<div className='place-content-center border-b border-gray-600 p-1.5 md:w-[100%] postcontainer'>
                   <div className='flex items-center justify-center userAvatar'>
                    <img src={post.avatar} className='aspect-square w-[80%] md:w-[2.5rem] object-cover' />
                   </div>
                    <p className='flex justify-between username'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{post.username}</span>
                    </p>
                    <p className='text-sm text-[#f1f1f1d0] lastupdated'>{timeAgo(post.createdAt)}</p>
                    <i className='blank'></i>
                    <p className='text-base md:text-xl text-[#f1f1f1] font-roboto userContent'>{post.content}</p>
                    <div className='flex flex-col items-end justify-center postReactions'>
                        <p className='text-center text-sm'>
                        <span className='cursor-pointer' onClick={toggleLike}>{post.isLiked===true?<Heart fill='red' />:<Heart className='text-gray-600' />}</span>
                        <span className='text-gray-600'>{post.likeCount}</span>
                        </p>
                    </div>
        </div>}
    </div>
  )
}
