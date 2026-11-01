import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store/store.ts'
import { toggleDeleteVideoOverlay } from '../../app/slices/toggleSlice.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { deletedVideoDetails } from '../../features/Accounts/accounts.api.ts';

export const OpenDeleteVideoModal = () => {

  const selectedVideoForDelete = useSelector((state:RootState)=>state.video.selectedVideo);
  const dispatch = useDispatch<AppDispatch>()
  const queryClient = useQueryClient();
  const {mutate,isPending,isError} = useMutation({
    mutationFn:deletedVideoDetails,
    onSuccess:async()=>{
      dispatch(toggleDeleteVideoOverlay())
      await Promise.all(
        [
          queryClient.invalidateQueries({queryKey:['channelVideos']}),
          queryClient.invalidateQueries({queryKey:['video',selectedVideoForDelete?._id]})
        ]
      )
    }
  })
  

  function closeEditVideoOverlay():void{
    dispatch(()=>dispatch(toggleDeleteVideoOverlay()))
  }

  function deleteVideo(event:React.MouseEvent<HTMLButtonElement>):void|null{
    event.preventDefault();

    if(selectedVideoForDelete?._id===undefined) return;

    mutate({videoId:selectedVideoForDelete._id})
  }


  return (
    <div>
      return<div className='absolute top-0 left-0 right-0 h-dvh overflow-hidden bg-[rgba(20,20,20,0.96)] z-20 flex items-center justify-center font-roboto'>
            {selectedVideoForDelete&&<div className='border-gray-300 border rounded-3xl flex flex-col items-center w-4/5 md:w-[30rem] p-4 bg-[rgb(10,10,10)]'>
                <p className='text-lg md:text-xl mb-2 w-[90%] text-gray-200 flex justify-between items-center'>
                    <span>Delete the video</span>
                    <span className='border border-gray-400 rounded-lg cursor-pointer'><X onClick={closeEditVideoOverlay} /></span>
                </p>
                {isError&&<div className='border border-red-700 p-2 text-gray-300 my-2'>We encountered problem while deleting your video, please try again later..</div>}
                <div className="w-[90%]">
                    <div className="w-full mx-auto grid grid-cols-[35%_65%] gap-0.5 items-stretch">
                        <div className='relative object-center rounded-2xl'>
                        {selectedVideoForDelete&&<img src={selectedVideoForDelete.thumbnail} className='w-full h-full object-contain' alt={selectedVideoForDelete.title} />}
                        </div>
                        <div className='w-full px-0.5'>
                            <p className='text-gray-300 text-base font-semibold py-0.5'>{selectedVideoForDelete.title}</p>
                            <p className='text-gray-300 text-xs overflow-y-auto h-12'>{selectedVideoForDelete.description}</p>
                        </div>
                    </div>
                </div>

                <p className='text-gray-300 text-sm md:text-xl my-2'>Are you sure?</p>

              <div className='w-[90%] my-4 relative flex items-center justify-between'>
                <button 
                className={`text-[rgb(10,10,10)] text-center p-2 rounded-lg bg-gray-300 border border-gray-300 transition-opacity ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'}`}  disabled={isPending} onClick={deleteVideo}>
                    {isPending?'Deleting...':'Delete'}</button>

                <button 
                className="text-center p-2 rounded-lg border border-gray-300 text-gray-300 transition-opacity cursor-pointer"  disabled={isPending} onClick={closeEditVideoOverlay}>Cancel</button>
              </div>
            </div>}
            </div>
    </div>
  )
}
