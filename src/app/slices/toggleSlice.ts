import { createSlice } from "@reduxjs/toolkit";

interface initialStateInterface {
    sideBar:boolean,
    msg:string|null,
    accountOptionToggle:boolean
}

const initialState:initialStateInterface = {
    sideBar:true,
    msg:null,
    accountOptionToggle:false
}

export const toggleSlice = createSlice({
    name:"toggle",
    initialState,
    reducers:{
        toggleSideBar:(state,action)=>{
            state.sideBar = action.payload
        },
        messageModal:(state,action)=>{
            state.msg = action.payload
        },
        openAccountBar:(state,action)=>{
            state.accountOptionToggle=action.payload
        }
    }
})

export const {toggleSideBar,messageModal,openAccountBar} = toggleSlice.actions;

export default toggleSlice.reducer