interface watchHistoryVideoType{
    "_id": string,
    "video": {
        "_id": string,
        "videoFile": string,
        "thumbnail": string,
        "owner": {
            "_id": string,
            "username": string,
            "fullName":string,
            "avatar": string
        },
        "title": string,
        "description": string,
        "duration": number,
        "views": number,
        "isPublished": true,
        "createdAt": string,
        "updatedAt": string,
        "__v": number
    },
    "watchedOn": string
}

export interface watchHistoryResponse{
    "statusCode": number
    "data": watchHistoryVideoType[]
    "message": string,
    "success": number
}

export interface sortWatchHistoryType{
  today:watchHistoryVideoType[],
  yesterday:watchHistoryVideoType[],
  remaining:{
    [key:string]:watchHistoryVideoType[]
  }
}