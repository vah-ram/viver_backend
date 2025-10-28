import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import UserRouter from "./controllers/UserController.js";
import MessageRouter from "./controllers/MessageController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/', UserRouter);
app.use('/messages/', MessageRouter);

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_PORT,
        methods: ["GET", "POST"]
    }
});

mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Mongodb Connected!!"))
        .catch(err => console.log(err));

server.listen( process.env.SERVER_PORT || 5000, () => {
    console.log("Server is listening to Port: 5000")
});

io.on("connection", (socket) => {
    console.log(`Socket connected to Id: ${socket.id}`);

    socket.on("send_message", () => {
        io.emit("receive_message");
    });

    socket.on("add_contact", () => {
        io.emit("added_contact");
    });
});