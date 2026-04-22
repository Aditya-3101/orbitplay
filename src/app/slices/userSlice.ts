import {createSlice} from '@reduxjs/toolkit'

interface userInterface {
    _id:string,
    username:string,
    email:string,
    fullName:string,
    avatar:string,
    coverImage?:string,
    watchHistory:Array<string>,
    createdAt?:string,
    updatedAt?:string,
    __v?:string,
}

interface initialStateInterface{
    userTemp:userInterface | null;
    accessToken:string|null,
    isLoggedIn:boolean,
    isAuthLoading:boolean
}



const initialState:initialStateInterface = {
    userTemp :{
        _id :'',
        username:'',
        email:'',
        fullName:'',
        avatar:'',
        coverImage:'',
        watchHistory:[],
        createdAt:'',
        updatedAt:'',
        __v:'',
    },
    accessToken:'',
    isLoggedIn:false,
    isAuthLoading: true
}

export const userDetailSlice = createSlice({
    name:"userLogin",
    initialState,
    reducers:{
        addUserDetails: (state,action)=>{
            const userInput = {
                _id:action.payload._id,
                username:action.payload.username,
                email:action.payload.email,
                fullName:action.payload.fullName,
                avatar:action.payload.avatar,
                coverImage:action.payload?.coverImage||'',
                watchHistory:action.payload?.watchHistory||[],
                createdAt:action.payload?.createdAt,
                updatedAt:action.payload?.updatedAt,
                __v:action.payload?.__v,
            }
            state.userTemp = action.payload.user
            state.accessToken = action.payload.accessToken;
            state.isLoggedIn=action.payload.isLoggedIn;
        },
        setAuthLoading:(state,action)=>{
            state.isAuthLoading = action.payload
        },
        updateUserAvatar:(state,action)=>{
            if(state.userTemp) state.userTemp.avatar = action.payload
        },
        updateUserCover:(state,action)=>{
            if(state.userTemp) state.userTemp.coverImage = action.payload
        },
        updateUserAccount:(state,action)=>{
            if(state.userTemp){
                state.userTemp.fullName=action.payload.fullName,
                state.userTemp.email=action.payload.email
            }
        }
    }

})

export const {addUserDetails,setAuthLoading,updateUserAvatar,updateUserCover,updateUserAccount} = userDetailSlice.actions

export default userDetailSlice.reducer;