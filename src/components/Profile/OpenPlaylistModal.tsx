import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messageModal, toggleCreatePlaylistOverlay } from '../../app/slices/toggleSlice.ts'
import { AppDispatch, RootState } from '../../app/store/store.ts'
import { getChannelPlaylist } from '../../app/thunks/channelThunk.ts'
import { api } from '../../api/AxiosInstance.ts'

interface playlistDetailType{
    playlistName:string,
    playlistDescription:string
}

interface userType{
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



export const OpenPlaylistModal = ():React.JSX.Element => {

    const dispatch = useDispatch<AppDispatch>()
    const user:userType | null = useSelector((state:RootState)=>state.user.userTemp)
    const [newPlaylistDetails,setNewPlaylistDetails]=useState<playlistDetailType>({
        playlistName:'',
        playlistDescription:''
    })

    function changePlaylistHandler(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        e.preventDefault();
        const {name,value} = e.target
    
        setNewPlaylistDetails((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    function closePlaylistOverlay():void{
        dispatch(()=>dispatch(toggleCreatePlaylistOverlay()))
    }

    async function createPlaylist():Promise<void> {
        try {
            const request = await api.post('/playlist',{name:newPlaylistDetails.playlistName,description:newPlaylistDetails.playlistDescription})
            if(request.status===201) {
                dispatch(messageModal("New playlist has been created"))
                if(user?._id!==undefined) await dispatch(getChannelPlaylist({userId:user?._id}))
                dispatch(()=>dispatch(toggleCreatePlaylistOverlay()))

            }

        } catch (error) {
            console.error(error)
        }
    }


    return<div className='absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-[rgba(20,20,20,0.96)] z-20 flex items-center justify-center font-roboto'>
        <div className='border-gray-300 border rounded-3xl flex flex-col items-center w-[30rem] p-4 bg-[rgb(10,10,10)]'>
            <p className='text-lg md:text-xl mb-2 w-[90%] text-gray-200 flex justify-between items-center'>
                <span>Create Playlist</span>
                <span className='border border-gray-400 rounded-lg cursor-pointer'><X onClick={closePlaylistOverlay} /></span>
            </p>
            <div className='w-[90%] flex flex-col'>
                <p className='text-gray-300'>Playlist Name</p>
                <input type="text" value={newPlaylistDetails.playlistName} name="playlistName" placeholder='Enter your playlist name' className='p-2 text-gray-200 border-gray-300 border rounded-lg' onChange={changePlaylistHandler} />
            </div>
            <div className='w-[90%] flex flex-col my-4'>
                <p className='text-gray-300'>Playlist Description</p>
                    {/* {<p className='text-red-400 text-sm'>Playlist Description should not remain empty</p>} */}
                <textarea value={newPlaylistDetails.playlistDescription} name="playlistDescription" placeholder='Enter your playlist description' className='p-2 text-gray-200 border-gray-300 border resize-y min-h-12 max-h-18 rounded-lg' onChange={changePlaylistHandler} />
            </div>
            <button 
            className={`text-[rgb(10,10,10)] text-center p-2 rounded-lg bg-gray-300 border border-gray-300 ${(newPlaylistDetails.playlistDescription.trim().length>0&&newPlaylistDetails.playlistName.trim().length>0)?"cursor-pointer":"cursor-no-drop"} `} disabled={(newPlaylistDetails.playlistDescription.trim().length>0&&newPlaylistDetails.playlistName.trim().length>2)?false:true} onClick={createPlaylist}>
                Create Playlist</button>
        </div>
        </div>
}
