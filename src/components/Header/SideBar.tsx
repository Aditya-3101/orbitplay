import React from 'react'
import {House,CircleUserRound,Tv,History, UserRound,ThumbsUp, Upload, Rss, Cog} from 'lucide-react'
import { NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store'

export const SideBar = () => {
    const username = useSelector((state:RootState)=>state.user.userTemp?.username)
  return (
    <div>
        <div className='bg-[rgba(0,0,0,0.9)] h-full border-r border-gray-400 sidebar '>
            <NavLink to="/"  className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <House />
                <p>Home</p>
            </NavLink>
            <NavLink to={`/channel/${username}`} className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <CircleUserRound />
                <p>My channel</p>
            </NavLink>
            <NavLink to="/subscriptions" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <Tv />
                <p>Subscriptions</p>
            </NavLink>
            <NavLink to="/history" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <History />
                <p>History</p>
            </NavLink>
            <NavLink to="/account" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <UserRound />
                <p>My Account</p>
            </NavLink>
            <NavLink to="/Liked-videos" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <ThumbsUp />
                <p>Liked Videos</p>
            </NavLink>
            <NavLink to="/my-posts" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <Rss />
                <p>My Posts</p>
            </NavLink>
            <NavLink to="/upload" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <Upload/>
                <p>Upload video</p>
            </NavLink>
            <NavLink to="/settings" className={({isActive})=>(isActive?"text-[rgb(37,192,239)] flex items-center gap-4 p-4 border-b border-gray-400":'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200')}>
                <Cog />
                <p>Settings</p>
            </NavLink>
        </div>
    </div>
  )
}
