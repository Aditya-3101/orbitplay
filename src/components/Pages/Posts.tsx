import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store.ts'
import { CommentsCard } from '../Main/CommentsCard'
import { useDispatch } from 'react-redux'
import {getUserPosts} from '../../app/thunks/postThunk.ts'
import type { AppDispatch } from "../../app/store/store.ts"
import { SectionHeader } from '../Header/sectionHeader.tsx'
import { messageModal } from '../../app/slices/toggleSlice.ts'
import { api } from '../../api/AxiosInterceptor.ts'
import {updateUserPost} from '../../app/slices/postSlice.ts'
import { ErrorPage } from './ErrorPage.tsx'

interface PostType{
avatar:string
content:string,
createdAt:string,
isLiked:boolean,
likeCount:number,
username:string,
_id:string
}

interface updatePostRequestType{
    statusCode: number,
    data: PostType,
    message: string,
    success: number
}

const Posts = ():React.JSX.Element => {

    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch= useDispatch<AppDispatch>()
    const userPosts = useSelector((state:RootState)=>state.posts)
    const [userComment,setUserComment] = useState<string>('')
    const [currentlyEditing,setCurrentlyEditing] = useState<PostType|null>(null)

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

    const updatePost = async() => {
        if(userComment.trim().length===0) {
            dispatch(messageModal(`Invalid post`));
            return
        }
        try {
            const request = await api.patch<updatePostRequestType>(`/tweets/${currentlyEditing?._id}`,{
                post:userComment
            })

            if(request.status===200) {
                dispatch(messageModal("Post updated.."))
                dispatch(updateUserPost(request.data.data))
                setUserComment('')
                setCurrentlyEditing(null)
                dispatch(getUserPosts(user?._id))
            }
        } catch (error) {
            dispatch(messageModal(error?.message))
            console.log(error)
        }finally{
            setCurrentlyEditing(null)
        }
    }
    

    const postHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => setUserComment(e.target.value)

    const editPost = (post:PostType) => {
        setCurrentlyEditing(post)
        setUserComment(post.content)
    }

    const cancelChanges = () => {
        setCurrentlyEditing(null)
        setUserComment('')
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
                <textarea className='w-[100%] border border-gray-400 text-[#f1f1f1] resize-y min-h-10 md:min-h-20 max-h-20 md:max-h-30 p-1' autoCorrect='false' value={userComment} name="userComment" placeholder='Express your thoughts....' onChange={postHandler} />
            </div>
            <div className='ml-auto py-2'>
                <button className='font-sans mr-2 px-2 py-0.5 text-[#f1f1f1d0] rounded outline' onClick={cancelChanges}>Cancel</button>
                {currentlyEditing===null&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer' disabled={userComment.length!==0?false:true} onClick={submitPost}>Post</button>}
                {currentlyEditing!==null&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer' disabled={userComment.length!==0?false:true} onClick={updatePost}>Update</button>}
            </div>
        </section>
        </div>
        <div className='w-[90%] mx-auto'>
            {userPosts.data!==null&&userPosts?.data.map((par)=>{
                return<CommentsCard post={par} key={par._id} onEdit={editPost} />
            })}
        </div>
    </div>
  )
}

export default Posts;