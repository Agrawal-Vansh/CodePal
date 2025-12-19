import { io } from "socket.io-client";

const socket = () => {
  return io(import.meta.env.VITE_SERVER_URL, {
    transports: ["websocket"],
    reconnectionAttempts: Infinity,
    timeout: 10000,
  });
};

export default socket;
