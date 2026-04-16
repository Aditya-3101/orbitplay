import React,{useState} from 'react';
import { NavLink, useNavigate } from 'react-router';
import {Menu,Search,Video} from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import {toggleSideBar} from '../../app/slices/toggleSlice.ts'

export const Header:React.FC = () => {

    const [search,setSearch] = useState<string>('')
    const user = useSelector((state:RootState)=>state.user.userTemp)
    const currentSidebarStatus = useSelector((state:RootState)=>state.toggle.sideBar)
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

  return (
    <div className='w-[100%] border grid justify-between py-4 md:p-4 relative items-center grid-cols-[15%_60%_15%] md:grid-cols-[5%_5%_50%_10%_15%] gap-[4px] md:gap-[8px] bg-gray-950'>
        <p className='hidden cursor-pointer md:block' onClick={changeSideBar}><Menu color="gray"/></p>
        <NavLink className='text-gray-200 text-center flex flex-col items-center justify-center' to="/">
            <Video className='text-gray-200 text-4xl' />
            <span className='text-[8px]'>VideoTube</span>
        </NavLink>
        <form className='relative font-teko flex items-center border border-gray-400 rounded-xl' action={onSubmit}>
            <input className='w-[80%] md:w-[90%] h-[40px] p-2 text-gray-200 font-roboto focus:outline-0' title="search-bar" autoFocus={false} autoComplete='off' value={search} onChange={changeHandler} type='search' placeholder='Search anything.....' />
            <Search className='text-gray-200 w-[20%] md:w-[10%]' onClick={onSubmit} />
        </form>
        <NavLink className='hidden md:block font-oswald' to="/upload">
            <p className='text-xl text-gray-200'>Upload</p>
        </NavLink>
        <NavLink className='w-[100%] font-oswald text-center flex items-center justify-center' to="/Account">
            <img src={user?.avatar} className='aspect-square rounded-full w-[2.4rem] object-cover' />
        </NavLink>
    </div>
  )
}
