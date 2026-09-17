import {useEffect,useState} from 'react';

export const useDebounce = (value:string,delay:number=100)=>{
    const [debouncedSearch,setDebouncedSearch] = useState(value);

    useEffect(()=>{
        
        const timeOut = setTimeout(()=>{
            setDebouncedSearch(value);
        },delay)

        return () =>clearTimeout(timeOut);

    },[delay,value])

    return debouncedSearch;
}