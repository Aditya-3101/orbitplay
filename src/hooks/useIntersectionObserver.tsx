import { useEffect } from "react"

export const useIntersectionObserver = (ref:React.RefObject<HTMLDivElement | null>
    ,callback:Function) => {
        
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
