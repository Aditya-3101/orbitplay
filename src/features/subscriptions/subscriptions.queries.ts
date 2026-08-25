import {useInfiniteQuery,useQuery} from '@tanstack/react-query';
import {getFollowedChannels,fetchVideosFromSubscribedChannels} from './subscriptions.api.ts';

export function useSubscribedChannels(userId:string|undefined){
    return useQuery({
        queryKey:['FollowedChannels',userId],
        queryFn:()=>getFollowedChannels(userId),
        enabled:!!userId
    })
}

export function useVideosfromSubscribedChannels(selectedChannel:string){
    return useInfiniteQuery({
        queryKey:['videosFromChannels',selectedChannel],
        
        queryFn:({pageParam})=>fetchVideosFromSubscribedChannels(selectedChannel,pageParam),
        initialPageParam:1,
        
        getNextPageParam:(lastPage)=>{
            const {page,limit,allVideosCount} = lastPage;
                
            const hasMore = page*limit<allVideosCount;
    
            return hasMore?page+1:undefined
        },
        enabled:!!selectedChannel
    })
}