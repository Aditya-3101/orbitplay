import { createSlice } from "@reduxjs/toolkit";

interface initialStateInterface {
    sideBar:boolean
}

const initialState:initialStateInterface = {
    sideBar:true
}

export const toggleSlice = createSlice({
    name:"toggle",
    initialState,
    reducers:{
        toggleSideBar:(state,action)=>{
            state.sideBar = action.payload
        }
    }
})

export const {toggleSideBar} = toggleSlice.actions;

export default toggleSlice.reducer