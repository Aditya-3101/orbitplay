import { useSelector } from 'react-redux';
import {RootState} from '../../app/store/store.ts';
import {Outlet, Navigate,useLocation} from 'react-router';
import React from 'react';

export const ProtectRoute:React.FC = () => {
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)
    const location = useLocation()

    if(!accessToken){
        return <Navigate to="/login" state={{from:location}} replace />
    }

    return <Outlet/>
}

