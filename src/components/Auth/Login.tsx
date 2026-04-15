import React,{useState} from 'react';
import axios from 'axios';
import logo from '../../assets/logo.png';
import {useDispatch} from 'react-redux';
import {addUserDetails} from '../../app/slices/userSlice.ts';
import { useNavigate,useLocation } from 'react-router';


interface loginUser  {
    email:string;
    password:string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage?: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface LoginData {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }
  
  interface LoginResponse {
    statusCode: number;
    data: LoginData;
    message: string;
    success: number;
  }

export const Login:React.FC = () => {
    const [user,setUser] = useState<loginUser>(
        {
            email:'',
            password:''
        }
    )

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()

    const from = location.state?.from || "/"


    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target;

        setUser((prev)=>({
            ...prev,
            [name]:value as string
        }))
    }

    const submitHandler = () =>{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPsw = /^.{6,}$/
        if(user.email?.length!==0 || user.password?.length!==0){
            if(regexEmail.test(user.email)||regexPsw.test(user.password)){
                callLogin(user.email,user.password);
            }
        }else{
            console.log("validation failed")
        }
    }

    const callLogin = async(param1:string,param2:string) => {
        try{
        const request = await axios.post<LoginResponse>('http://localhost:8000/api/v1/users/login',{email:param1,password:param2},{ withCredentials: true })

        if(request.status===200){
            saveUser(request.data.data)
        }
        }catch(err){
            console.log(err)
        }
    }

    const saveUser = (para:LoginData) => {
        const payload = {
            _id:para.user._id,
            username:para.user.username,
            email:para.user.email,
            fullName:para.user.fullName,
            avatar:para.user.avatar,
            coverImage:para.user?.coverImage||'',
            watchHistory:para.user.watchHistory||[],
            createdAt:para.user.createdAt,
            updatedAt:para.user.updatedAt,
            // accessToken:para.accessToken,
            // isLoggedIn:true
        }

        dispatch(addUserDetails({user:payload,accessToken:para.accessToken,isLoggedIn:true}))
        navigate(from,{replace:true})
    }

  return (
    <div className='bg-black w-[100%] h-[100dvh] flex flex-col items-center justify-center'>
        <section className='grid grid-cols-1 md:grid-cols-[50%_50%]'>
        <div className='w-[70%] lg:w-[50%] flex items-center justify-center mx-auto md:border-r md:border-gray-300'>
            <img src={logo} className='md:w-[90%] mx-auto' />
        </div>
        <main className='flex flex-col items-center'>
        <form className='flex flex-col gap-4 w-[70%] mb-8' action={submitHandler}>
            <div className='w-[90%] mx-auto'>
                <p className='text-slate-300'>Email</p>
                <input type="email" value={user.email} name="email" onChange={changeHandler} className='border border-gray-400 h-[36px] lg:h-[40px] text-gray-50 p-2 w-[100%] mx-auto lg:text-lg' />
            </div>
            <div className='w-[90%] mx-auto'>
                <p className='text-slate-300'>Password</p>
                <input type="password" value={user.password} name="password" onChange={changeHandler} className='border-gray-400 border h-[36px] text-gray-50 p-2 w-[100%] lg:h-[40px] lg:text-lg' />
            </div>
            <button className='text-slate-300 text-lg  bg-[#7734ec] p-2 w-[50%] mx-auto rounded-2xl font-bold cursor-pointer' onClick={submitHandler}>
                Login
            </button>
        </form>
        <div className='w-[100%] mt-4'>
            <div className='text-gray-300 w-[100%] flex relative'>
                <p className='w-[100%] h-[1px] bg-gray-600'></p>
                <p className=' w-fit bg-black absolute top-[-15px] left-1/2 -translate-x-1/2'>
                    No account yet?
                </p>
            </div>
            <button className='text-gray-400 w-[50%] mt-8 p-2 rounded-2xl ml-[25%] border-[#593d88] border'>
                Sign up
            </button>
        </div>
        </main>
        </section>
    </div>
  )
}
