import { Response, Request } from "express";
import { db } from "../config/knex";
import { UserBook } from "../Interface/userBook.Interface";
import { CreateUserBookDTO, UpdateUserBookDTO } from "../Dto/userBook.dto";

export async function GetUserBooks(res:Response, req:Request) {
    const user_id = req.params.user_id
    const books =  await db<UserBook>("user_book")
        .join("book", "user_book.book_id", "book.id")
        .where("user_book.user_id", user_id)
        .select("book.*", "user_book.status");
    return res.status(200).json({ books })
}

export async function AddUserBook(res:Response, req:Request) {
    const body:CreateUserBookDTO = req.body;
    await db<UserBook>("user_book").insert(body)
    return res.status(201).json({
        Success: "Livro adicionado à lista com sucesso"
    })
}

export async function UpdateUserBook(res:Response, req:Request) {
    const id = +req.params.id
    const body:UpdateUserBookDTO = req.body

    const userBook = await db<UserBook>("user_book").where({ id }).first()
    
    if (!userBook) {
        return res.status(400).json({
            Error: "Registro não Encontrado"
        })
    }
    
    await db<UserBook>("user_book").where({ id }).update( body )
    return res.status(200).json({
        Success: "Registro Atualizado com Sucesso"
    })
}

export async function RemoveUserBook(res:Response, req:Request) {
    const id = +req.params.id
    const userBook = await db<UserBook>("user_book").where({ id }).first()

    if (!userBook) {
        return res.status(404).json({
            Error: "Registro não Encontrado"
        })
    }

    await db<UserBook>("user_book").where({ id }).del()
    return res.status(200).json({
        Success: "Registro Apagado com Sucesso"
    })
}