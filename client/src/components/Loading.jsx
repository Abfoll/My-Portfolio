import React from 'react'

const Loading = () => {
  return (
   <div className='w-100 d-flex align-items-center justify-content-center' style={{height:"100vh"}}>
    <div className="spinner-border"  role="status" style={{width:"5rem",height:"5rem"}}>
          <span className="visually-hidden" >Loading...</span>
        </div>
   </div>
  )
}

export default Loading