import React from 'react'
import {House,CircleUserRound,Tv,History, UserRound,ThumbsUp, Upload, Rss, Cog} from 'lucide-react'
import { NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store/store'

interface sideBarItemsTypes {
    to:string,
    label:string,
    icon:React.ComponentType
}

export const SideBar = ():React.JSX.Element => {
    const username = useSelector((state:RootState)=>state.user.userTemp?.username)

    const sideBarItems:sideBarItemsTypes[] = [
                { to: '/', label: 'Home', icon: House },
                { to: `/channel/${username}`, label: 'My channel', icon: CircleUserRound },
                { to: '/subscriptions', label: 'Subscriptions', icon: Tv },
                { to: '/history', label: 'History', icon: History },
                { to: '/account', label: 'My Account', icon: UserRound },
                { to: '/Liked-videos', label: 'Liked Videos', icon: ThumbsUp },
                { to: '/my-posts', label: 'My Posts', icon: Rss },
                { to: '/upload', label: 'Upload video', icon: Upload },
                { to: '/settings', label: 'Settings', icon: Cog },
            ];

  return (
        <div className="bg-[rgba(0, 0, 0, 0.9)] h-full border-r border-gray-400 sidebar">
            {sideBarItems.map(({ to, label, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        isActive ? 'text-[#25c0ef] flex items-center gap-4 p-4 border-b border-gray-400'
                    : 'flex items-center gap-4 p-4 border-b border-gray-400 text-slate-200'
                    }
                >
                    {React.createElement(icon, null)}
                    <p>{label}</p>
                </NavLink>
            ))}
        </div>
  )
}
