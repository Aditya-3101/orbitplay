// src/Tiptap.tsx
import './styles.scss'

import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { MenuBar } from './MenuBar.jsx'
import { api } from '../../api/AxiosInstance.js'
import { messageModal } from '../../app/slices/toggleSlice.js'
import { getUserPosts } from '../../app/thunks/postThunk.js'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store/store.js'
import { useEffect } from 'react'
import { getSelectedUserPost, updateUserPost } from '../../app/slices/postSlice.js'


const extensions = [TextStyleKit, StarterKit, TaskItem.configure({ nested: true }), TaskList]

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

const TextEditor = () => {

  const user = useSelector((state:RootState)=>state.user.userTemp);
  const dispatch= useDispatch<AppDispatch>()
  const selectedPost = useSelector((state:RootState)=>state.posts.selectedPost)

  const editor = useEditor({
    extensions,
    content: ``,
  })

    useEffect(()=>{
    if(selectedPost?.content) editor.commands.setContent(selectedPost?.content)
  },[editor.commands, selectedPost])


  const cancelChanges = ()=>{
    editor.commands.clearContent()
  }

  const submitPost = async() =>{
    try{
      const request = await api.post('/tweets',{
        post:editor.getHTML()
      })

      if(request.status===201) {
        dispatch(messageModal("Post uploaded.."));
        dispatch(getUserPosts(user?._id));
        editor.commands.clearContent();
      }
    }catch(error){
      console.log(error)
      dispatch(messageModal("Encountered error while uploading post"))
    }
  }

  const updatePost = async()=>{
    if(!selectedPost) {
      return;
    }
    try {
      const request = await api.patch<updatePostRequestType>(`/tweets/${selectedPost._id}`,
        {
        post:editor.getHTML()})
        if(request.status===200) {
          dispatch(messageModal("Post updated.."))
          dispatch(updateUserPost(request.data.data))
          dispatch(getUserPosts(user?._id))
          dispatch(getSelectedUserPost(null))
          editor.commands.clearContent();
        }
    } catch (error) {
      dispatch(messageModal(error))
      console.log(error)
    }
  }

  return (
    <main className="w-full flex flex-col gap-4">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className='ml-auto py-2'>
        <button className='font-sans mr-2 px-2 py-0.5 text-[#f1f1f1d0] rounded outline cursor-pointer' onClick={cancelChanges}>Cancel</button>
        {!selectedPost&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer'  onClick={submitPost}>Post</button>}
        {selectedPost&&<button className='font-sans bg-[#f1f1f1d0] ml-2 px-2 py-0.5 rounded cursor-pointer'  onClick={updatePost}>Update</button>}
      </div>
    </main>
  )
}

export default TextEditor;

