import { addUserDetails,setAuthLoading } from "../../app/slices/userSlice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { api } from "../../api/AxiosInterceptor.ts";

export const refreshUser = async (dispatch: Dispatch<UnknownAction>):Promise<void> => {

  dispatch(setAuthLoading(true))
    
    try {
      const res = await api.get("/users/current-user");

      if(res.status===200){

        const payload = {
          _id:res.data.data._id,
          username:res.data.data.username,
          email:res.data.data.email,
          fullName:res.data.data.fullName,
          avatar:res.data.data.avatar,
          coverImage:res.data.data?.coverImage||'',
          watchHistory:res.data.data.watchHistory||[],
          createdAt:res.data.data.createdAt,
          updatedAt:res.data.data.updatedAt,
          // accessToken:para.accessToken,
          // isLoggedIn:true
      }
  
      dispatch(addUserDetails({
        user:payload,
        //accessToken:res.data.data.accessToken,
        isLoggedIn: true
      }));
    }
  
    } catch (err) {
      dispatch(addUserDetails({
        user:null,
        isLoggedIn:false
      }))
    }
    finally {
        dispatch(setAuthLoading(false));
      }
  };