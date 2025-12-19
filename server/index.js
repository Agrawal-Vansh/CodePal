import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

/* ================= APP ================= */

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

/* ================= STATE ================= */

// socketId -> username
const userSocketMap = {};

// roomId -> { code, language, version }
const roomData = {};

/* ================= HELPERS ================= */

const getUsersInRoom = (roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];

  return [...room].map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
};

/* ================= SOCKET ================= */

io.on("connection", (socket) => {
  console.log("🟢 CONNECT:", socket.id);

  /* ---------- JOIN ---------- */
  socket.on("join", ({ roomId, username }) => {
          for (const room of socket.rooms) {
        if (room !== socket.id) socket.leave(room);
      }

    console.log("➡️ JOIN:", socket.id, roomId, username);

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    // Initialize room if not exists
    if (!roomData[roomId]) {
      roomData[roomId] = {
        code: "// Write your code here!",
        language: "cpp",
        version: 0,
      };
      console.log("🆕 ROOM CREATED:", roomId);
    }

    // Send initial state ONLY to joining user
    socket.emit("initializeCode", roomData[roomId]);

    // Notify everyone in room
    io.to(roomId).emit("newUserJoined", {
      users: getUsersInRoom(roomId),
      joinedUser: username,
    });
  });

  /* ---------- CODE CHANGE ---------- */
  socket.on("codeChange", ({ roomId, code, language, version }) => {
    const room = roomData[roomId];

    if (!room) {
      console.warn("⚠️ codeChange before join:", roomId);
      return;
    }

    console.log("✏️ CODE CHANGE");
    console.log("   socket:", socket.id);
    console.log("   client version:", version);
    console.log("   server version:", room.version);

    // Reject stale updates
    if (version !== room.version) {
      console.log("⛔ STALE UPDATE → syncRequired");
      socket.emit("syncRequired", room);
      return;
    }

    if (room.code === code && room.language === language) {
      return; // no-op update
    }


    // Accept update
    roomData[roomId] = {
      code,
      language,
      version: room.version + 1,
    };

    console.log("✅ ACCEPTED → new version:", roomData[roomId].version);

    // Broadcast authoritative state
    io.to(roomId).emit("codeUpdate", roomData[roomId]);
  });

  /* ---------- DISCONNECT ---------- */
  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];

    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue;

      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username,
      });
    }

    delete userSocketMap[socket.id];
  });

  socket.on("disconnect", () => {
    console.log("🔴 DISCONNECT:", socket.id);
  });
});

/* ================= START ================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log(`🌍 CORS allowed: ${CLIENT_ORIGIN}`);
});
