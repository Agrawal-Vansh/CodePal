import express from "express";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()
console.log(process.env.CORS_ORIGIN);


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





io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`User disconnected with socket id ${socket.id}`);
    
  });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
