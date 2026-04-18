import { Response, Request } from "express";
import { db } from "../config/knex";
import { Swapping } from "../Interface/swapping.Interface";
import { CreateSwappingDTO, UpdateSwappingDTO } from "../Dto/swapping.dto";

export async function GetSwapping(res: Response, req: Request) {
    const swapping_id = +req.params.swapping_id
    const swappings = await db<Swapping>("swapping").where({ swapping_id }).select("*")
    return res.status(200).json({ swappings })
}

export async function ReactToBook(res: Response, req: Request) {
    const body:CreateSwappingDTO = req.body;
    await db<Swapping>("swapping").insert(body)

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
            return res.status(201).json({
                Message: "Match!", match: true
            })
        }
    }

    return res.status(201).json({
        Success: "Reação Registrada com Sucesso", match: false
    })
}