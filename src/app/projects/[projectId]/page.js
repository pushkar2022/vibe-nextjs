

import React from 'react'

const  Page=async({params}) =>{
      console.log(`000000`,params)
   const {projectId}=await params;
   

  return (
    <div>{`page${projectId}`}</div>
  )
}

export default Page