import { io } from "socket.io-client";

let socketInstance = null;

const createSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });
  }
  return socketInstance;
};

export default createSocket;
