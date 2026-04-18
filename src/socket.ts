import { Server, Socket } from "socket.io";
import { db } from "./config/knex";
import { Messages } from "./Interface/message.Interface";
import { CreateMessagesDTO, UpdateMessagesDTO } from "./Dto/message.dto";

export function initSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log(`Socket conectado: ${socket.id}`);

        // usuário entra na sala do chat
        socket.on("joinChat", (chat_id: number) => {
            socket.join(`chat_${chat_id}`);
            console.log(`Socket ${socket.id} entrou no chat ${chat_id}`);
        });

        // usuário envia mensagem
        socket.on("sendMessage", async (data: CreateMessagesDTO) => {
            // salva no banco
            await db<Messages>("message").insert(data);

            // envia para todos na sala exceto quem enviou
            socket.broadcast.to(`chat_${data.chat_id}`).emit("receivedMessage", data);
        });

        socket.on("disconnect", () => {
            console.log(`Socket desconectado: ${socket.id}`);
        });
    });
}