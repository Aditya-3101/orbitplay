import React from 'react'
import {House,CircleUserRound,Tv,History, UserRound,ThumbsUp} from 'lucide-react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store'

export const SideBar = () => {
    const username = useSelector((state:RootState)=>state.user.userTemp?.username)
  return (
    <div>
        <div className='bg-[rgba(0,0,0,0.9)] border-r border-gray-400 sidebar '>
            <Link to="/" className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <House />
                <p>Home</p>
            </Link>
            <Link to={`/channel/${username}`} className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <CircleUserRound />
                <p>My channel</p>
            </Link>
            <Link to="/subscriptions" className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <Tv />
                <p>Subscriptions</p>
            </Link>
            <Link to="/history" className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <History />
                <p>History</p>
            </Link>
            <Link to="/account" className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <UserRound />
                <p>My Account</p>
            </Link>
            <Link to="/account" className='flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'>
                <ThumbsUp />
                <p>Liked Videos</p>
            </Link>
        </div>
    </div>
  )
}
