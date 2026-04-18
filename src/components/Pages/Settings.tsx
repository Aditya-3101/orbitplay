import React from 'react';
import { SectionHeader } from '../Header/sectionHeader';
import {Mail, KeyRound, Image, UserPen, LogOut} from 'lucide-react'

const Settings = () => {

    const arr = [
        {
            id:1,
            text:"Update Avatar",
            icon:"UserPen"
        },
        {
            id:2,
            text:"Update Cover Image",
            icon:"Image"
        },
        {
            id:3,
            text:"Change Password",
            icon:"KeyRound"
        },
        {
            id:4,
            text:"Update Email",
            icon:"Mail"
        },
        {
            id:5,
            text:"Logout",
            icon:"LogOut"
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
            <div className='flex flex-col gap-1 [&_p]:border-b [&_p]:border-gray-200 w-[90%] mx-auto'>
                {arr.map((par)=>{
                    return<p key={par.id} className='text-gray-300 font-roboto flex flex-row px-4 py-2 gap-2 cursor-pointer'>
                        <span>{getIcon(par.icon)}</span>
                        <span>{par.text}</span>
                    </p>
                })}
            </div>
        </section>
    </div>
  )
}

export default Settings