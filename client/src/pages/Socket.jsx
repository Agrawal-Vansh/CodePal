import { io } from 'socket.io-client';

// Create the Socket.IO client instance
const socket = async()=>{ 
    const option={
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000, // before connect_error and connect_timeout are emitted.
      transports: ["websocket"],
    }
    
    return io(import.meta.env.VITE_SERVER_URL);
}

export default socket;
