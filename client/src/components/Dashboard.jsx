import {React,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { toast } from 'react-hot-toast';
import Logo from '../assets/Logo.png';
import User from './User';

function Dashboard({users,roomId}) {
   const navigate=useNavigate();
   const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
   };
  return (
    <>
      <div className="bg-gray-800 text-white flex flex-col h-full w-full p-4">
        <img src={Logo} alt="Logo" className="h-24" />
        <div className="flex flex-col overflow-auto">
        {users.map((user) => (
            <User key={user.socketId} username={user.username} />
        ))}
        </div>
        <div className="flex flex-col gap-2 mt-auto">
            <hr/>
          <button
            onClick={handleCopyRoomId}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2"
          >
            Copy Room ID
            <FaRegCopy />
          </button>
          <button
          onClick={()=>navigate("/home")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2"
          >
            Leave Room
            <IoMdExit />
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
