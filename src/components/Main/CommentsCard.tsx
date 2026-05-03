import React, { useState } from 'react';
import { timeAgo } from '../../utility/timeStamp.ts';
import { EllipsisVertical, Heart, Pencil, Trash } from 'lucide-react';
import { api } from '../../api/AxiosInterceptor.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState} from "../../app/store/store.ts"
import {updateIsLikedBy,deletePostById} from '../../app/slices/postSlice.ts'
import {toggleCommentLikes,deleteCommentById} from '../../app/slices/videoSlice.ts'
import { messageModal } from '../../app/slices/toggleSlice.ts';

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
    },
    onEdit:Function
}

export const CommentsCard = (props) => {
    const {par,post,onEdit} = props as commentsInterfaceDocs
    const dispatch = useDispatch<AppDispatch>()
    const [options,setOptions] = useState<boolean>(false)
    const currentUser = useSelector((state:RootState)=>state.user.userTemp?._id)

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

    const toggleOptions=()=>{
        setOptions(!options)
    }

    const deletePost = async(postId:string) =>{
        try {
            const request = await api.delete(`/tweets/${postId}`)
            if(request.status===200) {
                dispatch(deletePostById(postId))
                dispatch(messageModal("Post deleted successfully"))
            }
        } catch (error) {
            dispatch(messageModal("Something went wrong while deleting post"))
        }
    }

    const deleteComment = async(commentId:string) =>{
        try {
            const request = await api.delete(`/comments/c/${commentId}`)
            if(request.status===200) {
                dispatch(deleteCommentById(commentId))
            }
        } catch (error) {
            dispatch(messageModal("Something went wrong while deleting comment"))
        }
    }
    
    console.log(par);
    
  return (
    <div>
        {par&&<div className='postcontainer place-content-center border-b border-[rgba(0,0,0,0.5)] p-1.5 md:w-[90%]'>
                   <div className='flex items-center justify-center userAvatar'>
                    {par.owner.avatar!==undefined&&<img src={par.owner.avatar} className='aspect-square w-[1.5rem] object-cover' />}
                   </div>
                    <p className='flex justify-between username'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{par.owner.username}</span>
                        
                    </p>
                    <div className='text-sm text-[#f1f1f1d0] lastupdated flex justify-end gap-1 items-center h-min relative'>
                        <span>{timeAgo(par.createdAt)}</span>
                    {currentUser===par.owner._id&&<div className='blank relative'>
                        <EllipsisVertical color="rgba(240,240,240)" className='cursor-pointer w-[16px] h-[16px]lg:w-[20px] lg:h-[20px]' onClick={toggleOptions} />
                        {options&&<section className='absolute top-[110%] right-[100%] border border-gray-600 flex flex-col items-start px-1 bg-[rgb(0,0,0)]'>
                        <p className='flex items-center gap-1' onClick={()=>onEdit(par)}><Pencil className='w-[12px] h-[12x]' />Edit</p>
                        <p onClick={()=>deleteComment(par._id)} className='flex items-center gap-1'><Trash className='w-[12px] h-[12x]' />Delete</p>
                    </section>}
                    </div>}</div>
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
                    <div className='text-sm text-[#f1f1f1d0] lastupdated flex justify-end gap-1 items-center h-min relative'>
                        <span>{timeAgo(post.createdAt)}</span>
                    <div className='blank relative'>
                        <EllipsisVertical color="rgba(240,240,240)" className='cursor-pointer w-[16px] h-[16px]lg:w-[20px] lg:h-[20px]' onClick={toggleOptions} />
                        {options&&<section className='absolute top-[110%] right-[100%] border border-gray-600 flex flex-col items-start px-1 bg-[rgb(0,0,0)]'>
                        <p className='flex items-center gap-1' onClick={()=>onEdit(post)}><Pencil className='w-[12px] h-[12x]' />Edit</p>
                        <p onClick={()=>deletePost(post._id)} className='flex items-center gap-1'><Trash className='w-[12px] h-[12x]' />Delete</p>
                    </section>}
                    </div>
                    </div>
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
