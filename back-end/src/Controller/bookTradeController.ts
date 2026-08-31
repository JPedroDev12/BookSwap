import { Response } from "express"
import { db } from "../config/knex"
import { BookTrade } from "../Interface/bookTrade.Interface"
import { CreateBookTradeDTO } from "../Dto/bookTrade.dto"
import { AuthRequest } from "../Middleware/authMiddleware"

export async function GetTrades(req: AuthRequest, res: Response) {
    const trades = await db<BookTrade>("book_trade")
        .join("book", "book_trade.book_id", "book.id")
        .join("user", "book_trade.user_id", "user.id")
        .select(
            "book_trade.id",
            "book_trade.book_id",
            "book_trade.user_id as owner_id",
            "book.title",
            "book.cover_url",
            "book.author",
            "book.genre",
            "book.description",
            "book.price",
            "user.username"
        )
        .orderBy("book_trade.id", "desc")
    return res.status(200).json({ trades })
}

export async function OfferBook(req: AuthRequest, res: Response) {
    if (!req.usuario?.id) {
        return res.status(401).json({ Error: "Você precisa estar logado para ofertar um livro para troca" })
    }

    const body: CreateBookTradeDTO = { ...req.body, user_id: req.usuario.id };

    if (!body.book_id) {
        return res.status(400).json({ Error: "O livro é obrigatório" })
    }

    try {
        const [id] = await db<BookTrade>("book_trade").insert(body)
        const trade = await db<BookTrade>("book_trade").where({ id }).first()
        return res.status(201).json({
            Message: "Livro Ofertado para troca com sucesso", data: trade
        })
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ Error: "Este livro já está ofertado para troca" })
        }
        throw err
    }
}

export async function RemoveOffer(req: AuthRequest, res: Response) {
    const id = +req.params.id
    const trade = await db<BookTrade>("book_trade").where({ id }).first()

    if (!trade) {
        return res.status(404).json({
            Error: "Oferta não Encontrada"
        })
    }

    if (trade.user_id !== req.usuario?.id) {
        return res.status(403).json({ Error: "Você não tem permissão para remover esta oferta" })
    }

    await db<BookTrade>("book_trade").where({ id }).del()
    return res.status(200).json({
        Success: "Oferta Apagada com Sucesso"
    })
}
