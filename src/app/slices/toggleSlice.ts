import { createSlice } from "@reduxjs/toolkit";

interface initialStateInterface {
    sideBar:boolean,
    msg:string|null,
    accountOptionToggle:boolean,
    createPlaylistOverlay:boolean,
    editVideoOverlay:boolean,
    deleteVideoOverlay:boolean
}

const initialState:initialStateInterface = {
    sideBar:true,
    msg:null,
    accountOptionToggle:false,
    createPlaylistOverlay:false,
    editVideoOverlay:false,
    deleteVideoOverlay:false
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
        },
        toggleCreatePlaylistOverlay:(state)=>{
            state.createPlaylistOverlay=!state.createPlaylistOverlay
        },
        toggleEditVideoOverlay:(state)=>{
            state.editVideoOverlay=!state.editVideoOverlay
        },
        toggleDeleteVideoOverlay:(state)=>{
            state.deleteVideoOverlay=!state.deleteVideoOverlay
        }
    }
})

export const {toggleSideBar,messageModal,openAccountBar,toggleCreatePlaylistOverlay,toggleEditVideoOverlay,toggleDeleteVideoOverlay} = toggleSlice.actions;

export default toggleSlice.reducer