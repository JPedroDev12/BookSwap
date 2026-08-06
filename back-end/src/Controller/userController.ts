import { Request, Response } from "express"
import { db } from "../config/knex"
import { User } from "../Interface/user.Interface"
import { UpdateUserDTO } from "../Dto/user.dto"
import { AuthRequest } from "../Middleware/authMiddleware"

export async function GetUsers(req: Request, res: Response) {
    const users = await db<User>("user").select(
        "id", "username", "email", "CPF", "theme_status"
    )
    return res.status(200).json({users})
}

export async function GetUserById(req: Request, res: Response) {
    const id = +req.params.id
    const user = await db<User>("user")
        .where({ id })
        .select("id", "username", "email", "CPF", "theme_status")
        .first()

    if (!user) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    return res.status(200).json({ data: user })
}

export async function UpdateUser(req: AuthRequest, res:Response) {
    const id = +req.params.id

    if (req.usuario?.id !== id) {
        return res.status(403).json({
            Error: "Você não tem permissão para editar este usuário"
        })
    }

    const camposPermitidos: (keyof UpdateUserDTO)[] = ["username", "email", "CPF", "theme_status"]
    const body: UpdateUserDTO = {}
    for (const campo of camposPermitidos) {
        if (req.body[campo] !== undefined) {
            body[campo] = req.body[campo]
        }
    }

    const user = await db<User>("user").where({ id }).first()

    if (!user) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    await db<User>("user").where({ id }).update(body)
    const usuarioAtualizado = await db<User>("user")
        .where({ id })
        .select("id", "username", "email", "CPF", "theme_status")
        .first()

    return res.status(201).json({
        Success: "Usuário Atualizado com Sucesso", data: usuarioAtualizado
    })
}

export async function DeleteUser(req: AuthRequest, res:Response) {
    const id = +req.params.id

    if (req.usuario?.id !== id) {
        return res.status(403).json({
            Error: "Você não tem permissão para excluir este usuário"
        })
    }

    const user = await db<User>("user").where({ id }).first()

    if (!user) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    await db<User>("user").where({ id }).del()
    return res.status(200).json({
        Success: "Usuário Deletado com Sucesso"
    })
}