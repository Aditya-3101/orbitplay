import axios from "axios";
import { addUserDetails,setAuthLoading } from "../../app/slices/userSlice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export const refreshUser = async (dispatch: Dispatch<UnknownAction>) => {
    
    try {
      const res = await axios.post("http://localhost:8000/api/v1/users/refresh-token",{}, {
        withCredentials: true
      });

      console.log(res.data)
  
      dispatch(addUserDetails({
        user:res.data.data.safeUser,
        accessToken:res.data.data.accessToken,
        isLoggedIn: true
      }));
  
    } catch (err) {
      console.log("User not logged in");
    }
    finally {
        dispatch(setAuthLoading(false)); // 👈 important
      }
  };