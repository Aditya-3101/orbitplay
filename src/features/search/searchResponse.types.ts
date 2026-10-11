export interface allVideoTypes{
    _id: string,
    title: string,
    thumbnail?:string
}

export interface searchResponseType{
    statusCode: number,
    data: {
        allVideos: allVideoTypes[]
        page: number,
        limit: number
    },
    message: string,
    success: number
}