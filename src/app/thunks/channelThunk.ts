import axios from "axios";
import { host } from "../../Constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export const getChannelDetails = createAsyncThunk(
    "channel/channelDetails",
    async({userId,username}:{userId?:string|unknown,username?:string|unknown},{getState,rejectWithValue})=>{
        try {
            const state = getState() as RootState;
            const token = state.user.accessToken;

            let finalUserId = userId

            if(!finalUserId && username){

            const channelUser = await axios.get(`${host}/api/v1/users/c/${username}`,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            const channelUserDetails = channelUser.data.data
            finalUserId = channelUserDetails._id;
            var userDetails = channelUserDetails
           }

           if (!finalUserId) {
            throw new Error("No userId or username provided");
          }

            const req = await axios.get(`${host}/api/v1/videos?userId=${finalUserId}`,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            const userVideos = req.data.data

            const userPlaylists = await axios.get(`${host}/api/v1/playlist/user/${finalUserId}`,
            {  withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            return {
                channelUserDetails:userDetails,
                userVideos,
                userPlaylist:userPlaylists.data.data
            }

        } catch (err) {
            return rejectWithValue(err?.message||"failed to fetch Account Data")
        }
    }
)