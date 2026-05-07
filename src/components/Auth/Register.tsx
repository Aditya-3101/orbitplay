import React, { useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../../api/AxiosInterceptor.ts';

interface userFormType{
  username:string,
  fullName:string,
  email:string,
  password:string,
  avatar:File|null,
  coverImage:File|null
}


const Register = ():React.JSX.Element => {
  const [userForm,setUserForm] = useState<userFormType>({
    username:'',
    fullName:'',
    email:'',
    password:'',
    avatar:null,
    coverImage:null
  })
  const [helperMessage,setHelperMessage] = useState({
    show:false,
    msg:'',
    error:false,
    success:false,
  })
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverImageRef = useRef<HTMLInputElement>(null)
  const [loading,setLoading] = useState(false)


  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
    e.preventDefault();
    const {name,value} = e.target

    setUserForm((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const onFileHandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
    e.preventDefault()
    const file = e.target.files?.[0] || null
    const name = e.target.name

    setUserForm((prev)=>({
      ...prev,
      [name]:file
    }))

    setHelperMessage((prev)=>({
      ...prev,
      show:false
    }))
  }

  function handleSubmit(e:React.SyntheticEvent){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    e.preventDefault()
    if(userForm.fullName.trim().length===0||userForm.username.trim().length===0||userForm.email.trim().length===0||userForm.password.trim().length===0||userForm.avatar===null||userForm.coverImage===null){
      setHelperMessage((prev)=>({
        ...prev,
        show:true,
        msg:"Kindly fill all details",
        error:true,
      }))
      return 
    }

    if(!passwordRegex.test(userForm.password)){
      setHelperMessage((prev)=>({
        ...prev,
        show:true,
        error:true,
        msg:"Kindly make sure password should be atleast 8 characters long including uppercase, lowercase, numbers and special characters"
      }))
      return
    }

    if(!emailRegex.test(userForm.email)){
      setHelperMessage((prev)=>({
        ...prev,
        show:true,
        error:true,
        msg:"Kindly enter proper email id"
      })) 
      return
    }

    setHelperMessage((prev)=>({
      ...prev,
      show:false
    }))

    callRegisterUserApi(userForm)
  }

  async function callRegisterUserApi(par:userFormType):Promise<void>{
    setLoading(true)
    try {
      const request = await api.post(`/users/register`,{
        username:par.username,
        fullName:par.fullName,
        email:par.email,
        password:par.password,
        avatar:par.avatar,
        coverImage:par.coverImage
      },{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })

      if(request.status===201) {
        setLoading(false)
        setHelperMessage((prev)=>({
          ...prev,
          show:true,
          success:true,
          error:false,
          msg:"You have successfully registered"
        }))
      }
    } catch (error) {
      setHelperMessage((prev)=>({
        ...prev,
        show:true,
        success:false,
        error:true,
        msg:"Something went wrong, kindly try after sometime"
      }))
    }
  }



  function cancelHelperMessage():void{
    setHelperMessage((prev)=>({
      ...prev,
      show:false
    }))
  }

  return (
    <div>
      <main className='w-[100%] bg-[rgba(0,0,0,0.95)] h-[100dvh] relative'>
        <div className='flex items-center w-[90%] '>
          <img src={logo} className='w-[3rem] md:w-[5rem] lg:w-[7rem] object-cover aspect-square' />
          <p className='font-roboto text-lg md:text-2xl lg:text-4xl px-2 text-gray-200'>Register</p>
          </div>
          <div className='font-roboto text-gray-300 w-[94%] mx-auto grid grid-cols-[100%] md:grid-cols-[70%] lg:grid-cols-[55%]'>
            {helperMessage.show&&
            <div className={`flex justify-between py-2 px-1 ${helperMessage.error?"border border-red-700":"border-gray-400"}`}>
              <p>{helperMessage.msg}</p>
              <X onClick={cancelHelperMessage} className='cursor-pointer' />
              </div>}
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <p>Name</p>
                {(helperMessage.show&&userForm.fullName.trim().length==0)&&<span className='text-gray-700 text-xs'>Kindly fill your name here</span>}
                <input type='text' value={userForm.fullName} onChange={onChangeHandler} name="fullName" className={`w-[100%] h-[2.4rem] border border-gray-500 px-2 ${(helperMessage.show&&userForm.fullName.trim().length==0)&&"border-red-700"}`} placeholder='Enter your Name here' />
              </div>

              <div>
                <p>Username</p>
                {(helperMessage.show&&userForm.username.trim().length==0)&&<span className='text-gray-700 text-xs'>Kindly fill your username here</span>}
                <input type='text' value={userForm.username} onChange={onChangeHandler} name="username" className={`w-[100%] h-[2.4rem] border border-gray-500 px-2 ${(helperMessage.show&&userForm.username.trim().length==0)&&"border-red-700"}`} placeholder='Enter your username here' />
              </div>

              <div>
                <p>Email</p>
                {(helperMessage.show&&userForm.email.trim().length==0)&&<span className='text-gray-700 text-xs'>Kindly fill your email here</span>}
                <input type='email' value={userForm.email} onChange={onChangeHandler} name="email" className={`w-[100%] h-[2.4rem] border border-gray-500 px-2 ${(helperMessage.show&&userForm.email.trim().length==0)&&"border-red-700"}`} placeholder='Enter your Email here' />
              </div>

              <div>
                <p>Password</p>
                {(helperMessage.show&&userForm.password.trim().length==0)&&<span className='text-gray-700 text-xs'>Kindly fill your password here</span>}
                <input type='password' value={userForm.password} onChange={onChangeHandler} name="password" className={`w-[100%] h-[2.4rem] border border-gray-500 px-2 ${(helperMessage.show&&userForm.password.trim().length==0)&&"border-red-700"}`} placeholder='Enter your Password here' />
              </div>

              <div>
              <p>Avatar</p>
              {(helperMessage.show&&userForm.avatar===null)&&<span className='text-gray-700 text-xs'>Kindly upload your avatar here</span>}
                <input type='file' ref={avatarRef} accept='image/png, image/jpg, image/jpeg' name="avatar" onChange={onFileHandler} className='w-[100%] border border-gray-500 file:p-2 file:bg-gray-100 file:text-gray-900' />
              </div>

              <div>
              <p>Cover Image</p>
              {(helperMessage.show&&userForm.coverImage===null)&&<span className='text-gray-700 text-xs'>Kindly upload your cover here</span>}
                <input type='file' ref={coverImageRef} accept='image/png, image/jpg, image/jpeg' name="coverImage" onChange={onFileHandler} className='w-[100%] border border-gray-500 file:p-2 file:bg-gray-100 file:text-gray-900' />
              </div>

              <button className='p-2 rounded-xl w-fit py-2 px-4 mx-auto border border-gray-400 cursor-pointer' onClick={handleSubmit}>Create Account</button>
            </form>
          </div>
          <div className='w-[100%] md:w-[80%] lg:w-[55%] mt-4 flex flex-col md:flex-row justify-center items-center gap-2'>
            <div className='text-gray-300 w-[100%] md:w-fit md:py-1 flex relative items-center justify-center'>
                <p className='w-fit'>
                    Already have an account?
                </p>
            </div>
            <Link to="/login" className='text-gray-400 w-fit text-center px-4 py-1 rounded-xl border-[#593d88] border'>
                Login
            </Link>
        </div>
        {(helperMessage.show&&helperMessage.success)&&<div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center'>
          <div className='text-gray-200 font-roboto w-[70%] md:w-[40%] lg:w-fit lg:p-4 border border-gray-500 py-4 px-2'>
          <p className='text-lg mb-4'>You have successfully Registered!!</p>
          <Link to="/login" className='text-base border border-gray-400 p-2 rounded-xl w-[100%] md:w-fit md:px-4 md:py-2 block text-center bg-gray-200 text-gray-900'>Login</Link>
          </div>
          </div>}
          {loading&&<div className='absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.76)] flex justify-center items-center gap-2'>
          <div className="loader"></div>
            <div className='font-roboto text-gray-200 text-center'>
              Loading....
            </div>
            </div>}
      </main>
    </div>
  )
}

export default Register