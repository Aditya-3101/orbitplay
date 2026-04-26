import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store.ts'
import { CommentsCard } from '../Main/CommentsCard'
import { useDispatch } from 'react-redux'
import {getUserPosts} from '../../app/thunks/postThunk.ts'
import type { AppDispatch } from "../../app/store/store"
import { SectionHeader } from '../Header/sectionHeader.tsx'

const Posts = () => {

    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch= useDispatch<AppDispatch>()
    const userPosts = useSelector((state:RootState)=>state.posts)

    useEffect(()=>{
        if(user?._id!==undefined&&user._id!==null) dispatch(getUserPosts(user?._id))
    },[user])

  return (
    <div>
        <SectionHeader title="My Posts" size="text-lg md:text-xl" />
        <div className='w-[90%] mx-auto'>
            {userPosts.data!==null&&userPosts?.data.map((par)=>{
                return<CommentsCard post={par} key={par._id} />
            })}
        </div>
    </div>
  )
}

export default Posts;