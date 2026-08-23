interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  owner: {
    _id:string,
    username:string,
    avatar:string
  };
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface videoDataType{
  result:Video[],
  videosCount: number,
  page: number,
  limit: number
}

export interface GetVideosResponse {
  statusCode: number;
  data: videoDataType;
  message: string;
  success: number;
}
