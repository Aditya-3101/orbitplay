import {useInfiniteQuery} from '@tanstack/react-query'
import {getChannelVideos} from './accounts.api.ts';

export function useAccountVideos(userId:string|undefined){
    
    return useInfiniteQuery({
        queryKey:["channelVideos",userId], 
        queryFn:({pageParam})=>{

        if (!userId) throw new Error("User ID is required");
        return getChannelVideos(pageParam,userId)
    },
    initialPageParam:1,

    getNextPageParam:(lastPage)=>{
        const {page,limit,allVideoCount} = lastPage.data;

        const hasMore = page*limit<allVideoCount;

        return hasMore ? page+1:undefined;
    },
    enabled:Boolean(userId&&userId.trim().length>0)
    })
}