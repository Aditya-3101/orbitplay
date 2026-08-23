import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHomeVideos } from "./videos.api.ts";

export function useHomeVideos(){
    return useInfiniteQuery({
    queryKey:['videos'], 
    queryFn:({pageParam}) => {
      return fetchHomeVideos(pageParam)
    },
    initialPageParam:1,

    getNextPageParam:(lastPage)=>{
      const {page,limit,videosCount} = lastPage;

      const hasMore = page*limit<videosCount;

      return hasMore ? page+1:undefined;
    }
    })
}