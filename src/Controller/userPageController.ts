import { Request, Response } from "express";
import { db } from "../config/knex";
import { UserPage } from "../Interface/userPage.Interface";
import { CreateUserPageDTO, UpdateUserPageDTO } from "../Dto/userPage.dto";

export async function getUserPage(req: Request, res: Response) {
    const user_id = +req.params.user_id;

    const page = await db("user_page")
        .join("user", "user_page.user_id", "user.id")
        .where("user_page.user_id", user_id)
        .select(
            "user_page.id",
            "user_page.description",
            "user_page.photo_url",
            "user.username",
            "user.email"
        )
        .first();

    if (!page) {
        return res.status(404).json({
            Error: "Perfil não encontrado"
        });
    }

    // Busca os livros favoritos separado
    const favoriteBooks = await db("user_book")
        .join("book", "user_book.book_id", "book.id")
        .where("user_book.user_id", user_id)
        .whereIn("user_book.status", ["Gostei", "Lidos"])
        .select("book.id", "book.title", "book.cover_url", "book.author", "user_book.status");

    return res.status(200).json({ data: { ...page, favoriteBooks } });
}

export async function GetUserPageById(res:Response, req:Request) {
    const id = +req.params.id
    const UserPage = await db<UserPage>("user_page").where({id}).first()

    if (!UserPage) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    return res.status(200).json({ data: UserPage })
}

export async function createUserPage(req: Request, res: Response) {
    const body: CreateUserPageDTO = req.body;
    await db<UserPage>("user_page").insert(body);
    return res.status(201).json({ message: "Página criada com sucesso" });
}

export async function updateUserPage(req: Request, res: Response) {
    const id = +req.params.id;
    const body: UpdateUserPageDTO = req.body;

    const page = await db<UserPage>("user_page").where({ id }).first();
    if (!page) {
        return res.status(404).json({ error: "Página não encontrada" });
    }

    await db<UserPage>("user_page").where({ id }).update(body);
    return res.status(200).json({
        Success: "Página atualizada com sucesso"
    });
}