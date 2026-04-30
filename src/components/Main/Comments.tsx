import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store/store.ts';
import { useParams } from 'react-router';
import { SectionHeader } from '../Header/sectionHeader.tsx';
import {ChevronDown,ChevronUp} from 'lucide-react';
import { api } from '../../api/AxiosInterceptor.ts';
import { CommentsCard } from './CommentsCard.tsx';
import { getVideoComments } from '../../app/thunks/CommentThunk.ts';


export const  Comments:React.FC = () => {
    const [userComment,setUserComment] = useState<string>('')
    const {videoId} = useParams()
    const videoDetails = useSelector((state:RootState)=>state.video)
    const userDetails = useSelector((state:RootState)=>state.user)
    const [openComment,setOpenComments] = useState<boolean>(true)
    const dispatch = useDispatch<AppDispatch>()
    const comments = useSelector((state:RootState)=>state.video.comments)

    useEffect(()=>{
        dispatch(getVideoComments(videoDetails.video?._id?videoDetails.video?._id:videoId))
    },[])


    function commentHandler(e:React.ChangeEvent<HTMLTextAreaElement>){
        const {name,value} = e.target;
        setUserComment(value)
    }

    async function submitComment(){
        try {
            const req = await api.post(`/comments/${videoDetails.video?._id?videoDetails.video?._id:videoId}`,{
                "comment":userComment
            })

            if(req.status===201){
                setUserComment('')
                dispatch(getVideoComments(videoDetails.video?._id?videoDetails.video?._id:videoId))
            }

        } catch (error) {
            console.error(error)
        }
    }

    function showComments(){
        setOpenComments(!openComment)
    }

  return (
    <div className='relative'>
        <section className='bg-[rgba(0,0,0,0.8)] flex items-center justify-between px-2'>
        <SectionHeader title="Comments" size="text-lg" />
        {openComment?<ChevronUp className='text-[#f1f1f1]' onClick={showComments} />:<ChevronDown className='text-[#f1f1f1]' onClick={showComments} />}
        </section>
        <main className={`transition-all duration-300 overflow-hidden ${
          openComment ? "max-h-[700px] overflow-y-auto" : "max-h-0"
        }`}>
        <section className='bg-[rgba(0,0,0,0.78)] px-4 py-2 flex flex-col relative'>
            <div className='flex gap-4'>
                <div>
                <img src={userDetails.userTemp?.avatar} className='aspect-square w-[2rem] md:w-[3rem] object-cover' />
                </div>
                <textarea className='w-[100%] border border-[rgba(0,0,0,0.6)] text-[#f1f1f1] resize-y min-h-10 max-h-20' autoCorrect='false' value={userComment} name="userComment" onChange={commentHandler} />
            </div>
            <div className='ml-auto py-2'>
                <button className='font-sans mr-2 px-2 py-0.5 text-[#f1f1f1d0] rounded outline'>Cancel</button>
                <button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded' disabled={userComment.length!==0?false:true} onClick={submitComment}>Post</button>
            </div>
        </section>
        <section className='flex flex-col bg-[rgba(0,0,0,0.8)]'>
            {comments && comments?.data.docs?.map((par,index)=>{
                return<CommentsCard par={par} key={index}  />
            })}
        </section>
        </main>
    </div>
  )
}
