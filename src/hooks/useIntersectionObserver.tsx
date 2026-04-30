import { useEffect } from "react"

export const useIntersectionObserver = (ref
    ,callback) => {
    useEffect(()=>{
        if(!ref.current)return;
        const observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting){
                callback()
            }
        })
        observer.observe(ref.current)
        return() => observer.disconnect();
    },[ref,callback])
}
