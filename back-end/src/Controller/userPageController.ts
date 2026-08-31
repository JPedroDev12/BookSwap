import { Request, Response } from "express";
import { db } from "../config/knex";
import { UserPage } from "../Interface/userPage.Interface";
import { CreateUserPageDTO, UpdateUserPageDTO } from "../Dto/userPage.dto";
import { AuthRequest } from "../Middleware/authMiddleware";

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
        // Conta recém-criada ainda não salvou uma página de perfil — isso é
        // esperado (não é um erro), então respondemos 200 com data: null
        // em vez de 404, pra não sujar o console do navegador.
        return res.status(200).json({ data: null });
    }

    // Busca os livros favoritos separado
    const favoriteBooks = await db("user_book")
        .join("book", "user_book.book_id", "book.id")
        .where("user_book.user_id", user_id)
        .whereIn("user_book.status", ["Gostei", "Lidos"])
        .select("book.id", "book.title", "book.cover_url", "book.author", "user_book.status");

    return res.status(200).json({ data: { ...page, favoriteBooks } });
}

export async function createUserPage(req: AuthRequest, res: Response) {
    const body: CreateUserPageDTO = req.body;

    // Só é possível criar a própria página de perfil
    if (req.usuario?.id !== +body.user_id) {
        return res.status(403).json({
            Error: "Você não tem permissão para criar essa página de perfil"
        });
    }

    await db<UserPage>("user_page").insert(body);
    return res.status(201).json({ message: "Página criada com sucesso" });
}

export async function updateUserPage(req: AuthRequest, res: Response) {
    const id = +req.params.id;
    const body: UpdateUserPageDTO = req.body;

    const page = await db<UserPage>("user_page").where({ id }).first();
    if (!page) {
        return res.status(404).json({ error: "Página não encontrada" });
    }

    // Só o dono dessa página pode editá-la
    if (req.usuario?.id !== page.user_id) {
        return res.status(403).json({
            Error: "Você não tem permissão para editar essa página de perfil"
        });
    }

    await db<UserPage>("user_page").where({ id }).update(body);
    return res.status(200).json({
        Success: "Página atualizada com sucesso"
    });
}