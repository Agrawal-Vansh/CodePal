import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import v4 for generating unique IDs
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';

function HomePage() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (roomId.trim() === '' || userName.trim() === '') {
      toast.error('Please enter both Room ID and Username');
      return;
    }
    if (roomId.trim().length < 5) {
      toast.error('Room ID must be at least 5 characters long');
      return;
    }
    navigate(`/editor/${roomId}`,{state:userName})
    toast.success('Room Created  Successfully');
  };

  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); 
    setRoomId(newRoomId); 
    toast.success("Room ID generated Successfully ")

    setTimeout(() => navigate(`/editor/${roomId}`,{state:userName}), 1000);
  };

  return (
    <div className="bg-gray-800 text-white h-screen flex flex-col items-center justify-center space-y-6">
      <img src={Logo} alt="Logo" className="h-24" />
      <h1 className="text-2xl font-bold">Enter the Room ID </h1>

      <div className="flex flex-col space-y-4 w-80">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-3 bg-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="p-3 bg-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Join Room
        </button>
        <button
          onClick={handleCreateRoom}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
}

export default HomePage;
