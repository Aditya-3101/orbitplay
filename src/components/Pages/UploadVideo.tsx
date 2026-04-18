import React,{useRef, useState} from 'react';
import { X } from 'lucide-react';
import { api } from '../../api/AxiosInterceptor';

interface uploadFormType{
  file:File|null,
  thumbnail?:File|null,
  title:string,
  description:string
}

const UploadVideo = () => {

  const [isDragging,setIsDragging] = useState(false)
  const [formData,setFormData]=useState<uploadFormType>({
    file:null,
    thumbnail:null,
    title:'',
    description:''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [loading,setLoading] = useState(false)
  const [uploadStatus,setUploadStatus] = useState<boolean|string>('')


  function handleDrop(e:React.DragEvent){
    e.preventDefault();

    if (e.dataTransfer.files[0].type !== "video/mp4") {
      alert("Only MP4 allowed")
      return
    }
    setFormData((prev)=>({
      ...prev,
      file:e.dataTransfer.files[0]
    }))
  }

  function handleFileSelect(e:React.ChangeEvent<HTMLInputElement>){
    e.preventDefault();
    const file = e.target.files?.[0] || null

    if(file){
    setFormData((prev)=>({
      ...prev,
      file: file
    }))
  }
  }

  function handleThumbnailSelect(e:React.ChangeEvent<HTMLInputElement>){
    e.preventDefault();
    const file = e.target.files?.[0] || null

    if(file){
    setFormData((prev)=>({
      ...prev,
      thumbnail: file
    }))
  }
  }

  function removeSelectedVideo(){
    setFormData((prev)=>({
      ...prev,
      file:null
    }))
    
    fileInputRef.current!.value=''
  }

  function removeSelectedThumbnail(){
    setFormData((prev)=>({
      ...prev,
      thumbnail:null
    }))
    
    thumbnailInputRef.current!.value=''
  }

  function onChangeHandler(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
    e.preventDefault();
    const {name,value} = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  async function handleSubmit(e){
    e.preventDefault()

    if(formData.title.trim().length===0||formData.description.trim().length===0||formData.file===null){
      setUploadStatus(false)
      return
    }

    try {
      setLoading(true)
      const request = await api.post(`/videos`,{
        title:formData.title,
        description:formData.description,
        videoFile:formData.file,
        thumbnail:formData.thumbnail
      },{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      if(request.status===201){
        console.log(request.data)
        setLoading(false)
        setUploadStatus(true)
        setFormData((prev)=>({
          file:null,
          thumbnail:null,
          title:'',
          description:''
        }))
        thumbnailInputRef.current!.value=''
        fileInputRef.current!.value=''
      }

    } catch (error) {
      setLoading(false)
      setUploadStatus(false)
      console.log(error)
    }
  }


  return (
    <div className='bg-[rgba(0,0,0,0.9)] px-4 relative py-2'>
      <p className='text-gray-400 p-2 font-bold'>Upload Video</p>
      {uploadStatus===false&&<div className='w-[100%] flex items-center justify-between border border-red-800 p-1'><div className='font-roboto text-lg text-gray-300 '>Kindly fill all the details!!</div><X className='text-gray-300' onClick={()=>setUploadStatus('')} /></div>}
      {uploadStatus&&<div className='w-[100%] flex items-center justify-between border border-green-700 p-1'>
        <div className='font-roboto text-lg text-gray-300'>Video Uploaded Successfully!!</div>
        <X className='text-gray-300' onClick={()=>setUploadStatus('')} /></div>}
      <div>
        <form action={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <p className='font-roboto text-base text-gray-200'>Video File</p>
            {formData.file===null&&<div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleDrop(e)
            }}
            className={`border-2 p-10 text-gray-300 text-center ${isDragging ? "bg-gray-700" : ""}`}
            >Drop file here</div>}
            <input type="file" ref={fileInputRef} className='text-gray-300 border border-gray-500 file:p-2 file:bg-gray-50 file:text-gray-900 font-roboto' accept='video/mp4' onChange={handleFileSelect} />
          </div>
          {formData.file&&<div className='font-roboto text-gray-400 border border-gray-400 p-2 my-4 w-fit' onClick={removeSelectedVideo}>Remove Video File</div>}
          {formData.file&&<div className='font-roboto text-gray-300'>Selected File: {formData.file.name}</div>}

          <div className='flex flex-col gap-2 my-2'>
            <p className='font-roboto text-base text-gray-200'>Video Thumbnail</p>
            <input type="file" ref={thumbnailInputRef} className='text-gray-300 border border-gray-500 file:p-2 file:bg-gray-50 file:text-gray-900 font-roboto' accept='image/jpg, image/png, image/jpeg' onChange={handleThumbnailSelect} />
          </div>
          {formData.thumbnail&&<div className='font-roboto text-gray-400 border border-gray-400 p-2 my-4 w-fit' onClick={removeSelectedThumbnail}>Remove Video Thumnail</div>}
          {formData.thumbnail&&<div className='font-roboto text-gray-300'>Selected thumbnail: {formData.thumbnail.name}</div>}
          <div className='py-4 flex flex-col gap-4'>
            <div>
              <p className='text-base font-roboto text-gray-400'>Title</p>
              <input type='text' value={formData.title} name="title" onChange={onChangeHandler} className='h-[2rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200' />
            </div>

            <div>
              <p className='text-base font-roboto text-gray-400'>Description</p>
              <textarea value={formData.description} name="description" onChange={onChangeHandler} className='h-[6rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 resize-y min-h-10 max-h-20' />
            </div>
          </div>
          <button className='font-roboto px-2 py-1 rounded text-gray-200 border border-gray-400' onClick={handleSubmit}>Post</button>
        </form>
      </div>
      {loading&&<div className='absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)]'>
        <div className='font-roboto text-lg text-gray-100 bg-gray-700 px-2 py-1 rounded-2xl'>Uploading....</div>
        </div>}
    </div>
  )
}

export default UploadVideo;