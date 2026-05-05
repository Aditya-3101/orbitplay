import React from 'react'
import { Link } from 'react-router';
import ErrorSVG from '../../assets/Error.svg'


const EmptyPage:React.FC = () => {
  return (
    <div>
        <div className='fixed top-0 right-0 bottom-0 left-0 bg-[rgb(20,20,20)] flex items-center justify-center font-roboto text-gray-100'>
            <div className='text-lg flex flex-col items-center justify-center gap-4'>
                <img src={ErrorSVG} className='md:w-[90%] mx-auto' />
                <p>Page Not Found</p>
                <Link className='w-fit px-2 py-1 bg-gray-200 text-gray-950 my-2 cursor-pointer rounded' to="/">Back to Home</Link>
            </div>
        </div>
    </div>
  )
}

export default EmptyPage;
