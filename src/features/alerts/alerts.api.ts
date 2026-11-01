import { api } from "../../api/AxiosInstance.ts";
import {videoPublishToggleType} from './publish.types.ts'

export async function toggleVideoPublish(videoId: string) {
    const request = await api.patch<videoPublishToggleType>(
        `/videos/toggle/publish/${videoId}`
    );

    return request.data.data;
}
