export interface VideoType {
    _id: string;
    videoFile?: string;
    thumbnail: string;
    owner: {
        _id: string;
        username: string;
        avatar: string;
        fullName?: string;
    };
    title: string;
    description?: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
    __v?: number;
}