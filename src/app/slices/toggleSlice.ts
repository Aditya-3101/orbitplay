import { createSlice } from "@reduxjs/toolkit";

interface initialStateInterface {
    sideBar:boolean,
    msg:string|null
}

const initialState:initialStateInterface = {
    sideBar:true,
    msg:null
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
        }
    }
})

export const {toggleSideBar,messageModal} = toggleSlice.actions;

export default toggleSlice.reducer