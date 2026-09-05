import { Response, Request } from "express";
import { db } from "../config/knex";
import { Swapping } from "../Interface/swapping.Interface";
import { CreateSwappingDTO, UpdateSwappingDTO } from "../Dto/swapping.dto";

export async function GetSwapping(req: Request, res: Response) {
    const swapping_id = +req.params.swapping_id
    const swappings = await db<Swapping>("swapping").where({ swapping_id }).select("*")
    return res.status(200).json({ swappings })
}

export async function ReactToBook(req: Request, res: Response) {
    const body:CreateSwappingDTO = req.body;

    try {
        await db<Swapping>("swapping").insert(body)
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ Error: "Você já reagiu a este livro" })
        }
        throw err
    }

    if (body.action === "like") { // se na parte do dto de criação a ação for "like" ele vai
        // pega o dono do book_trade que foi curtido
        const trade = await db("book_trade").where({ id: body.book_trade_id}).first()
        const ownerUserId = trade.user_id;

        // pega todos os book_trades do usuario que curtiu
        const myTrades = await db("book_trade")
            .where({ user_id: body.swapping_id })
            .select("id");
        const myTradeIds = myTrades.map((t: any) => t.id);


        //verifica se o dono curtiu algum livro do usuario que acabou de curtir
        const mutualLike = await db<Swapping>("swapping")
            .where({ swapping_id: ownerUserId, action: "like"})
            .whereIn("book_trade_id", myTradeIds)
            .first()
        
        if (mutualLike) {
            await db("matches").insert({
                user1_id: body.swapping_id,
                user2_id: ownerUserId
            })

            let chat = await db("chat")
                .where({ user1_id: body.swapping_id, user2_id: ownerUserId })
                .orWhere({ user1_id: ownerUserId, user2_id: body.swapping_id })
                .first()

            if (!chat) {
                const [chatId] = await db("chat").insert({
                    user1_id: body.swapping_id,
                    user2_id: ownerUserId
                })
                chat = await db("chat").where({ id: chatId }).first()
            }

            const dono = await db("user").where({ id: ownerUserId }).select("id", "username").first()

            return res.status(201).json({
                Message: "Match!", match: true, chat_id: chat.id, user: dono
            })
        }
    }

    return res.status(201).json({
        Success: "Reação Registrada com Sucesso", match: false
    })
}

export async function UndoSwap(req: Request, res: Response) {
    const swapping_id = +req.params.swapping_id

    const lastSwipe = await db<Swapping>("swapping")
        .where({ swapping_id })
        .orderBy("id", "desc")
        .first()

    if (!lastSwipe) {
        return res.status(404).json({ Error: "Nenhuma reação para desfazer" })
    }

    await db<Swapping>("swapping").where({ id: lastSwipe.id }).del()

    return res.status(200).json({
        Success: "Reação desfeita com sucesso",
        book_trade_id: lastSwipe.book_trade_id
    })
}