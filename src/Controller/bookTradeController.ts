import { Request, Response } from "express"
import { db } from "../config/knex"
import { BookTrade } from "../Interface/bookTrade.Interface"
import { CreateBookTradeDTO, UpdateBookTradeDTO } from "../Dto/bookTrade.dto"

export async function GetBookTrade(res: Response, req: Request) {
    const book = await db<BookTrade>("book_trade").select("*")
    return res.status(200).json({book})
}

export async function GetBookTradeById(res: Response, req: Request) {
    const id = +req.params.id
    const book = await db<BookTrade>("book_trade").where({id}).first()

    
}