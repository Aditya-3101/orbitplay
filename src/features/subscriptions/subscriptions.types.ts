interface userSubscriptionsInterface{
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
}

export interface SubscriptionGroup {
    _id: string;
    subscribedTo: userSubscriptionsInterface[];
}

export interface userSubscriptionsResponse{
    statusCode: number, 
    data: SubscriptionGroup[], 
    message: string, 
    success: number
}

interface allVideoObjectResponse {
    _id: string,
    videoFile: string,
    thumbnail: string,
    owner: {
        _id: string,
        username: string,
        avatar: string
    },
    title: string,
    description: string,
    duration: number,
    views: number,
    isPublished: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export interface videoObjectResponse{
    allVideos:allVideoObjectResponse[],
    allVideosCount:number,
    page:number,
    limit:number
}

export interface videosFromChannelInterface{
    statusCode: number,
    data: videoObjectResponse
    message: string,
    success: number
}
