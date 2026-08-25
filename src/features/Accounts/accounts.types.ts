interface ChannelVideoOwner {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  }
  
  interface ChannelVideo {
    _id: string;
    videoFile: string;
    thumbnail: string;
    owner: ChannelVideoOwner;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface ChannelVideosData {
    allVideos: ChannelVideo[];
    allVideoCount: number;
    page: number;
    limit: number;
  }
  
export interface GetChannelVideosResponse {
    statusCode: number;
    data: ChannelVideosData;
    message: string;
    success: number;
  }