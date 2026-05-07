import React, { useRef, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RootState } from '../../../app/store/store.ts'
import { api } from '../../../api/AxiosInterceptor.ts'
import {updateUserAvatar} from '../../../app/slices/userSlice.ts'

export const ChangeAvatar = ():React.JSX.Element => {
    const user = useSelector((state:RootState)=>state.user.userTemp);
    const [avatar,setAvatar] = useState<File|null>(null);
    const [previewAvatar,setPreviewAvatar] = useState<string|null>(null);
    const [msg,setMsg] = useState({
        error:'',
        sucess:'',
        loading:false,
    })
    const avatarRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()


    function changeHandler(e:React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0] || null

        setMsg({
            error:'',
            sucess:'',
            loading:false
        })

        if(file!==null) {
            setAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file))
            return
        }else{
        setMsg((prev)=>({
            ...prev,
            error:'Invalid image'
        }))
        }
    }

    async function submitHandler():Promise<void> {
        setMsg((prev)=>({
            ...prev,
            loading:true
        }))
        if(!avatar||avatar==null){
            setMsg((prev)=>({
                ...prev,
                error:'No Avatar Found',
                loading:false
            }))

            return 
        }
        try {
            const request = await api.patch('/users/avatar',{avatar},{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            if(request.status===200) {
                setMsg({
                error:'',
                sucess:'Avatar updated successfully',
                loading:false
            })
            dispatch(updateUserAvatar(request.data.data.avatar))
        }
        } catch (error) {
            setMsg((prev)=>({
                ...prev,
                error:"Something went wrong while updating avatar!!",
                loading:false
            }))
        }
    }

    function clearAvatar():void{
        setAvatar(null)
        setPreviewAvatar(null)

        avatarRef.current!.value=''
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
                <p className='text-xl w-fit text-gray-200 '>{previewAvatar!==null?"Preview":"Current Avatar"}</p>
                {(msg.error?.length!==0)&&<div className='border border-red-700 p-2'>{msg.error}</div>}
                {(msg.sucess.length!==0)&&<div className='w-[90%] border border-green-700 p-2'>{msg.sucess}</div>}
                <div className='w-[100%] flex flex-col md:flex-row items-center justify-center gap-6'>
                <div className='w-[40%] md:w-[15%]'>
                    {(avatar==null&&user)&&<img src={user.avatar} alt="user avatar" className='w-[100%] object-cover aspect-square rounded-full border-2 border-gray-400' />}
                    {(avatar!==null&&previewAvatar)&&<img src={previewAvatar} alt="user avatar" className='w-[100%] object-cover aspect-square rounded-full border-2 border-gray-400' />}
                </div>
                <div className='flex flex-col gap-4 items-center md:items-start md:w-[60%]'>
                    <input type="file" ref={avatarRef} onChange={changeHandler} accept='image/png, image/jpg, image/jpeg' className='text-gray-300 border md:w-[60%] border-gray-500 file:p-2 file:bg-gray-50 file:text-gray-900 font-roboto' />
                    
                    <div className='flex items-center justify-between w-full'>
                    <button onClick={submitHandler} className='border border-gray-300 w-fit p-2 rounded-lg'>Update</button>
                    {(previewAvatar&&msg.sucess.length===0)&&<button onClick={clearAvatar} className='border bg-gray-200 text-gray-950 w-fit p-2 rounded-lg'>Clear</button>}
                    </div>
                </div>
                </div>
            </div>
            {msg.loading&&<div className='absolute top-0 left-0 right-0 bottom-0 h-[8rem] md:h-[50dvh] lg:h-[70dvh] bg-[rgba(0,0,0,0.9)] flex flex-col items-center gap-1 justify-center'>
            <div className="loader"></div>
                <p>Loading....</p>
                </div>}
        </div>
    </div>
  )
}
