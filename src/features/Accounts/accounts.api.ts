import { api } from "../../api/AxiosInstance.ts"
import type { GetChannelVideosResponse ,updatedVideoResponseType, requestedEditVideoParamType,deleteVideoParamType} from "./accounts.types.ts"

export async function getChannelVideos(pageNum:number,userId?:string):Promise<GetChannelVideosResponse>{
    const request = await api.get<GetChannelVideosResponse>(`/videos/channel?Page=${pageNum}&userId=${userId}`)
    return request.data
}

export async function updateVideoDetails({updatedThumbnail=null,videoId,videoTitle,videoDescription}:requestedEditVideoParamType):Promise<updatedVideoResponseType>{
    const request = await api.patch<updatedVideoResponseType>(`/videos/${videoId}`,{
        title:videoTitle,
        description:videoDescription,
        thumbnail:updatedThumbnail
    },
    {
        headers:{
          'Content-Type':'multipart/form-data'
        }
    });

    return request.data;
}

export async function deletedVideoDetails({videoId}:deleteVideoParamType){
    const request = await api.delete(`/videos/${videoId}`);

    return request.data
}