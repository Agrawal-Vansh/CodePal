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
    socket.to(roomId).emit("codeUpdate", { code, language });
  });
  socket.on("syncCode", ({ socketId, code, language }) => {
    // console.log(`Code change in room ${roomId} with language ${language}`);
    io.to(socketId).emit("syncCode", { code, language });
  });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
