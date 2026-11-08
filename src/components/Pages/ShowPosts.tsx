import DOMPurify from 'dompurify'
import { timeAgo } from '../../utility/timeStamp'
import { EllipsisVertical, Heart, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store/store'
import { api } from '../../api/AxiosInstance'
import { deletePostById, updateIsLikedBy } from '../../app/slices/postSlice'
import { messageModal } from '../../app/slices/toggleSlice'

interface PostType{
    avatar:string,
    content:string,
    createdAt:string,
    isLiked:boolean,
    likeCount:number,
    username:string,
    _id:string
}

interface PostPropType{
    post:PostType,
    onEdit?:(arg:PostType) => void;
}

export const ShowPosts = ({post,onEdit}:PostPropType) => {
    const [options,setOptions] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>()

    async function toggleLike(postId:string):Promise<void>{
            try {
                const request = await api.post(`/likes/toggle/t/${postId}`)
                if(request.status===200) {
                    dispatch(updateIsLikedBy(postId))
                }
            } catch (error) {
                console.log(error)
            }
        }
        
    const deletePost = async(postId:string):Promise<void> =>{
        try {
            const request = await api.delete(`/tweets/${postId}`)
            if(request.status===200) {
                dispatch(deletePostById(postId))
                dispatch(messageModal("Post deleted successfully"))
            }
        } catch (error) {
            console.error(error)
            dispatch(messageModal("Something went wrong while deleting post"))
        }
    }

    const toggleOptions=()=>{
        setOptions(prev=>!prev)
    }

    const handleEditClick = (item: PostType) => {
        onEdit?.(item);
    };

    const cleanHTML = DOMPurify.sanitize(post.content)

    return<div className='place-content-center border-b border-gray-600 p-1.5 md:w-full postcontainer'>
                   <div className='flex items-center justify-center userAvatar'>
                    <img src={post.avatar} className='aspect-square w-[80%] md:w-[2.5rem] object-cover' />
                   </div>
                    <p className='flex justify-between username'> 
                        <span className='text-[14px] text-[#f1f1f1d0] font-poppins'>{post.username}</span>
                    </p>
                    <div className='text-sm text-[#f1f1f1d0] lastupdated flex justify-end gap-1 items-center h-min relative'>
                        <span>{timeAgo(post.createdAt)}</span>
                    <div className='blank relative'>
                        <EllipsisVertical color="rgba(240,240,240)" className='cursor-pointer w-4 h-[16px]lg:w-[20px] lg:h-5' onClick={toggleOptions} />
                        {options&&<section className='absolute top-[110%] right-full border border-gray-600 flex flex-col items-start bg-[rgb(0,0,0)] px-'>
                        <p className='flex items-center gap-1 cursor-pointer border-b border-gray-400 w-full hover:bg-[#222] px-1' onClick={()=>handleEditClick(post)}><Pencil className='w-3 h-[12x]' />Edit</p>
                        <p onClick={()=>deletePost(post._id)} className='w-full flex items-center gap-1 cursor-pointer hover:bg-[#222] px-1'><Trash className='w-3 h-[12x]' />Delete</p>
                    </section>}
                    </div>
                    </div>
                    <div className='text-base md:text-xl text-[#f1f1f1] font-roboto userContent' dangerouslySetInnerHTML={{__html:cleanHTML}} />
                    <div className='flex flex-col items-end justify-center postReactions'>
                        <p className='text-center text-sm'>
                        <span className='cursor-pointer' onClick={()=>toggleLike(post._id)}>{post.isLiked===true?<Heart fill='red' />:<Heart className='text-gray-600' />}</span>
                        <span className='text-gray-600'>{post.likeCount}</span>
                        </p>
                    </div>
        </div>
}