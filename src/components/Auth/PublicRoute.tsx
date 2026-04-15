import { useSelector } from 'react-redux';
import {RootState} from '../../app/store/store.ts';
import {Outlet, Navigate} from 'react-router-dom';
import React from 'react';

export const PublicRoute:React.FC = () => {
    const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
    const accessToken = useSelector((state:RootState)=>state.user.accessToken)

    if(accessToken){
        return <Navigate to="/" replace />
    }

    return <Outlet/>
}

