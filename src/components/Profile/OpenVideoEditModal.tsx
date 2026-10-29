import { useRef, useState } from "react"
import { toggleEditVideoOverlay } from "../../app/slices/toggleSlice"
import {useMutation,useQueryClient} from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store/store"
import { ImageUp, X } from "lucide-react"
import { updateVideoDetails } from "../../features/Accounts/accounts.api";

interface selectedDetailType{
    videoTitle:string,
    videoDescription:string,
    updatedVideoThumbnail:File|null
}

export function OpenVideoModal():React.JSX.Element{
        const [selectedVideoDetails,setSelectedVideoDetails]=useState<selectedDetailType>({
            videoTitle:'',
            videoDescription:'',
            updatedVideoThumbnail:null
        })
        const selectedVideoForEdit = useSelector((state:RootState)=>state.video.selectedVideo)
        const dispatch = useDispatch<AppDispatch>()
        const queryClient = useQueryClient();
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [updateError,setUpdatedError] = useState<string>('')


        const {mutate,isPending} = useMutation({
            mutationFn:updateVideoDetails,
            onSuccess:()=>{
                dispatch(()=>dispatch(toggleEditVideoOverlay()))
                return queryClient.invalidateQueries({
                    queryKey:['videos']
                })
            }
        });
        
        function closeEditVideoOverlay():void{
            dispatch(()=>dispatch(toggleEditVideoOverlay()))
        }

        function changeSelectedVideoHandler(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
            e.preventDefault();
            const {name,value} = e.target
    
            setUpdatedError('')
            setSelectedVideoDetails((prev)=>({
                ...prev,
                [name]:value
            }))
        }

        function handleFileSelect(event:React.ChangeEvent<HTMLInputElement>):void{
            event.preventDefault();
            const file = event.target.files?.[0] || null
            setSelectedVideoDetails((prev)=>({
                ...prev,
                updatedVideoThumbnail:file
            }))
        }

        const handleKeyDown = (event:React.KeyboardEvent) => {
            if (event?.key === 'Enter' || event?.key === ' ') {
                event.preventDefault();
                handleDivClick();
            }
        }

        const handleDivClick = () => {
            fileInputRef.current?.click();
        };

        
        
        function updateVideo(event: React.MouseEvent<HTMLButtonElement>): void|null {
            event.preventDefault();

            if((selectedVideoForEdit?._id===null||selectedVideoForEdit?._id===undefined)||selectedVideoDetails.videoTitle.trim().length<4||selectedVideoDetails.videoDescription.trim().length<4){
                setUpdatedError("Invalid title or description")
                return null;
            }

            mutate({
                updatedThumbnail:selectedVideoDetails.updatedVideoThumbnail,
                videoId:selectedVideoForEdit?._id,
                videoTitle:selectedVideoDetails.videoTitle,
                videoDescription:selectedVideoDetails.videoDescription
            })
        }

        return<div className='absolute top-0 left-0 right-0 h-dvh overflow-hidden bg-[rgba(20,20,20,0.96)] z-20 flex items-center justify-center font-roboto'>
            {selectedVideoForEdit&&<div className='border-gray-300 border rounded-3xl flex flex-col items-center w-4/5 md:w-[30rem] p-4 bg-[rgb(10,10,10)]'>
                <p className='text-lg md:text-xl mb-2 w-[90%] text-gray-200 flex justify-between items-center'>
                    <span>Edit Video Details</span>
                    <span className='border border-gray-400 rounded-lg cursor-pointer'><X onClick={closeEditVideoOverlay} /></span>
                </p>
                {updateError&&<div className='border border-red-700 p-2 text-gray-300 my-2'>{updateError}</div>}
                <div>
                    <div className="w-[90%] mx-auto grid grid-cols-[35%_65%] gap-0.5 items-stretch">
                        <div className='relative object-center rounded-2xl'>
                        {!selectedVideoDetails.updatedVideoThumbnail&&<img src={selectedVideoForEdit.thumbnail} className='w-full h-full object-contain' alt={selectedVideoForEdit.title} />}
                        {selectedVideoDetails.updatedVideoThumbnail&&<img src={URL.createObjectURL(selectedVideoDetails.updatedVideoThumbnail)} className='w-full h-full object-contain' alt={selectedVideoDetails.videoTitle} />}
                        <div 
                        className="absolute top-0 right-0 left-0 bottom-0 bg-gray-400/30 flex items-center justify-center cursor-pointer" 
                        onClick={handleDivClick}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        >
                            <ImageUp color="#f1f1f1" />
                            <input 
                            type="file" 
                            id="fileInput" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                            />
                        </div>
                        </div>
                        <div className='w-full px-0.5'>
                            <p className='text-gray-300 text-base font-semibold py-0.5'>{selectedVideoForEdit.title}</p>
                            <p className='text-gray-300 text-xs overflow-y-auto h-12'>{selectedVideoForEdit.description}</p>
                        </div>
                    </div>
                </div>
                <div className='w-[90%] mt-2 flex flex-col'>
                    <p className='text-gray-300'>Updated Video Title</p>
                    <input type="text" value={selectedVideoDetails.videoTitle} name="videoTitle" placeholder='Enter your playlist name' className='p-2 text-gray-200 border-gray-300 border rounded-lg' onChange={changeSelectedVideoHandler} />
                </div>
                <div className='w-[90%] flex flex-col my-4'>
                    <p className='text-gray-300'>Updated Video Description</p>
                    {/* {<p className='text-red-400 text-sm'>Playlist Description should not remain empty</p>} */}
                    <textarea value={selectedVideoDetails.videoDescription} name="videoDescription" placeholder='Enter your playlist description' className='p-2 text-gray-200 border-gray-300 border resize-y min-h-12 max-h-18 rounded-lg' onChange={changeSelectedVideoHandler} />
                </div>
                <button 
                className={`text-[rgb(10,10,10)] text-center p-2 rounded-lg bg-gray-300 border border-gray-300 transition-opacity ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'}`}  disabled={isPending} onClick={updateVideo}>
                    {isPending?'updating...':'Update'}</button>
            </div>}
            </div>
    }
