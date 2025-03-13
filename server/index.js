import express from "express";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()

const corsOptions = {
  origin: process.env.CORS_ORIGIN  , // Specify your allowed frontend origins as an environment variable
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true,
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors:corsOptions
});

app.use(cors(corsOptions));


const userSocketMap = {};
const roomData = {}; // Stores code and language for each room

const getAllConnectedUsers = (roomId) =>{ 
  
  return io.sockets.adapter.rooms.get(roomId) ?
  [...io.sockets.adapter.rooms.get(roomId)].map((socketId) =>{
      return  {
        socketId,
        username:userSocketMap[socketId]
      }}) 
  : []
};
io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}`);

  socket.on("join", ({roomId,username}) => {
    // console.log(`User with socket id ${socket.id} joined room ${roomId} with username ${username}`);
    
    if (!roomData[roomId]) {
      roomData[roomId] = { code: "// Write your code here!", language: "cpp" };
    }


    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const users=getAllConnectedUsers(roomId);
    // console.log(user);
    users.forEach(({socketId})=>{
      io.to(socketId).emit("newUserJoined", {
        users,
        username,
        socketId:socket.id
      });
    })
    console.log(roomData[roomId]);
    // Send the current room code and language to the newly joined user
    if (roomData[roomId]) {
      socket.emit("initializeCode", roomData[roomId]); // Check this line
      console.log("I am sending code");
      
    }

    // setTimeout(() => {
    //   if (roomData[roomId]) {
    //     // socket.emit("initializeCode", roomData[roomId]);
    //     io.to(roomId).emit("initializeCode", roomData[roomId]);
    //   }
    // }, 100);
    

  });
  
  socket.on("disconnecting",()=>{
    console.log(`User disconnected with socket id ${socket.id}`);
    
    const rooms=[...socket.rooms];
    rooms.forEach((roomId)=>{
      socket.in(roomId).emit("disconnected",{
        socketId:socket.id,
        username:userSocketMap[socket.id]
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  })
  socket.on("codeChange", ({ roomId, code, language }) => {
    // console.log(`Code change in room ${roomId} with language ${language}`);
      // Update room data
      if (roomData[roomId]) {
        roomData[roomId] = { code, language };
      }
    socket.to(roomId).emit("codeUpdate", { code, language });
  });
 
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
