import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store.ts'
import { CommentsCard } from '../Main/CommentsCard'
import { useDispatch } from 'react-redux'
import {getUserPosts} from '../../app/thunks/postThunk.ts'
import type { AppDispatch } from "../../app/store/store"
import { SectionHeader } from '../Header/sectionHeader.tsx'
import { messageModal } from '../../app/slices/toggleSlice.ts'
import { api } from '../../api/AxiosInterceptor.ts'

const Posts = () => {

    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch= useDispatch<AppDispatch>()
    const userPosts = useSelector((state:RootState)=>state.posts)
    const [userComment,setUserComment] = useState<string>('')

    useEffect(()=>{
        if(user?._id!==undefined&&user._id!==null) dispatch(getUserPosts(user?._id))
    },[user])

    const submitPost = async() => {
        if(userComment.trim().length===0) {
            dispatch(messageModal(`Invalid post`));
            return
        }

        try {
            const request = await api.post('/tweets',{
                post:userComment
            })

            if(request.status===201) {
                dispatch(messageModal("Post uploaded.."))
                dispatch(getUserPosts(user?._id))
                setUserComment('')
            }
        } catch (error) {
            dispatch(messageModal(error?.message))
        }
    }
    
    const postHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => setUserComment(e.target.value)

  return (
    <div>
        <SectionHeader title="My Posts" size="text-lg md:text-xl" />
        <div>
        <section className='bg-[rgba(0,0,0,0.78)] px-4 py-2 flex flex-col relative font-roboto'>
            <div className='flex gap-4'>
                <div>
                <img src={user?.avatar} className='aspect-square w-[2rem] md:w-[3rem] object-cover' />
                </div>
                <textarea className='w-[100%] border border-gray-400 text-[#f1f1f1] resize-y min-h-10 md:min-h-20 max-h-20 md:max-h-30 p-1' autoCorrect='false' value={userComment} name="userComment" placeholder='Express your thoughts....' onChange={postHandler} />
            </div>
            <div className='ml-auto py-2'>
                <button className='font-sans mr-2 px-2 py-0.5 text-[#f1f1f1d0] rounded outline'>Cancel</button>
                <button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer' disabled={userComment.length!==0?false:true} onClick={submitPost}>Post</button>
            </div>
        </section>
        </div>
        <div className='w-[90%] mx-auto'>
            {userPosts.data!==null&&userPosts?.data.map((par)=>{
                return<CommentsCard post={par} key={par._id} />
            })}
        </div>
    </div>
  )
}

export default Posts;