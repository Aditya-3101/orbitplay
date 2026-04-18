import React,{Suspense} from "react";
import {Outlet} from 'react-router-dom';
import {Header} from '../Header/Header.tsx'
import { SideBar } from "../Header/SideBar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store.ts";

export const HomeLayout:React.FC = () => {
    const sideBarStatus = useSelector((state:RootState)=>state.toggle.sideBar)
    return<main className={sideBarStatus?"layout transition-transform duration-500 ease-in-out bg-[rgba(0,0,0,0.9)] overflow-hidden":"layout_player"}>
        <div className="grid-area-header">
        <Header />
        </div>
        <div className={sideBarStatus?"grid-area-sideBar":"hidden"}>
        <SideBar/>
        </div>
        <div className="grid-area-content">
        <Suspense fallback={<h2 className="p-4 text-xl">Loading....</h2>}>
            <Outlet/>
        </Suspense>
        </div>
    </main>
}