import React,{memo, Suspense} from "react";
import {Outlet} from 'react-router-dom';
import {Header} from '../Header/Header.tsx'
import { SideBar } from "../Header/SideBar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store.ts";
import { useHeaderHeight } from "../../hooks/useHeaderHeight.ts";

const MainContainer = memo(({ children }: { children: React.ReactNode }): React.JSX.Element => {
    const sideBarStatus = useSelector((state: RootState) => state.toggle.sideBar);

    return (
        <main 
            className={
                sideBarStatus 
                    ? "layout transition-transform duration-500 ease-in-out bg-[rgb(0,0,0)] overflow-clip p-1 relative" 
                    : "bg-[rgb(0,0,0)] layout_player p-1 relative"
            }
        >
            {children}
        </main>
    );
});

MainContainer.displayName = "MainContainer";

export const HomeLayout = ():React.JSX.Element => {
    const headerRef = useHeaderHeight();
    const sideBarStatus = useSelector((state: RootState) => state.toggle.sideBar);

    return<MainContainer>
        <div ref={headerRef} className="grid-area-header sticky top-0 z-10 bg-black">
            <Header />
        </div>
        <SideBar/>
        <div className={`grid-area-content min-h-dvh ${sideBarStatus&& "border-l border-gray-400"}`}>
            <Suspense fallback={<h2 className="p-4 text-xl">Loading....</h2>}>
            <Outlet/>
            </Suspense>
        </div>
    </MainContainer>
}