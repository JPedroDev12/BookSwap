import { Response, Request } from "express";
import { db } from "../config/knex";
import { Messages } from "../Interface/messages.Interface";

export async function GetMessages(req: Request, res: Response) {
    const chat_id = +req.params.chat_id;
    const messages = await db<Messages>("messages")
        .where({ chat_id })
        .orderBy("created_at", "asc")
        .select("*");
    return res.status(200).json({ messages });
}

export async function DeleteMessage(req: Request, res: Response) {
    const id = +req.params.id;

    const messages = await db<Messages>("messages").where({ id }).first();
    if (!messages) {
        return res.status(404).json({
            Error: "Mensagem não encontrada"
        });
    }

    await db<Messages>("messages").where({ id }).del();
    return res.status(200).json({
        Success: "Mensagem deletada com sucesso"
    });
}