import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Dashboard from "../components/Dashboard";
import Editor from "../components/Editor";
import createSocket from "./Socket";

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [users, setUsers] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    // HARD GUARD
    if (!location.state?.userName) {
      navigate("/home");
      return;
    }

    socketRef.current = createSocket();

    const handleError = (err) => {
      console.error("Socket error:", err);
      toast.error("Socket connection failed");
      navigate("/home");
    };

    socketRef.current.on("connect_error", handleError);
    socketRef.current.on("connect_failed", handleError);

    socketRef.current.on("connect", () => {
      setIsSocketReady(true);

      socketRef.current.emit("join", {
        roomId,
        username: location.state.userName,
      });
    });

    socketRef.current.on("newUserJoined", ({ users, joinedUser }) => {
      setUsers(users);

      if (joinedUser && joinedUser !== location.state.userName) {
        toast.success(`${joinedUser} joined the room`);
      }
    });

    socketRef.current.on("disconnected", ({ socketId, username }) => {
      toast.error(`${username} left the room`);
      setUsers((prev) =>
        prev.filter((user) => user.socketId !== socketId)
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="md:w-1/5 w-2/5 bg-gray-800">
<Dashboard
  users={users}
  roomId={roomId}
  currentUser={location.state.userName}
  onLeave={() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate("/home");
  }}
/>
      </div>

      {/* Editor */}
      <div className="md:w-4/5 w-3/5 bg-gray-50">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          isSocketReady={isSocketReady}
        />
      </div>
    </div>
  );
}

export default EditorPage;
