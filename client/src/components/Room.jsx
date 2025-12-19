// Room.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import Editor from "./Editor";
import Dashboard from "./Dashboard";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const socketRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const username = location.state?.userName;

  useEffect(() => {
    // 🔐 HARD GUARD
    if (!username) {
      navigate("/home");
      return;
    }

    socketRef.current = io(SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      socket.emit("join", { roomId, username });
      setIsSocketReady(true);
    };

    const handleNewUserJoined = ({ users, joinedUser }) => {
      setUsers(users);
      if (joinedUser && joinedUser !== username) {
        toast.success(`${joinedUser} joined the room`);
      }
    };

    const handleDisconnected = ({ socketId, username: leftUser }) => {
      setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
      if (leftUser) {
        toast.error(`${leftUser} left the room`);
      }
    };

    const handleError = (err) => {
      console.error("Socket error:", err);
      toast.error("Socket connection failed");
      navigate("/home");
    };

    // 🔌 Attach listeners
    socket.on("connect", handleConnect);
    socket.on("newUserJoined", handleNewUserJoined);
    socket.on("disconnected", handleDisconnected);
    socket.on("connect_error", handleError);
    socket.on("connect_failed", handleError);

    return () => {
      if (socketRef.current) {
        socket.off("connect", handleConnect);
        socket.off("newUserJoined", handleNewUserJoined);
        socket.off("disconnected", handleDisconnected);
        socket.off("connect_error", handleError);
        socket.off("connect_failed", handleError);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, username, navigate]);

  const handleLeave = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate("/home");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <Dashboard
          users={users}
          roomId={roomId}
          currentUser={username}
          onLeave={handleLeave}
        />
      </div>

      <div className="flex-1">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          isSocketReady={isSocketReady}
        />
      </div>
    </div>
  );
}

export default Room;
