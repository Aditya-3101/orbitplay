import React, { useEffect, useState } from "react";
import {Search} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { api } from "../../api/AxiosInterceptor";
import type { searchResponseType,allVideoTypes } from "./searchResponse.types.ts";


export const SearchVideos = () =>{
    
    const [search,setSearch] = useState<string>('');
    const [searchSuggestions,setSearchSuggestions]=useState<allVideoTypes[]>()

    const navigate = useNavigate()

    const debouncedSearch = useDebounce(search,350)

    useEffect(()=>{
    const AutoSearchSuggestions = async(param:string)=>{
        if(!param||param.length<2) return;

        try{
            const req = await api.post<searchResponseType>(`/videos/v/search?query=${param}`)

            setSearchSuggestions(req.data.data.allVideos)

        }catch(err){
            console.log(err)
        }
    }
        AutoSearchSuggestions(debouncedSearch)
    },[debouncedSearch])

    
    const onSubmit = (e:React.SyntheticEvent):void => {
        e.preventDefault();
        if(search!==null&&search.length>0) navigate(`/videos/search?q=${encodeURIComponent(search)}`) 
        setSearch('')
    }

    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setSearch(e.target.value)
    }

    const navigateToResults = (e:React.SyntheticEvent,arg1:string):void =>{
        e.preventDefault();
        if(arg1!==null&&arg1.length>0) navigate(`/videos/search?q=${arg1}`);
        setSearch('')
    }
      
    return<div className="relative flex flex-col">
    <form className='relative font-teko flex items-center border border-gray-400 rounded-xl' onSubmit={onSubmit}>
        <input className='w-[80%] md:w-[90%] h-10 p-2 text-gray-200 font-roboto focus:outline-0' title="search-bar" autoFocus={false} autoComplete='off' value={search} onChange={changeHandler} type='search' placeholder='Search anything.....' />
        <Search className='text-gray-200 w-[20%] md:w-[10%] cursor-pointer' onClick={onSubmit} />
    </form>
    <div className='bg-black my-2 absolute z-10 left-0 right-0 top-full'>
        {(search&&searchSuggestions)&&searchSuggestions.map((par,index)=>{
            return<div key={index} className="w-full relative">
                <p onClick={(e)=>navigateToResults(e,par.title)} className='block w-full px-1 text-gray-300 border-b border-b-gray-700'>{par.title}</p>
            </div>
        })}
    </div>
    </div>
}