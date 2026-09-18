import React from 'react';
import { NavLink, useNavigate,Link } from 'react-router';
import {ArrowUpFromLine, Menu} from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import {toggleSideBar,openAccountBar} from '../../app/slices/toggleSlice.ts'
import {clearUser} from '../../app/slices/userSlice.ts'
import { api } from '../../api/AxiosInterceptor.ts';
import Logo from '../../assets/logo.svg'
import { SearchVideos } from '../../features/search/SearchVideos.tsx';
import {convertImageExtension} from '../../utility/covertImageFormat.ts'


export const Header:React.FC = () => {

    const user = useSelector((state:RootState)=>state.user.userTemp)
    const currentSidebarStatus = useSelector((state:RootState)=>state.toggle.sideBar)
    const currentAccountBarStatus = useSelector((state:RootState)=>state.toggle.accountOptionToggle)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const changeSideBar = ():void => {
        dispatch(toggleSideBar(!currentSidebarStatus))
    }

    const toggleAccountBar = ():void =>{
        dispatch(openAccountBar(!currentAccountBarStatus))
    }

    async function logOutSession():Promise<void> {
        try {
            const request = await api.post('/users/logout',{})
    
            if(request.status===200){
                dispatch(clearUser(null));
                sessionStorage.removeItem("accessToken");
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <nav className='w-full grid justify-between py-4 lg:p-4 relative items-center grid-cols-[15%_60%_20%] lg:grid-cols-[5%_15%_60%_5%_10%] gap-1 lg:gap-[8px] bg-[rgba(0,0,0,0.9)] border-b border-gray-400'>
        <p className='hidden cursor-pointer lg:flex md:justify-center' onClick={changeSideBar}><Menu color="gray"/></p>
        <div className='text-gray-200 text-center flex flex-col items-center justify-center'>
        <NavLink  to="/">
            <img src={Logo} className='object-cover w-[2.2rem] md:w-[2.5rem] lg:w-[3rem] aspect-[8/6]' alt="OrbitPlay Logo" aria-label="orbitplay logo" />
        </NavLink>
        </div>
        <SearchVideos/>
        <NavLink className='hidden lg:block font-oswald' to="/upload">
            <ArrowUpFromLine color="rgb(240,240,240)" className='mx-auto cursor-pointer' />
        </NavLink>
        <div className='w-full font-oswald text-center flex items-center justify-center relative'>
            {user?.avatar&&<img src={convertImageExtension(user.avatar,60)} alt={user?.username} loading='lazy' className='aspect-square rounded-full w-[2.4rem] object-cover border border-gray-400 cursor-pointer' 
            onClick={toggleAccountBar}/>}
            <div className={` ${!currentAccountBarStatus&&"hidden"} absolute flex flex-col top-[110%] left-[-100%] md:left-0 bg-[rgba(0,0,0,0.9)] 
            [&_a]:border [&_a]:border-gray-200 [&_div]:border [&_div]:border-gray-200 font-roboto z-10`}>
                <Link to={`/upload`} className='text-gray-300 bg-black px-4 py-1'>Upload</Link>
                <Link to={`/Account`} className='text-gray-300 bg-black px-4 py-1'>My Account</Link>
                <Link to={`/my-posts`} className='text-gray-300 bg-black px-4 py-1'>My Posts</Link>
                <Link to={`/subscriptions`} className='text-gray-300 bg-black px-4 py-1'>Subscriptions</Link>
                <Link to={`/Liked-videos`} className='text-gray-300 bg-black px-4 py-1'>Liked Videos</Link>
                <Link to={`/history`} className='text-gray-300 bg-black px-4 py-1'>Watch history</Link>
                <Link to={`/settings`} className='text-gray-300 bg-black px-4 py-1'>Settings</Link>
                <div className='text-gray-300 bg-black px-4 py-1 cursor-pointer' aria-label="logout button" onClick={logOutSession}>Logout</div>
            </div>
        </div>
    </nav>
  )
}
