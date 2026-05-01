import React,{useState} from 'react';
import { NavLink, useNavigate,Link } from 'react-router';
import {Menu,Search} from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import {toggleSideBar,openAccountBar} from '../../app/slices/toggleSlice.ts'
import {clearUser} from '../../app/slices/userSlice.ts'
import { api } from '../../api/AxiosInterceptor.ts';
import Logo from '../../assets/logo.svg'

export const Header:React.FC = () => {

    const [search,setSearch] = useState<string>('')
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const currentSidebarStatus = useSelector((state:RootState)=>state.toggle.sideBar)
    const currentAccountBarStatus = useSelector((state:RootState)=>state.toggle.accountOptionToggle)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const onSubmit = () => {
        navigate(`/videos/search?q=${encodeURIComponent(search)}`)
        setSearch('')
    }

    const changeSideBar = () => {
        dispatch(toggleSideBar(!currentSidebarStatus))
    }

    const toggleAccountBar = () =>{
        dispatch(openAccountBar(!currentAccountBarStatus))
    }

    async function logOutSession() {
        try {
            const request = await api.post('/users/logout',{})
    
            if(request.status===200){
                dispatch(clearUser(null))
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-[100%] border grid justify-between py-4 md:p-4 relative items-center grid-cols-[15%_60%_20%] md:grid-cols-[5%_5%_50%_10%_15%] gap-[4px] md:gap-[8px] bg-gray-950'>
        <p className='hidden cursor-pointer md:flex md:justify-center' onClick={changeSideBar}><Menu color="gray"/></p>
        <NavLink className='text-gray-200 text-center flex flex-col items-center justify-center' to="/">
            {/* <Video className='text-gray-200 text-4xl' />
            <span className='text-[8px]'>VideoTube</span> */}
            <img src={Logo} className='object-cover w-[2.2rem] md:w-[2.5rem] lg:w-[3rem]' />
        </NavLink>
        <form className='relative font-teko flex items-center border border-gray-400 rounded-xl' action={onSubmit}>
            <input className='w-[80%] md:w-[90%] h-[40px] p-2 text-gray-200 font-roboto focus:outline-0' title="search-bar" autoFocus={false} autoComplete='off' value={search} onChange={changeHandler} type='search' placeholder='Search anything.....' />
            <Search className='text-gray-200 w-[20%] md:w-[10%]' onClick={onSubmit} />
        </form>
        <NavLink className='hidden md:block font-oswald' to="/upload">
            <p className='text-xl text-gray-200 text-center'>Upload</p>
        </NavLink>
        <div className='w-[100%] font-oswald text-center flex items-center justify-center relative'>
            <img src={user?.avatar} className='aspect-square rounded-full w-[2.4rem] object-cover border border-gray-400 cursor-pointer' 
            onClick={toggleAccountBar}/>
            <div className={` ${!currentAccountBarStatus&&"hidden"} absolute flex flex-col top-[100%] left-[-100%] md:left-0 bg-[rgba(0,0,0,0.9)] 
            [&_a]:border [&_a]:border-gray-200 [&_div]:border [&_div]:border-gray-200 font-roboto z-10`}>
                <Link to={`/upload`} className='text-gray-300 bg-black px-4 py-1'>Upload</Link>
                <Link to={`/Account`} className='text-gray-300 bg-black px-4 py-1'>My Account</Link>
                <Link to={`/subscriptions`} className='text-gray-300 bg-black px-4 py-1'>Subscriptions</Link>
                <Link to={`/Liked-videos`} className='text-gray-300 bg-black px-4 py-1'>Liked Videos</Link>
                <Link to={`/history`} className='text-gray-300 bg-black px-4 py-1'>Watch history</Link>
                <Link to={`/settings`} className='text-gray-300 bg-black px-4 py-1'>settings</Link>
                <div className='text-gray-300 bg-black px-4 py-1 cursor-pointer' onClick={logOutSession}>Logout</div>
            </div>
        </div>
    </div>
  )
}
