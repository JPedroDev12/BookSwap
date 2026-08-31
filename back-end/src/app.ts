import express from "express";
import cors from "cors";
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
import authRoutes from "./Routes/authRoutes"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/chats", chatRoutes);
app.use("/messages", messagesRoutes);
app.use("/books", bookRoutes)
app.use("/bookTrades", bookTradeRoutes)
app.use("/matches", matchesRoutes)
app.use("/swapping", swappingRoutes)
app.use("/userBook", userBookRoutes)
app.use("/userPage", userPageRoutes)
app.use("/users", userRoutes)
app.use("/auth", authRoutes)

// Handler de erro global: garante que qualquer erro (inclusive os que
// "escapam" de um async/await sem try/catch) volte como JSON com uma
// mensagem legível, em vez de um 500 em branco/HTML difícil de depurar.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erro não tratado:", err);

  if (err?.code === "ER_DATA_TOO_LONG") {
    return res.status(400).json({
      Error: `O campo "${err.sqlMessage?.match(/column '(.+?)'/)?.[1] || "desconhecido"}" recebeu um valor muito grande para o banco.`,
    });
  }

  if (err?.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ Error: "Esse registro já existe." });
  }

  return res.status(500).json({
    Error: "Erro interno no servidor. Tente novamente em instantes.",
  });
});

initSocket(io); // inicializa o socket

server.listen(3000, () => {
  console.log("Servidor aberto porta 3000");
});