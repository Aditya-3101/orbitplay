import React, { useState } from 'react'
import { api } from '../../../api/AxiosInterceptor'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/store/store.ts'
import {updateUserAccount} from '../../../app/slices/userSlice.ts'
import { SquarePen } from 'lucide-react'

interface msgType{
    loading:boolean,
    error:null|string,
    success:null|string
}

interface userDetailType{
    fullName:string|undefined,
    email:string|undefined,
    oldPassword:'',
    currentPassword:string,
    retypePassword:string
}

export const UpdateAccountDetails = () => {
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const dispatch = useDispatch()
    const [userDetail,setUserDetail] = useState<userDetailType>({
        fullName:user?.fullName,
        email:user?.email,
        oldPassword:'',
        currentPassword:'',
        retypePassword:''
    })
    const [msg,setMsg] = useState<msgType>({
        loading:false,
        error:null,
        success:null
    })

    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target

        setUserDetail((prev)=>({
            ...prev,
            [name]:value
        }))
        
        setMsg((prev)=>({
            ...prev,
            error:null,
            success:null
        }))
    }

    function updateDetail(){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if(userDetail.email===undefined){
            setMsg((prev)=>({
                ...prev,
                error:"Invalid Email Format"
            }))
            return
        }

        if(userDetail.fullName===undefined){
            setMsg((prev)=>({
                ...prev,
                error:"Invalid Name Format"
            }))
            return
        }

        if (userDetail.email.trim().length === 0 || userDetail.fullName.trim().length === 0) {
            setMsg(prev => ({
                ...prev,
                error: "Name and Email are required"
            }))
            return
        }

        if(!emailRegex.test(userDetail.email)){
            setMsg((prev)=>({
                ...prev,
                error:"Invalid Email Format"
            }))
            return
        }

        const isChangingPassword =
        userDetail.oldPassword ||
        userDetail.currentPassword ||
        userDetail.retypePassword
        
        if (isChangingPassword) {
            if (
                userDetail.oldPassword.length === 0 ||
                userDetail.currentPassword.length === 0 ||
                userDetail.retypePassword.length === 0
                ) {
                    setMsg(prev => ({
                        ...prev,
                        error: "Fill all password fields"
                    }))
                    return
                }
                
            if (userDetail.currentPassword !== userDetail.retypePassword) {
                setMsg(prev => ({
                    ...prev,
                    error: "Passwords do not match"
                }))
            return
        }
    }

        if(isChangingPassword&&!passwordRegex.test(userDetail.retypePassword)){
            setMsg((prev)=>({
                ...prev,
                error:"Kindly make sure password should be atleast 8 characters long including uppercase, lowercase, numbers and special characters"
            }))
            return
        }

        if (userDetail.oldPassword || userDetail.retypePassword) callToUpdatePassword(userDetail.oldPassword,userDetail.retypePassword)
        if(userDetail.email!==user?.email||userDetail.fullName!==user?.fullName) callToUpdateAccount(userDetail.fullName,userDetail.email)
    }

    async function callToUpdatePassword(par3:string,par4:string) {
        setMsg((prev)=>({
            ...prev,
            error:null,
            success:null,
            loading:true
        }))

        try {
            const request = await api.post('/users/change-password',{
                oldPassword:par3,
                newPassword:par4
            })
            if(request.status===200){
                setMsg((prev)=>({
                    ...prev,
                    error:null,
                    success:'Password Updated successfully',
                    loading:false
                }))
                setUserDetail((prev)=>({
                    ...prev,
                    currentPassword:'',
                    oldPassword:'',
                    retypePassword:''
                }))
            }


        } catch (error) {
            if((error as any).response?.status===400){
                setMsg((prev)=>({
                    ...prev,
                    error:"old password isn't correct",
                    success:null,
                    loading:false
                }))
                return
            }
            setMsg((prev)=>({
                ...prev,
                error:'Encountered error while update account details',
                success:null,
                loading:false
            }))
        }
        
    }

    async function callToUpdateAccount(par1:string,par2:string) {
        setMsg((prev)=>({
            ...prev,
            error:null,
            success:null,
            loading:true
        }))
        try {
            const request2 = await api.patch('/users/update-account',{fullName:par1,email:par2})
            if(request2.status===200) {
                setMsg((prev)=>({
                ...prev,
                error:null,
                success:'Details Updated successfully',
                loading:false
            }))
            dispatch(updateUserAccount({fullName:par1,email:par2}))
            setUserDetail((prev)=>({
                ...prev,
                currentPassword:'',
                oldPassword:'',
                retypePassword:''
            }))
        }
        } catch (error) {
            setMsg((prev)=>({
                ...prev,
                error:'Encountered error while update account details',
                success:null,
                loading:false
            }))
        }
    }

    const clearUserAccountDetail = (par:string) => {
        setUserDetail((prev)=>({
            ...prev,
            [par]:''
        }))
    }

  return (
    <div className='py-4'>
        <div className='font-roboto flex flex-col gap-4 w-[90%] md:w-[60%] lg:w-[50%] mx-auto md:ml-0'>
            <p className='text-lg text-gray-200'>Update Account</p>
            {msg.error!==null&&<div className='text-gray-300 p-2 border border-red-600'>
                {msg.error}
                </div>}
            {msg.success!==null&&<div className='text-gray-300 p-2 border border-green-700'>
                {msg.success}
                </div>}
            <div>
                <p className='text-gray-400'>
                    Name
                </p>
                <div className='text-gray-300 flex items-center gap-2'>
                    <input type='text' value={userDetail.fullName} name="fullName" onChange={changeHandler} className='h-[2.4rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 p-1' placeholder='Enter Your New Name' />
                    <SquarePen onClick={()=>clearUserAccountDetail("fullName")} />
                    </div>
                
            </div>
            <div>
                <p className='text-gray-400'>
                    Email
                </p>
                <div className='text-gray-300 flex items-center gap-2'>
                <input type='email' value={userDetail.email} name="email" onChange={changeHandler} className='h-[2.4rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 p-1' placeholder='Enter Your New Mail Id'  />
                <SquarePen onClick={()=>clearUserAccountDetail("email")}/>
                </div>
            </div>
            <div>
                <p className='text-gray-400'>
                    Current Password
                </p>
                <input type='password' value={userDetail.oldPassword} name="oldPassword" onChange={changeHandler} className='h-[2.4rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 p-1' placeholder='Enter Your New Password'  />
            </div>
            <div>
                <p className='text-gray-400'>
                    New Password
                </p>
                <input type='password' value={userDetail.currentPassword} name="currentPassword" onChange={changeHandler} className='h-[2.4rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 p-1' placeholder='Enter Your New Password'  />
            </div>
            <div>
                <p className='text-gray-400'>
                    Confirm Password
                </p>
                <input type='password' value={userDetail.retypePassword} name="retypePassword" onChange={changeHandler} className='h-[2.4rem] outline outline-gray-400 w-[90%] font-roboto text-gray-200 p-1' placeholder='Re Your New Password'  />
            </div>
            <div>
                <button className='border border-gray-400 p-2 rounded-xl text-gray-200' onClick={updateDetail}>Update</button>
            </div>
        </div>
    </div>
  )
}
