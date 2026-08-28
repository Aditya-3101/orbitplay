export interface videoPublishToggleType{
    statusCode: number,
    data: {
        _id: string,
        videoFile: string,
        thumbnail: string,
        owner: string,
        title: string,
        description: string,
        duration: number,
        views: number,
        isPublished: boolean,
        createdAt: string,
        updatedAt: string,
        __v: 0
    },
    message: string,
    success: number
}