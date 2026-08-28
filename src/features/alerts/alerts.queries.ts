import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVideoPublish } from "./alerts.api";
import { messageModal } from "../../app/slices/toggleSlice";
import { useDispatch } from "react-redux";
import type { InfiniteData } from '@tanstack/react-query';
import { GetChannelVideosResponse } from "../Accounts/accounts.types";

export function useToggleVideoPublish() {
    const queryClient = useQueryClient();

    const dispatch = useDispatch()

    return useMutation({
        mutationFn: toggleVideoPublish,

        onSuccess: (updatedVideo) => {

            queryClient.setQueryData<InfiniteData<GetChannelVideosResponse>>(
                ['channelVideos',updatedVideo.owner],
                (oldData)=>{
                    if(!oldData) return oldData;
                        return {
                            ...oldData,
                            pages: oldData?.pages.map((page) => ({
                                ...page,
                                allVideos: page?.data.allVideos.map((video) =>video._id === updatedVideo._id? updatedVideo : video)
                            }))
                        };
                }
            )

            // update cache here
            //dispatch(updateVideoVisibility(updatedVideo.data.data));
            dispatch(messageModal(`Video is now set to ${updatedVideo.isPublished===true?"Public":"Private"}`))
        },

        onError: (error) => {
            console.error(error);
        },
    });
}
