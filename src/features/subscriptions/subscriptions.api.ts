import { api } from "../../api/AxiosInterceptor.ts";
import type {videosFromChannelInterface,videoObjectResponse,userSubscriptionsResponse,SubscriptionGroup} from './subscriptions.types.ts'


export async function getFollowedChannels(userId:string|undefined):Promise<SubscriptionGroup[]|undefined>{
    if(userId===undefined) return;
    const req = await api.get<userSubscriptionsResponse>(`subscriptions/c/${userId}`)

    return req.data.data
}

export async function fetchVideosFromSubscribedChannels(params:string,pageParam:number):Promise<videoObjectResponse>{
    const req = await api.get<videosFromChannelInterface>(`/videos/subscriptions/v/${params}?page=${pageParam}`)

    return req.data.data;
}