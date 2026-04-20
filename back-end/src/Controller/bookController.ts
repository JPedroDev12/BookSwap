import { Request, Response } from "express"
import { db } from "../config/knex"
import { Book } from "../Interface/book.Interface"
import { CreateBookDTO, UpdateBookDTO } from "../Dto/book.dto"

export async function GetBooks(req:Request, res:Response) {
    const books = await db<Book>("book").select("*")
    return res.status(200).json({books})
}

export async function GetBookById(req:Request, res:Response) {
    const id = +req.params.id
    const book = await db<Book>("book").where({ id }).first()
    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    return res.status(200).json({data: book}) // data é usado para melhor organização na hora de criar o front-end
}

export async function CreateBook(req: Request, res:Response) {
    const body:CreateBookDTO = req.body;
    const book = await db<Book>("book").insert(body)

    return res.status(201).json({
        Success: "Livro Criado com Sucesso", data: book
    })
}

export async function UpdateBook(req: Request, res:Response) {
    const id = +req.params.id
    const body:UpdateBookDTO = req.body

    const book = await db<Book>("book").where({ id }).first()
    
    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    await db<Book>("book").where({ id }).update(body)
    return res.status(201).json({
            Success: "Livro Atualizado com Sucesso", data: book
    })
}

export async function DeleteBook(req:Request, res:Response) {
    const id = +req.params.id
    const book = await db<Book>("book").where({ id }).first()

    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    await db<Book>("book").where({ id }).del()
    return res.status(200).json({
        Success: "Livro Deletado com Sucesso", book
    })
}