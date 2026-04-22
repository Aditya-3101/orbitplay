import React from 'react';
import { useLocation,Link } from 'react-router';
import { ChangeAvatar } from './ChangeAvatar.tsx';
import { ChangeCover } from './ChangeCover.tsx';
import { UpdateAccountDetails } from './UpdateAccountDetails.tsx';

const options = () => {
    const location = useLocation()
    const currentPath = getpath(location.pathname)

    function getpath(par:string){
        switch(par){
            case '/settings/update-avatar':
                return 'update-avatar';
            case '/settings/update-cover':
                return 'update-cover';
            case '/settings/change-password':
                return 'change-password';
            case '/settings/update-account':
                return 'update-account'
        }
    }    

  return (
    <div>
        <section className='bg-[rgba(0,0,0,0.85)] font-roboto grid grid-cols-1'>
            <div className='text-gray-400 font-roboto flex flex-row items-center p-4'>
                <Link to="/settings">Settings</Link>/<p>{currentPath}</p>
            </div>
            <div className='w-[90%] mx-auto border-t border-gray-400'>
                {currentPath==="update-avatar"&&<ChangeAvatar/>}
                {currentPath==="update-cover"&&<ChangeCover/>}
                {currentPath==="update-account"&&<UpdateAccountDetails/>}
            </div>
        </section>
    </div>
  )
}

export default options