import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store/store.ts';
import {messageModal} from '../../app/slices/toggleSlice.ts'

const OverLayDialouge= () => {

  const modalMessage = useSelector((state:RootState)=>state.toggle.msg)
  const dispatch = useDispatch()


  useEffect(()=>{
    setTimeout(togglemessage,3000)
  },[modalMessage])

  function togglemessage(){
    dispatch(messageModal(null))
  }

  return (
    <div>
      {modalMessage!==null&&<div className={`fixed right-0 top-[70dvh] md:top-[85dvh] left-0 w-fit h-fit mx-auto  bg-transparent flex items-center justify-center`}>
        <p className='text-gray-300 bg-[rgba(0,0,0,0.6)] w-fit font-roboto py-1.5 px-2.5 rounded-xl z-40'>{modalMessage}</p>
      </div>}
    </div>
  )
}

export default OverLayDialouge;