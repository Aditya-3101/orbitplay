import axios, { AxiosInstance } from "axios";
import { host } from "../Constants.ts";

export const api:AxiosInstance = axios.create({
    baseURL:`${host}/api/v1`,
    withCredentials:true,
})

api.interceptors.request.use((request)=>{
    return request
},
(error)=>{
    console.log(error)
    return Promise.reject(error)
})

api.interceptors.response.use((response)=>{
    return response
},
async(error)=>{
    const originalRequest = error.config;

    if(!originalRequest){
        return Promise.reject(error)
    }

    // if(originalRequest.url.includes('/refresh-token')){
    //     return Promise.reject(error)
    // }

    if(originalRequest.url?.includes('/refresh-token')){
        console.log("returning promise")
        return Promise.reject(error)
    }

    if(error?.response?.status===401&&!originalRequest._retry){
        originalRequest._retry=true
        try {
            const tokenRequest = await api.post('/users/refresh-token',{},{withCredentials:true})

            if(tokenRequest.status===200) return api.request(originalRequest)
        } catch (err) {

           // window.location.href="/login"
            return Promise.reject(err)
        }

    }

    return Promise.reject(error)
})