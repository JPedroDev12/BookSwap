import { Request, Response } from "express"
import { db } from "../config/knex"
import { BookTrade } from "../Interface/bookTrade.Interface"
import { CreateBookTradeDTO, UpdateBookTradeDTO } from "../Dto/bookTrade.dto"

export async function GetTrades(res:Response, req:Request) {
    const trades = await db<BookTrade>("book_trade")
        .join("book", "book_trade.book_id", "book.id")
        .join("user", "book_trade.user_id", "user.id")
        .select(
            "book_trade.id",
            "book.title",
            "book.cover_url",
            "book.author",
            "book.genre",
            "user.username"
        )
    return res.status(200).json({ trades })
}

export async function OfferBook(req: Request, res: Response) {
    const body:CreateBookTradeDTO = req.body;
    await db<BookTrade>("book_trade").insert(body)
    return res.status(201).json({
        Message: "Livro Ofertado para troca com sucesso"
    })
}

export async function RemoveOffer(req: Request, res: Response) {
    const id = +req.params.id
    const trade = await db<BookTrade>("book_trade").where({ id }).first()

    if (!trade) {
        return res.status(404).json({
            Error: "Oferta não Encontrada"
        })
    }

    await db<BookTrade>("book_trade").where({ id }).del()
    return res.status(200).json({
        Success: "Oferta Apagada com Sucesso"
    })
}