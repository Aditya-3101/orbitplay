import React from 'react'
import { Link } from 'react-router'
import BrowserSVG from '../../assets/Browser.svg'

export const ErrorPage = ({msg}:{msg:string}):React.JSX.Element => {
  return (
    <section className={`font-roboto text-gray-300 w-full flex flex-col items-center justify-center gap-2 ${msg==="Login Page"?"bg-[rgb(20,20,20)] h-[100dvh]":"h-full"}`}>
        <img src={BrowserSVG} className='w-[30%] md:w-[20%] mx-auto' />
        <div className='flex flex-col gap-2'>
        {msg!=="Login Page"&&<p>Something Went Wrong while fetching the {msg}</p>}
        {msg==="Login Page"&&<p className='text-center text-lg lg:text-xl font-bold'>500 Internal Server Error</p>}
        {msg!=="Login Page"&&<Link className='w-fit px-2 py-1 bg-gray-200 text-gray-950 my-2 cursor-pointer rounded mx-auto' to="/">Back to Home</Link>}
        {msg==="Login Page"&&<p>Something Went wrong while connecting to server, kindly try after some time</p>}
        </div>
    </section>
  )
}
