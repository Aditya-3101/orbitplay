import React from 'react';
import { SectionHeader } from '../Header/sectionHeader';
import {Mail, KeyRound, Image, UserPen, LogOut} from 'lucide-react'
import { Link } from 'react-router';

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
            text:"Change Password",
            icon:"KeyRound",
            path:"change-password"
        },
        {
            id:4,
            text:"Update Email",
            icon:"Mail",
            path:"update-mail"
        },
        {
            id:5,
            text:"Logout",
            icon:"LogOut",
            path:"logout"
        }
    ]

    function getIcon(par:string){
        switch(par){
            case 'UserPen': return <UserPen/>;
            case 'Image':return <Image/>;
            case 'KeyRound':return <KeyRound/>;
            case 'Mail':return <Mail/>;
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