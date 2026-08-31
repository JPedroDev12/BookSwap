import { Response } from "express";
import { db } from "../config/knex";
import { Chat } from "../Interface/chat.Interface";
import { CreateChatDTO } from "../Dto/chat.dto";
import { AuthRequest } from "../Middleware/authMiddleware";

export async function GetChats(req: AuthRequest, res: Response) {
    const user_id = +req.params.user_id

    if (!user_id) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    if (Number(req.usuario?.id) !== user_id) {
        return res.status(403).json({ Error: "Você não pode ver as conversas de outro usuário" })
    }

    // garante que todo match do usuário já tenha um chat criado
    // (cobre matches feitos antes dessa funcionalidade de chat existir)
    const matches = await db("matches")
        .where("user1_id", user_id)
        .orWhere("user2_id", user_id)

    for (const m of matches) {
        const chatExistente = await db("chat")
            .where({ user1_id: m.user1_id, user2_id: m.user2_id })
            .orWhere({ user1_id: m.user2_id, user2_id: m.user1_id })
            .first()

        if (!chatExistente) {
            await db("chat").insert({ user1_id: m.user1_id, user2_id: m.user2_id })
        }
    }

    const chats = await db<Chat>("chat")
        .where("user1_id", user_id)
        .orWhere("user2_id", user_id)
        .join("user as u1", "chat.user1_id", "u1.id")
        .join("user as u2", "chat.user2_id", "u2.id")
        .leftJoin("user_page as up1", "u1.id", "up1.user_id")
        .leftJoin("user_page as up2", "u2.id", "up2.user_id")
        .select(
            "chat.id",
            "chat.user1_id",
            "chat.user2_id",
            "u1.username as user1",
            "u2.username as user2",
            "up1.photo_url as user1_photo",
            "up2.photo_url as user2_photo",
            "chat.created_at"
        )

    const chatsComDetalhes = await Promise.all(chats.map(async (chat: any) => {
        const souUser1 = chat.user1_id === user_id;
        const outroId = souUser1 ? chat.user2_id : chat.user1_id;
        const outroNome = souUser1 ? chat.user2 : chat.user1;
        const outraFoto = souUser1 ? chat.user2_photo : chat.user1_photo;

        const ultimaMensagem = await db("messages")
            .where({ chat_id: chat.id })
            .orderBy("created_at", "desc")
            .first();

        return {
            id: chat.id,
            other_user_id: outroId,
            other_username: outroNome,
            other_photo_url: outraFoto,
            last_message: ultimaMensagem ? ultimaMensagem.message : null,
            last_message_at: ultimaMensagem ? ultimaMensagem.created_at : chat.created_at,
        }
    }))

    chatsComDetalhes.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())

    return res.status(200).json({ chats: chatsComDetalhes })
}

export async function GetChatById(req: AuthRequest, res: Response) {
    const id = +req.params.id
    const user_id = Number(req.usuario?.id)

    const chat = await db<Chat>("chat").where({ id }).first()
    if (!chat) {
        return res.status(404).json({
            Error: "Chat não Encontrado"
        })
    }

    if (chat.user1_id !== user_id && chat.user2_id !== user_id) {
        return res.status(403).json({ Error: "Você não faz parte dessa conversa" })
    }

    const outroId = chat.user1_id === user_id ? chat.user2_id : chat.user1_id
    const outro = await db("user").where({ id: outroId }).select("id", "username").first()
    const paginaOutro = await db("user_page").where({ user_id: outroId }).select("photo_url").first()

    return res.status(200).json({
        data: {
            id: chat.id,
            other_user_id: outroId,
            other_username: outro?.username,
            other_photo_url: paginaOutro?.photo_url || null,
        }
    })
}

export async function CreateChat(req: AuthRequest, res: Response) {
    const body:CreateChatDTO = req.body

    if (Number(req.usuario?.id) !== body.user1_id && Number(req.usuario?.id) !== body.user2_id) {
        return res.status(403).json({ Error: "Requisição inválida" })
    }

    const match = await db("matches")
        .where({ user1_id: body.user1_id, user2_id: body.user2_id })
        .orWhere({ user1_id: body.user2_id, user2_id: body.user1_id })
        .first()

    if (!match) {
        return res.status(403).json({ Error: "Vocês precisam dar match antes de conversar" })
    }

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

    const [id] = await db<Chat>("chat").insert(body)
    const chat = await db<Chat>("chat").where({ id }).first()
    return res.status(201).json({
        Success: "Chat Criado com Sucesso", data: chat
    })
}
