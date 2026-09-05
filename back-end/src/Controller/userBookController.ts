import { Response } from "express";
import { db } from "../config/knex";
import { UserBook } from "../Interface/userBook.Interface";
import { CreateUserBookDTO, UpdateUserBookDTO } from "../Dto/userBook.dto";
import { AuthRequest } from "../Middleware/authMiddleware";

export async function GetUserBooks(req: AuthRequest, res: Response) {
    const user_id = +req.params.user_id
    const books = await db<UserBook>("user_book")
        .join("book", "user_book.book_id", "book.id")
        .where("user_book.user_id", user_id)
        .select(
            "user_book.id as user_book_id",
            "user_book.status",
            "user_book.rating",
            "book.*"
        )
        .orderBy("user_book.id", "desc");
    return res.status(200).json({ books })
}

export async function AddUserBook(req: AuthRequest, res: Response) {
    if (!req.usuario?.id) {
        return res.status(401).json({ Error: "Você precisa estar logado para adicionar um livro ao seu perfil" })
    }

    const body: CreateUserBookDTO = { ...req.body, user_id: req.usuario.id };

    if (!body.book_id) {
        return res.status(400).json({ Error: "O livro é obrigatório" })
    }

    try {
        const [id] = await db<UserBook>("user_book").insert(body)
        const userBook = await db<UserBook>("user_book").where({ id }).first()
        return res.status(201).json({
            Success: "Livro adicionado à lista com sucesso", data: userBook
        })
    } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ Error: "Este livro já está no seu perfil" })
        }
        throw err
    }
}

export async function UpdateUserBook(req: AuthRequest, res: Response) {
    const id = +req.params.id

    // Só status e rating podem ser alterados por aqui. user_id/book_id nunca
    // vêm do corpo da requisição, senão um usuário poderia "transferir" um
    // registro da própria estante pra outro usuário, ou trocar o livro.
    const body: UpdateUserBookDTO = {}
    if (req.body.status !== undefined) body.status = req.body.status
    if (req.body.rating !== undefined) body.rating = req.body.rating

    const userBook = await db<UserBook>("user_book").where({ id }).first()

    if (!userBook) {
        return res.status(404).json({
            Error: "Registro não Encontrado"
        })
    }

    if (userBook.user_id !== req.usuario?.id) {
        return res.status(403).json({ Error: "Você não tem permissão para editar este registro" })
    }

    if (body.rating !== undefined && body.rating !== null && (body.rating < 1 || body.rating > 5)) {
        return res.status(400).json({ Error: "A avaliação deve ser entre 1 e 5" })
    }

    await db<UserBook>("user_book").where({ id }).update(body)
    const userBookAtualizado = await db<UserBook>("user_book").where({ id }).first()

    return res.status(200).json({
        Success: "Registro Atualizado com Sucesso", data: userBookAtualizado
    })
}

export async function RemoveUserBook(req: AuthRequest, res: Response) {
    const id = +req.params.id
    const userBook = await db<UserBook>("user_book").where({ id }).first()

    if (!userBook) {
        return res.status(404).json({
            Error: "Registro não Encontrado"
        })
    }

    if (userBook.user_id !== req.usuario?.id) {
        return res.status(403).json({ Error: "Você não tem permissão para remover este registro" })
    }

    await db<UserBook>("user_book").where({ id }).del()
    return res.status(200).json({
        Success: "Registro Apagado com Sucesso"
    })
}
