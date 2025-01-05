import React from 'react'
import Avatar from 'react-avatar'
function Client({username}) {

  return (
    <>
    <div className="flex items-center gap-2 m-2">
        <Avatar name={username} size='50' margin="14px" className='rounded full'/>
        <span>{username}</span>
    </div>
    </>
  )
}

export default Client
