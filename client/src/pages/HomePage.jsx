import React, { useState } from 'react';
import Logo from '../assets/Logo.png';

function HomePage() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    if (roomId.trim() === '' || userName.trim() === '') {
      alert('Please enter both Room ID and Username');
      return;
    }
    // Logic to handle login goes here (e.g., redirect to a room or validate inputs)
    console.log('Room ID:', roomId, 'Username:', userName);
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
        <p>Don't have a Room ID ? Create New Room </p>
      </div>
    </div>
  );
}

export default HomePage;
