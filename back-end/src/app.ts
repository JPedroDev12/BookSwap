import express from "express";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
import chatRoutes from "./Routes/chatRoutes";
import messagesRoutes from "./Routes/messagesRoutes";
import bookRoutes from "./Routes/bookRoutes"
import bookTradeRoutes from "./Routes/bookTradeRoutes"
import matchesRoutes from "./Routes/matchesRoutes"
import swappingRoutes from "./Routes/swappingRoutes"
import userBookRoutes from "./Routes/userBookRoutes"
import userPageRoutes from "./Routes/userPageRoutes"
import userRoutes from "./Routes/userRoutes"



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const port = 3000
const host = '0.0.0.0'



app.use(express.json());
app.use("/chats", chatRoutes);
app.use("/messages", messagesRoutes);
app.use("/books", bookRoutes)
app.use("/bookTrades", bookTradeRoutes)
app.use("/matches", matchesRoutes)
app.use("/swapping", swappingRoutes)
app.use("/userBook", userBookRoutes)
app.use("/userPage", userPageRoutes)
app.use("/users", userRoutes)



initSocket(io); // inicializa o socket



server.listen(port, host, () => {
  console.log(`Servidor aberto http://${host}:${port}`);
});