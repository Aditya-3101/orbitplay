import { api } from '../../api/AxiosInterceptor.ts';
import type {GetVideosResponse} from './videos.types.ts'

export async function fetchHomeVideos(par:number){
    const req = await api.get<GetVideosResponse>(`/videos/all/v?page=${par}`)
      return req.data.data;
}