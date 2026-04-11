import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorResponse {
    code: number;
    status: string;
    message?: string;
    statusText?:string
  }

type ErrorProps = {
    error : ErrorResponse
}

export const ErrorWall:React.FC<ErrorProps> = ({error}) => {
    return <div className='flex flex-col items-center justify-center gap-3 w-full min-h-[24rem] max-h-[30rem]'>
        {error&&<p className=' font-sans text-slate-50'>{error.code} - {error.status}</p>}
        <p className='p-4 font-poppins text-slate-50 capitalize text-3xl'>We got an Error :(</p>
        <Link to="/" className='bg-sky-400 py-2 px-4 font-poppins rounded-md'>Back to Home</Link>
    </div>
}