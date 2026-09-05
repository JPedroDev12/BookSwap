import { Response } from "express";
import { db } from "../config/knex";
import { Messages } from "../Interface/messages.Interface";
import { AuthRequest } from "../Middleware/authMiddleware";

export async function GetMessages(req: AuthRequest, res: Response) {
    const chat_id = +req.params.chat_id;

    const chat = await db("chat").where({ id: chat_id }).first();
    if (!chat) {
        return res.status(404).json({
            Error: "Chat não encontrado"
        });
    }

    if (Number(req.usuario?.id) !== chat.user1_id && Number(req.usuario?.id) !== chat.user2_id) {
        return res.status(403).json({ Error: "Você não faz parte dessa conversa" });
    }

    const messages = await db<Messages>("messages")
        .where({ chat_id })
        .orderBy("created_at", "asc")
        .select("*");
    return res.status(200).json({ messages });
}

export async function DeleteMessage(req: AuthRequest, res: Response) {
    const id = +req.params.id;

    const messages = await db<Messages>("messages").where({ id }).first();
    if (!messages) {
        return res.status(404).json({
            Error: "Mensagem não encontrada"
        });
    }

    if (messages.author_id !== Number(req.usuario?.id)) {
        return res.status(403).json({ Error: "Você não pode apagar essa mensagem" });
    }

    await db<Messages>("messages").where({ id }).del();
    return res.status(200).json({
        Success: "Mensagem deletada com sucesso"
    });
}
