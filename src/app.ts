import express from "express";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
import chatRoutes from "./Routes/chatRoutes";
import messageRoutes from "./Routes/messageRoutes";
// ... outras rotas

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
// ... outras rotas

initSocket(io); // inicializa o socket

server.listen(3000, () => {
    console.log("Servidor aberto porta 3000");
});