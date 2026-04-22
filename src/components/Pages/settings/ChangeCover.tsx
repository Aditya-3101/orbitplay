import React,{useState,useRef} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../../app/store/store.ts';
import { updateUserCover } from '../../../app/slices/userSlice.ts';
import { api } from '../../../api/AxiosInterceptor';

export const ChangeCover = () => {
    const user = useSelector((state:RootState)=>state.user.userTemp);
    const [cover,setcover] = useState<File|null>(null);
    const [previewcover,setPreviewcover] = useState<string|null>(null);
    const [msg,setMsg] = useState({
        error:'',
        sucess:'',
        loading:false,
    })
    const coverRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()


    function changeHandler(e:React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0] || null

        setMsg({
            error:'',
            sucess:'',
            loading:false
        })

        if(file!==null) {
            setcover(file);
            setPreviewcover(URL.createObjectURL(file))
            return
        }else{
        setMsg((prev)=>({
            ...prev,
            error:'Invalid image'
        }))
        }
    }

    async function submitHandler() {
        setMsg((prev)=>({
            ...prev,
            loading:true
        }))

        if(!cover||cover==null){
            setMsg((prev)=>({
                ...prev,
                error:'No Cover Image Found',
                loading:false
            }))

            return 
        }

        try {
            const request = await api.patch('/users/cover-image',{coverImage:cover},{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            if(request.status===200) {
                setMsg({
                error:'',
                sucess:'cover updated successfully',
                loading:false
            })
            dispatch(updateUserCover(request.data.data.coverImage))

        }
        } catch (error) {
            setMsg((prev)=>({
                ...prev,
                error:"Something went wrong while updating cover!!",
                loading:false
            }))
        }
    }

    function clearcover(){
        setcover(null)
        setPreviewcover(null)

        coverRef.current!.value=''
        setMsg({
            error:'',
            sucess:'',
            loading:false
        })
    }


  return (
    <div>
        <div className='text-gray-300 font-roboto flex flex-col gap-4 py-4 relative'>
            <div className='flex flex-col justify-center items-center gap-4 md:h-[20rem]'>
                <p className='text-xl w-fit text-gray-200 '>{previewcover!==null?"Preview":"Current Cover Image"}</p>
                {(msg.error?.length!==0)&&<div className='border border-red-700 p-2'>{msg.error}</div>}
                {(msg.sucess.length!==0)&&<div className='w-[90%] border border-green-700 p-2'>{msg.sucess}</div>}
                <div className='w-[100%] flex flex-col md:flex-row items-center justify-center gap-6'>
                <div className='w-[80%] md:w-[65%]'>
                    {(cover==null&&user)&&<img src={user.coverImage} alt="user cover" className='w-[100%] object-cover aspect-[16/6] border-2 border-gray-400' />}
                    {(cover!==null&&previewcover)&&<img src={previewcover} alt="user cover" className='w-[100%] object-cover aspect-[16/6]  border-2 border-gray-400' />}
                </div>
                <div className='flex flex-col gap-4 items-center md:items-start md:w-[60%]'>
                    <input type="file" ref={coverRef} onChange={changeHandler} accept='image/png, image/jpg, image/jpeg' className='text-gray-300 border md:w-[90%] border-gray-500 file:p-2 file:bg-gray-50 file:text-gray-900 font-roboto' />
                    
                    <div className='flex items-center justify-between w-full'>
                    <button onClick={submitHandler} className='border border-gray-300 w-fit p-2 rounded-lg'>Update</button>
                    {(previewcover&&msg.sucess.length===0)&&<button onClick={clearcover} className='border bg-gray-200 text-gray-950 w-fit p-2 rounded-lg'>Clear</button>}
                    </div>
                </div>
                </div>
            </div>
            {msg.loading&&<div className='absolute top-0 left-0 right-0 bottom-0 h-[6rem] md:h-[20rem] bg-[rgba(0,0,0,0.9)] flex items-center justify-center'>
                <p>Loading....</p>
                </div>}
        </div>
    </div>  )
}
