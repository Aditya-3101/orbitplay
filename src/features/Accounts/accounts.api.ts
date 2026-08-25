import { api } from "../../api/AxiosInterceptor"
import type { GetChannelVideosResponse } from "./accounts.types.ts"


export async function getChannelVideos(pageNum:number,userId?:string):Promise<GetChannelVideosResponse>{
    const request = await api.get<GetChannelVideosResponse>(`/videos/channel?Page=${pageNum}&userId=${userId}`)
    return request.data
}