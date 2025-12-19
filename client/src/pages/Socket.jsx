import { io } from "socket.io-client";

let socketInstance = null;

const createSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 20000, // Render needs more time
      withCredentials: true,
    });
  }
  return socketInstance;
};

export default createSocket;
