import { useSelector } from 'react-redux';
import {RootState} from '../../app/store/store.ts';
import {Outlet, Navigate,useLocation} from 'react-router';
import React from 'react';

export const ProtectRoute:React.FC = () => {
    const {isLoggedIn} = useSelector((state:RootState)=>state.user)
    const location = useLocation()

    if(!isLoggedIn){
        return <Navigate to="/login" state={{from:location}} replace />
    }


    return <Outlet/>
}

