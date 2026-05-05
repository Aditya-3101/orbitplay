import React from 'react'
import { Link } from 'react-router'
import BrowserSVG from '../../assets/Browser.svg'

export const ErrorPage = ({msg}:{msg:string}) => {
  return (
    <section className='font-roboto text-gray-300 h-full w-full flex flex-col items-center justify-center gap-2'>
        <img src={BrowserSVG} className='w-[30%] md:w-[20%] mx-auto' />
        <div className='flex flex-col gap-2'>
        <p>Something Went Wrong while fetching the {msg}</p>
        <Link className='w-fit px-2 py-1 bg-gray-200 text-gray-950 my-2 cursor-pointer rounded mx-auto' to="/">Back to Home</Link>
        </div>
    </section>
  )
}
