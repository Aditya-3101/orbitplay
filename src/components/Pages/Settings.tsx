import React,{useEffect} from 'react';
import { SectionHeader } from '../Header/sectionHeader';
import {Image, UserPen, LogOut, CircleUser} from 'lucide-react'
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { openAccountBar } from '../../app/slices/toggleSlice';
import {clearUser} from '../../app/slices/userSlice'
import { api } from '../../api/AxiosInterceptor';

const Settings = ():React.JSX.Element => {

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
    ]

    const dispatch = useDispatch()
    

    useEffect(()=>{
        dispatch(openAccountBar(false))
    },[])

    function getIcon(par:string):React.ReactNode{
        switch(par){
            case 'UserPen': return <UserPen/>;
            case 'Image':return <Image/>;
            case 'CircleUser':return <CircleUser />;
        }
    }

    async function logOutSession():Promise<void> {
        try {
            const request = await api.post('/users/logout',{})
    
            if(request.status===200){
                dispatch(clearUser(null))
                // navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }



  return (
    <div>
        <section className='bg-[rgb(0,0,0,0.9)]'>
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
                <div className='text-gray-300 font-roboto flex flex-row px-4 py-2 gap-2 cursor-pointer' onClick={logOutSession}>
                    <LogOut/>
                    Logout</div>
            </div>
        </section>
    </div>
  )
}

export default Settings