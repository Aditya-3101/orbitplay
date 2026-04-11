import React from 'react'

export const SectionHeader = ({title,size}) => {
  return (
    <div className={`font-roboto text-[#f1f1f1] ${size} p-2`}>{title}</div>
  )
}
