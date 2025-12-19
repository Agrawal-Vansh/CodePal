import React from "react";
import { FaRegCopy } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { toast } from "react-hot-toast";
import Logo from "../assets/Logo.png";
import User from "./User";

  // NOT navigation or socket control

function Dashboard({
  users = [],
  roomId,
  currentUser,
  onLeave,
}) {
  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard");
  };

  const handleLeave = () => {
    toast("Leaving room...");
    if (typeof onLeave === "function") {
      onLeave(); // parent handles socket + navigation
    }
  };

  return (
    <div className="bg-gray-800 text-white flex flex-col h-full w-full p-4">
      <img src={Logo} alt="Logo" className="h-24 mb-4" />

      {/* USERS */}
      <div className="flex flex-col overflow-auto">
        {users.length === 0 && (
          <div className="p-2 text-gray-400">No users in room</div>
        )}

        {users.map((user) => {
          if (!user?.username) return null;

          return (
            <User
              key={user.socketId}
              username={
                user.username === currentUser
                  ? `${user.username} (You)`
                  : user.username
              }
            />
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 mt-auto">
        <hr className="my-2" />

        <button
          onClick={handleCopyRoomId}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          Copy Room ID <FaRegCopy />
        </button>

        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          Leave Room <IoMdExit />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
