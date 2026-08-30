import axios, { AxiosInstance } from "axios";
import { host } from "../Constants.ts";
import {store} from '../app/store/store.ts';
import { addUserDetails } from "../app/slices/userSlice";

interface refreshTokenResponse{
    statusCode: number,
    data: {
        safeUser: {
            _id: string,
            username: string,
            email: string,
            fullName: string,
            avatar: string,
            coverImage: string,
            watchHistory:{
                    video: string,
                    watchedOn: string,
                    _id: string
                }[],
            createdAt: string,
            updatedAt: string,
            __v: 0
        },
        accessToken: string,
        refreshToken: string
    },
    message: string,
    success: number
}

export const api:AxiosInstance = axios.create({
    baseURL:`${host}/api/v1`,
    withCredentials:true,
})

let refreshPromise: Promise<void> | null = null;

api.interceptors.request.use((config) => {
    
    const token = sessionStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
    
    },
    (error) => Promise.reject(error)
);


api.interceptors.request.use((request)=>{    return request},(error)=>{
    //sconsole.log(error)
    return Promise.reject(error)
})

api.interceptors.response.use((response)=>{
    return response
},async(error)=>{
    const originalRequest = error.config;

    if(!originalRequest){
        return Promise.reject(error)
    }

    if(originalRequest.url?.includes('/refresh-token')){
        console.log("returning promise")
        store.dispatch(addUserDetails({user:null,isLoggedIn:false}));
        sessionStorage.removeItem("accessToken");
        return Promise.reject(error)
    }


    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

    try {
        if (!refreshPromise) {
            refreshPromise = api
                .post<refreshTokenResponse>('/users/refresh-token', {}, {
                    withCredentials: true
                })
                .then((data) => {
                    const accessToken = data.data.data.refreshToken
                    sessionStorage.setItem("accessToken", accessToken);
                    console.log("Token refreshed");
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        await refreshPromise;

        return api.request(originalRequest);

    } catch (err) {
        return Promise.reject(err);
    }
}

    return Promise.reject(error)
})