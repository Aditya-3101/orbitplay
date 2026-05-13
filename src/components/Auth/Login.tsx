import React,{useState} from 'react';
import logo from '../../assets/logo.png';
import {useDispatch} from 'react-redux';
import {addUserDetails} from '../../app/slices/userSlice.ts';
import { useNavigate,useLocation,Link } from 'react-router';
import { api } from '../../api/AxiosInterceptor.ts';
import { ErrorPage } from '../Pages/ErrorPage.tsx';
import WarningSignLogo from '../../assets/incorrect.svg'

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
    const [error,setError] = useState<number|null>(null)
    const [userFormError,setUserFormError] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const [loading,setLoading]=useState<boolean>(false);
    const from = location.state?.from || "/"


    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>):void=>{
        const {name,value} = e.target;

        setUser((prev)=>({
            ...prev,
            [name]:value as string
        }))
    }

    const submitHandler = ():void =>{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPsw = /^.{4,}$/
        if(user.email.length!==0 && user.password.length!==0){
            if(regexEmail.test(user.email)&&regexPsw.test(user.password)){
                callLogin(user.email,user.password);
            }
        }else{
            console.log("validation failed")
            setUserFormError(true)
        }
    }

    const callLogin = async(param1:string,param2:string) => {
        setLoading(true)
        try{
        const request = await api.post<LoginResponse>('/users/login',{email:param1,password:param2})
        if(request.status===200){
            const {accessToken} = request.data.data
            sessionStorage.setItem("accessToken", accessToken);
            saveUser(request.data.data)
            setUserFormError(true)
            setError(null)
            setLoading(false)
        }
        }catch(err){
            console.log(typeof err?.status)
            setError(err?.status)
            setLoading(false)
        }
    }

    const saveUser = (para:LoginData):void => {
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

    const resetError = ():void =>{
        setError(null)
    }

    if(error!==null){
        if(error===401) {
            return <section className={`font-roboto text-gray-300 w-full flex flex-col items-center justify-center gap-2 bg-[rgb(20,20,20)] h-[100dvh] relative }`}>
            <img src={WarningSignLogo} className='w-[30%] md:w-[20%] mx-auto' />
            <div className='flex flex-col gap-2'>
                <p className='text-center text-lg lg:text-2xl font-bold'>The password you entered is incorrect</p>
            <button onClick={resetError} className='w-fit px-2 py-1 bg-gray-200 text-gray-950 my-2 cursor-pointer rounded mx-auto'>Try again</button>
            </div>
        </section>
        }
        if(error===404) {
            return <section className={`font-roboto text-gray-300 w-full flex flex-col items-center justify-center gap-2 bg-[rgb(20,20,20)] h-[100dvh] relative }`}>
            <img src={WarningSignLogo} className='w-[30%] md:w-[20%] mx-auto' />
            <div className='flex flex-col gap-2'>
                <p className='text-center text-lg lg:text-2xl font-bold'>No Account Found!</p>
            <button onClick={resetError} className='w-fit px-2 py-1 bg-gray-200 text-gray-950 my-2 cursor-pointer rounded mx-auto'>Try again</button>
            </div>
        </section>
        }
        if(error===500){
        return<ErrorPage msg="Login Page"/>
        }
      }

    function navigateToRegister():void{
        navigate('/register')
    }

  return (
    <div className='bg-black w-[100%] h-[100dvh] flex flex-col items-center justify-center relative'>
        <section className='grid grid-cols-1 md:grid-cols-[50%_50%]'>
        <div className='w-[70%] lg:w-[50%] flex items-center justify-center mx-auto md:border-r md:border-gray-300'>
            <img src={logo} className='md:w-[90%] mx-auto' />
        </div>
        <main className='flex flex-col items-center'>
        <form className='flex flex-col gap-6 w-[70%] mb-8' action={submitHandler}>
            <div className='w-[90%] mx-auto'>
                <p className='text-slate-300'>Email</p>
                {userFormError&&user.email.length==0&&<p className='text-sm text-red-400'>Kindly fill the Email-id</p>}
                <input type="email" value={user.email} name="email" onChange={changeHandler} className='border border-gray-400 h-[38px] lg:h-[40px] text-gray-50 p-2 w-[100%] mx-auto lg:text-lg rounded-xl' />
            </div>
            <div className='w-[90%] mx-auto'>
                
                <p className='text-slate-300'>Password</p>
                {userFormError&&user.password.length==0&&<p className='text-sm text-red-400'>Kindly fill the password</p>}
                <input type="password" value={user.password} name="password" onChange={changeHandler} className={`border-gray-400 border ${(userFormError&&user.password.length==0)&&"border-red-400"} h-[38px] text-gray-50 p-2 w-[100%] lg:h-[40px] lg:text-lg rounded-xl`} />
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
            <button className='text-gray-400 w-[50%] mt-8 p-2 rounded-2xl ml-[25%] border-[#593d88] border cursor-pointer' onClick={navigateToRegister}>
                Sign up
            </button>
        </div>
        </main>
        </section>
        {loading&&<div className='absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.76)] flex justify-center items-center gap-2'>
          <div className="loader"></div>
            <div className='font-roboto text-gray-200 text-center'>
              Loading....
            </div>
            </div>}
    </div>
  )
}
