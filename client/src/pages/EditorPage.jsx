import React ,{useRef,useEffect}from 'react'
import { useLocation,useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard'
import Editor from '../components/Editor'
import socket from './Socket';
function EditorPage() {
    const socketRef=useRef(null);
    const location=useLocation();
    const {roomId}=useParams();
    useEffect(()=>{
        const init=async()=>
        {
            socketRef.current=await socket();
            socketRef.current.emit('join', {
                roomId,
                username: location.state?.username
              });
        }
        init();
    },[]);
  return (
    <>
   <div className="flex h-screen  w-screen">
      {/* Member Section */}
      <div className="w-1/5 bg-gray-800 ">
        <Dashboard />
      </div>

      {/* Editor Section */}
      <div className="w-4/5 bg-gray-50">
        <Editor />
      </div>
    </div>
    </>
  )
}

export default EditorPage
