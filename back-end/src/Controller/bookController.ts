import { Response } from "express"
import { db } from "../config/knex"
import { Book } from "../Interface/book.Interface"
import { CreateBookDTO, UpdateBookDTO } from "../Dto/book.dto"
import { AuthRequest } from "../Middleware/authMiddleware"

export async function GetBooks(req:AuthRequest, res:Response) {
    let query = db<Book>("book").select("*").orderBy("created_at", "desc")

    // A Loja só deve listar livros marcados como listed_in_store = true.
    if (req.query.in_store === "true") {
        query = query.where({ listed_in_store: true })
    }

    const books = await query
    return res.status(200).json({books})
}

export async function GetBookById(req:AuthRequest, res:Response) {
    const id = +req.params.id
    const book = await db<Book>("book").where({ id }).first()
    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    // média das avaliações que os usuários deram a esse livro no perfil deles
    const avaliacoes = await db("user_book")
        .where({ book_id: id })
        .whereNotNull("rating")
        .avg({ media: "rating" })
        .count({ total: "rating" })
        .first()

    const donoDoLivro = await db("user").where({ id: book.user_id }).select("id", "username").first()

    return res.status(200).json({
        data: {
            ...book,
            average_rating: avaliacoes?.media ? Number(avaliacoes.media) : null,
            ratings_count: Number(avaliacoes?.total || 0),
            owner: donoDoLivro || null,
        }
    }) // data é usado para melhor organização na hora de criar o front-end
}

export async function CreateBook(req: AuthRequest, res:Response) {
    if (!req.usuario?.id) {
        return res.status(401).json({ Error: "Você precisa estar logado para cadastrar um livro" })
    }

    // Qualquer usuário logado pode cadastrar um livro novo para o próprio no perfil. 
    // Só que apenas administradores podem colocar o livro na Loja
    // (listed_in_store = true) — pra um usuário comum, esse campo é sempre
    // forçado para false, não importa o que venha no corpo da requisição.
    const quisColocarNaLoja = req.body.listed_in_store === true;

    if (quisColocarNaLoja && !req.usuario.is_admin) {
        return res.status(403).json({ Error: "Apenas administradores podem cadastrar livros na Loja" })
    }

    const body: CreateBookDTO = {
        ...req.body,
        user_id: req.usuario.id,
        listed_in_store: req.usuario.is_admin ? (req.body.listed_in_store ?? true) : false,
    };

    if (!body.title) {
        return res.status(400).json({ Error: "O título do livro é obrigatório" })
    }

    const [id] = await db<Book>("book").insert(body)
    const book = await db<Book>("book").where({ id }).first()

    return res.status(201).json({
        Success: "Livro Criado com Sucesso", data: book
    })
}

export async function UpdateBook(req: AuthRequest, res:Response) {
    const id = +req.params.id
    const body:UpdateBookDTO = req.body

    const book = await db<Book>("book").where({ id }).first()

    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    if (book.user_id !== req.usuario?.id) {
        return res.status(403).json({ Error: "Você não tem permissão para editar este livro" })
    }

    // Mesma regra da criação: só admin pode colocar/manter um livro na Loja.
    if (body.listed_in_store === true && !req.usuario?.is_admin) {
        return res.status(403).json({ Error: "Apenas administradores podem colocar livros na Loja" })
    }

    await db<Book>("book").where({ id }).update(body)
    const bookAtualizado = await db<Book>("book").where({ id }).first()

    return res.status(200).json({
            Success: "Livro Atualizado com Sucesso", data: bookAtualizado
    })
}

export async function DeleteBook(req:AuthRequest, res:Response) {
    const id = +req.params.id
    const book = await db<Book>("book").where({ id }).first()

    if (!book) {
        return res.status(404).json({
            Error: "Livro não Encontrado"
        })
    }

    if (book.user_id !== req.usuario?.id) {
        return res.status(403).json({ Error: "Você não tem permissão para excluir este livro" })
    }

    await db("user_book").where({ book_id: id }).del()
    await db("book_trade").where({ book_id: id }).del()
    await db<Book>("book").where({ id }).del()
    return res.status(200).json({
        Success: "Livro Deletado com Sucesso", book
    })
}