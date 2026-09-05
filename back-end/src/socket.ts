import { Server, Socket } from "socket.io";
import { db } from "./config/knex";
import { Messages } from "./Interface/messages.Interface";
import { CreateMessagesDTO } from "./Dto/messages.dto";

export function initSocket(io: Server) {
    io.on("connection", (socket: Socket) => { // quando um usuário conecta
        
        console.log(`Socket conectado: ${socket.id}`); // mostra que o usuário conectou

        // joinChat = evento que o cliente chama para entrar em um chat específico
        socket.on("joinChat", async ({ chat_id, user_id }: { chat_id: number; user_id: number }) => {

            const chat = await db("chat").where({ id: chat_id }).first();
            if (!chat || (chat.user1_id !== user_id && chat.user2_id !== user_id)) {
                socket.emit("chatError", "Você não faz parte dessa conversa");
                return;
            }

            socket.join(`chat_${chat_id}`); 
            // entra na "sala" do chat
            // tudo que for enviado para essa sala vai só para quem estiver nela

            // busca mensagens antigas no banco
            const messages = await db<Messages>("messages")
                .where({ chat_id })
                .orderBy("created_at");

            socket.emit("previousMessages", messages);
            // envia o histórico de mensagens para o usuário que acabou de entrar

            console.log(`Socket ${socket.id} entrou no chat ${chat_id}`);
        });

        socket.on("leaveChat", (chat_id: number) => {
            socket.leave(`chat_${chat_id}`);
        });

        // sendMessage = evento que o cliente usa para enviar mensagem
        socket.on("sendMessage", async (data: CreateMessagesDTO) => {

            // data = { chat_id, author_id, message }

            const chat = await db("chat").where({ id: data.chat_id }).first();
            if (!chat || (chat.user1_id !== data.author_id && chat.user2_id !== data.author_id)) {
                socket.emit("chatError", "Você não faz parte dessa conversa");
                return;
            }

            // salva a mensagem no banco
            const [id] = await db<Messages>("messages").insert(data);

            // cria objeto completo com id
            const newMessage = {
                id,
                ...data
            };

            // envia a mensagem para TODOS da sala (inclusive quem enviou)
            io.to(`chat_${data.chat_id}`).emit("receivedMessage", newMessage);

        });

        socket.on("disconnect", () => {
            console.log(`Socket desconectado: ${socket.id}`);
        });

    });
}

//RESUMO

// socket.on = escuta um evento do cliente
// socket.emit = envia algo só para esse cliente
// io.to = envia para todos dentro de uma sala
// socket.join = coloca o usuário dentro de uma sala (chat específico)
