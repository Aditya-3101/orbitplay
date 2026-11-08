import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store.ts'
import { useDispatch } from 'react-redux'
import {getUserPosts} from '../../app/thunks/postThunk.ts'
import type { AppDispatch } from "../../app/store/store.ts"
import { SectionHeader } from '../Header/sectionHeader.tsx'
import { openAccountBar } from '../../app/slices/toggleSlice.ts'
import {getSelectedUserPost} from '../../app/slices/postSlice.ts'
import { ErrorPage } from './ErrorPage.tsx'
import TextEditor from '../../features/Editor/Editor.tsx'
import { ShowPosts } from './ShowPosts.tsx'

interface PostType{
avatar:string
content:string,
createdAt:string,
isLiked:boolean,
likeCount:number,
username:string,
_id:string
}


const Posts = ():React.JSX.Element => {

    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch= useDispatch<AppDispatch>()
    const userPosts = useSelector((state:RootState)=>state.posts)

    useEffect(()=>{
        if(user?._id!==undefined&&user._id!==null) dispatch(getUserPosts(user?._id))
        dispatch(openAccountBar(false))
        window.scrollTo(0,0)
    },[user,dispatch])

    

    const handleEdit = (post:PostType) =>{
        dispatch(getSelectedUserPost(post))
    }

    if(userPosts.error!==null){
        return<ErrorPage msg="User posts"/>
    }

  return (
    <div>
        <SectionHeader title="My Posts" size="text-lg md:text-xl" />
        <div>

        <section className='bg-[rgba(0,0,0,0.78)] px-4 py-2 flex flex-col relative font-roboto'>
            <div className='flex gap-4'>
                <div>
                <img src={user?.avatar} className='aspect-square w-[2rem] md:w-[3rem] object-cover' />
                </div>
                {/* <textarea className='w-full border border-gray-400 text-[#f1f1f1] resize-y min-h-10 md:min-h-20 max-h-20 md:max-h-30 p-1' autoCorrect='false' value={userComment} name="userComment" placeholder='Express your thoughts....' onChange={postHandler} /> */}
                <TextEditor/>
            </div>
        </section>
        </div>
        <div className='w-[90%] mx-auto'>
            {userPosts.data!==null&&userPosts?.data.map((par)=>{
                return<ShowPosts key={par._id} post={par} onEdit={handleEdit}/>
            })}
        </div>
    </div>
  )
}

export default Posts;