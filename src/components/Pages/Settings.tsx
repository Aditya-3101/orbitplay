import React,{useEffect} from 'react';
import { SectionHeader } from '../Header/sectionHeader';
import {Image, UserPen, LogOut, CircleUser} from 'lucide-react'
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { openAccountBar } from '../../app/slices/toggleSlice';

const Settings = () => {

    const arr = [
        {
            id:1,
            text:"Update Avatar",
            icon:"UserPen",
            path:"update-avatar"
        },
        {
            id:2,
            text:"Update Cover Image",
            icon:"Image",
            path:"update-cover"
        },
        {
            id:3,
            text:"Update Account",
            icon:"CircleUser",
            path:"update-account"
        },
        {
            id:4,
            text:"Logout",
            icon:"LogOut",
            path:"logout"
        }
    ]

    const dispatch = useDispatch()
    

    useEffect(()=>{
        dispatch(openAccountBar(false))
    },[])

    function getIcon(par:string){
        switch(par){
            case 'UserPen': return <UserPen/>;
            case 'Image':return <Image/>;
            case 'CircleUser':return <CircleUser />;
            case 'LogOut':return <LogOut/>;
        }
    }

  return (
    <div>
        <section>
            <div>
                <SectionHeader title="Settings" size="text-lg md:text-xl" />
            </div>
            <div className='flex flex-col gap-1 [&_a]:border-b [&_a]:border-gray-200 w-[90%] mx-auto'>
                {arr.map((par)=>{
                    return<Link to={`/settings/${par.path}`} key={par.id} className='text-gray-300 font-roboto flex flex-row px-4 py-2 gap-2 cursor-pointer'>
                        <span>{getIcon(par.icon)}</span>
                        <span>{par.text}</span>
                    </Link>
                })}
            </div>
        </section>
    </div>
  )
}

export default Settings