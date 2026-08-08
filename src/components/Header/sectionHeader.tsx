import React,{memo} from 'react'

export const SectionHeader = memo(({title,size}:{title:string,size:string}) => {
  return (
    <div className={`font-roboto text-[#f1f1f1] ${size} p-2`}>{title}</div>
  )
})
