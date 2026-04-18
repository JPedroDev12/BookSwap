import { Response, Request } from "express";
import { db } from "../config/knex";
import { Chat } from "../Interface/chat.Interface";
import { CreateChatDTO, UpdateChatDTO } from "../Dto/chat.dto";

export async function GetChats(res: Response, req: Request) {
    const user_id = +req.params.user_id
    const chats = await db<Chat>("chat")
        .where("user1_id", user_id)
        .orWhere("user2_id", user_id)
        .join("user as u1", "chat,user1_id", "u1.id")
        .join("user as u2", "chat.user2_id", "i2.id")
        .select(
            "chat.id",
            "u1.username as user1",
            "u2username as user2",
            "chat.created_at"
        )

    return res.status(200).json({ chats })
}

export async function CreateChat(res: Response, req: Request) {
    const body:CreateChatDTO = req.body

    // verifica se o chat entre esses dois usuarios ja existe
    const existing = await db<Chat>("chat")
        .where({ user1_id: body.user1_id, user2_id: body.user2_id })
        .orWhere({ user1_id: body.user2_id, user2_id: body.user1_id })
        .first();
    
    if (existing) {
        return res.status(200).json({
            Message: "Chat já Existe", data: existing
        })
    }

    await db<Chat>("chat").insert(body)
    return res.status(201).json({
        Success: "Chat Criado com Sucesso"
    })
}