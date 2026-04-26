import React from 'react';
import { timeAgo } from '../../utility/timeStamp.ts';
import { Heart } from 'lucide-react';
import { api } from '../../api/AxiosInterceptor.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch} from "../../app/store/store.ts"
import {updateIsLikedBy} from '../../app/slices/postSlice.ts'

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
        "createdAt": string
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
    

  return (
    <div>
        {par&&<div className='grid grid-cols-[10%_90%] place-content-center border-b border-[rgba(0,0,0,0.5)] p-1.5 md:w-[90%]'>
                   <div className='flex items-center justify-center'>
                    <img src={par.owner.avatar} className='aspect-square w-[1.5rem] object-cover' />
                   </div>
                    <p className='flex justify-between'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{par.owner.username}</span>
                        <span className='text-sm text-[#f1f1f1d0]'>{timeAgo(par.createdAt)}</span>
                    </p>
                    <p></p>
                    <p className='text-base text-[#f1f1f1] font-roboto'>{par.comment}</p>
        </div>}
        {post&&<div className='grid grid-cols-[10%_90%] place-content-center border-b border-gray-600 p-1.5 md:w-[90%]'>
                   <div className='flex items-center justify-center'>
                    <img src={post.avatar} className='aspect-square w-[1.5rem] md:w-[2.5rem] object-cover' />
                   </div>
                    <p className='flex justify-between'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{post.username}</span>
                        <span className='text-sm text-[#f1f1f1d0]'>{timeAgo(post.createdAt)}</span>
                    </p>
                    <p></p>
                    <p className='text-base md:text-xl text-[#f1f1f1] font-roboto'>{post.content}</p>
                    <p></p>
                    <div className='flex flex-col items-end justify-center'>
                        <p className='text-center text-sm'>
                        <span className='cursor-pointer' onClick={toggleLike}>{post.isLiked===true?<Heart fill='red' />:<Heart className='text-gray-600' />}</span>
                        <span className='text-gray-600'>{post.likeCount}</span>
                        </p>
                    </div>
        </div>}
    </div>
  )
}
