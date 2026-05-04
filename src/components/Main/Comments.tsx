import React,{useState,useEffect, useCallback, useRef} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store/store.ts';
import { useParams } from 'react-router';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import {ChevronDown,ChevronUp} from 'lucide-react';
import { api } from '../../api/AxiosInterceptor.ts';
import { CommentsCard } from './CommentsCard.tsx';
import { getVideoComments } from '../../app/thunks/CommentThunk.ts';
import { messageModal } from '../../app/slices/toggleSlice.ts';
import {updateUserComment,addComment} from '../../app/slices/videoSlice.ts'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';

interface CommentLikeType{
    "_id": string,
    "likedBy": string
}

interface commentType{
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

interface updatedCommentType{
    "statusCode": number,
    "data": {
        "_id": string,
        "comment": string,
        "video": string,
        "owner": string,
        "createdAt": string,
        "updatedAt": string,
        "__v": number
    },
    "message": string,
    "success": number
}

interface submitCommentType{
    statusCode: number,
    data: {
        comment: string,
        video: string,
        owner: string,
        _id: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    },
    message: string,
    success: number
}

export const  Comments:React.FC = () => {
    const [userComment,setUserComment] = useState<string>('')
    const {videoId} = useParams()
    const videoDetails = useSelector((state:RootState)=>state.video)
    const userDetails = useSelector((state:RootState)=>state.user)
    const loadingComments = useSelector((state:RootState)=>state.video.loadingComments)
    const hasMoreComments = useSelector((state:RootState)=>state.video.hasMoreComments)
    const [openComment,setOpenComments] = useState<boolean>(true)
    const dispatch = useDispatch<AppDispatch>()
    const comments = useSelector((state:RootState)=>state.video.comments)
    const [currentlyEditing,setCurrentlyEditing] = useState<commentType|null>(null)
    const [page,setPage] = useState(1)
    const commentContainerRef = useRef(null)
    const pageCallback = useCallback(()=>{
        if(!loadingComments&&hasMoreComments){
          setPage(prev=>prev+1)
        }
    },[loadingComments,hasMoreComments])

    useIntersectionObserver(commentContainerRef,pageCallback)
    

    useEffect(()=>{
        const v_id = videoDetails.video?._id?videoDetails.video?._id:videoId
        if(v_id!==undefined){
            dispatch(getVideoComments({videoId:v_id,page}))
        }
    },[page,videoId])

    function commentHandler(e:React.ChangeEvent<HTMLTextAreaElement>){
        const {name,value} = e.target;
        setUserComment(value)
    }

    async function submitComment():Promise<void>{
        try {
            const req = await api.post<submitCommentType>(`/comments/${videoDetails.video?._id?videoDetails.video?._id:videoId}`,{
                "comment":userComment
            })

            if(req.status===201){
                const addedCommentFormat = {
                    _id:req.data.data._id,
                    comment:req.data.data.comment,
                    owner:{
                        _id:userDetails.userTemp?._id,
                        username:userDetails.userTemp?.username,
                        avatar:userDetails.userTemp?.avatar,
                    },
                    createdAt:req.data.data.createdAt,
                    comment_likes:[],
                    commentLikeCount:0,
                    isLiked:false
                }
                setUserComment('')
                dispatch(addComment(addedCommentFormat))
            }

        } catch (error) {
            console.error(error)
        }
    }

    function showComments():void{
        setOpenComments(!openComment)
    }

    const editPost = (userComment:commentType):void => {
        setUserComment(userComment.comment)
        setCurrentlyEditing(userComment)
    }

    const cancelChanges = ():void => {
        setCurrentlyEditing(null)
        setUserComment('')
    }

    const updateComment = async() => {
        if(userComment.trim().length===0) {
            dispatch(messageModal(`Invalid post`));
            return
        }
        try {
            const request = await api.patch<updatedCommentType>(`/comments/c/${currentlyEditing?._id}`,{
                comment:userComment
            })

            if(request.status===200) {
                dispatch(messageModal("Comment updated.."))
                dispatch(updateUserComment(request.data.data))
                //dispatch(getVideoComments(videoDetails.video?._id?videoDetails.video?._id:videoId))
                setUserComment('')                
                setCurrentlyEditing(null)
            }
        } catch (error) {
            dispatch(messageModal(error?.message))
        }finally{
            setCurrentlyEditing(null)
        }
    }

  return (
    <div className='relative'>
        <section className='bg-[rgba(0,0,0,0.8)] flex items-center justify-between px-2 border-b border-gray-600'>
        <section className='flex items-center'><SectionHeader title="Comments" size="text-lg" />
        {comments?.data!==undefined&&<span className='text-gray-400'>{comments?.data.docs?.length>0?`(${comments?.data.docs.length})`:"(0)"}</span>}</section>
        {openComment?<ChevronUp className='text-[#f1f1f1]' onClick={showComments} />:<ChevronDown className='text-[#f1f1f1]' onClick={showComments} />}
        </section>
        <main className={`transition-all duration-300 overflow-hidden ${
          openComment ? "max-h-[700px] overflow-y-auto" : "max-h-0"
        }`}>
        <section className='bg-[rgba(0,0,0,0.78)] px-4 py-2 flex flex-col relative border-b border-gray-700'>
            <div className='flex gap-4'>
                <div>
                <img src={userDetails.userTemp?.avatar} className='aspect-square w-[2rem] md:w-[3rem] object-cover' />
                </div>
                <textarea className='w-[100%] border border-[rgba(68,68,68,0.9)] text-[#f1f1f1] resize-y min-h-10 max-h-20 px-1' autoCorrect='false' value={userComment} name="userComment" onChange={commentHandler} />
            </div>
            <div className='ml-auto py-2'>
                <button className='font-sans mr-2 px-2 py-0.5 text-[#f1f1f1d0] rounded outline' onClick={cancelChanges}>Cancel</button>
                {currentlyEditing===null&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded' disabled={userComment.length!==0?false:true} onClick={submitComment}>Post</button>}
                {currentlyEditing!==null&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer' disabled={userComment.length!==0?false:true} onClick={updateComment}>Update</button>}
            </div>
        </section>
        <section className='flex flex-col bg-[rgba(0,0,0,0.8)]'>
            {comments && comments?.data.docs?.map((par,index)=>{
                return<CommentsCard par={par} key={par._id} onEdit={editPost}  />
            })}
        </section>
        <div ref={commentContainerRef} className='w-[100%] h-[10px] md:h-[30px] '/>
        </main>
    </div>
  )
}
