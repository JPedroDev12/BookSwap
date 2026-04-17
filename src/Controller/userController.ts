import { Request, Response } from "express"
import { db } from "../config/knex"
import { User } from "../Interface/user.Interface"
import { CreateUserDTO, UpdateUserDTO } from "../Dto/user.dto"

export async function GetUsers(res:Response, req:Request) {
    const users = await db<User>("user").select("*")
    return res.status(200).json({users})
}

export async function GetUserById(res:Response, req:Request) {
    const id = +req.params.id
    const user = await db<User>("user").where({ id }).first()

    if (!user) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    return res.status(200).json({ data: user })
}

export async function CreateUser(res: Response, req: Request) {
    const body:CreateUserDTO = req.body;
    const user = await db<User>("user").insert(body)

    return res.status(200).json({
        Success: "Usuário Criado com Sucesso", data: user
    })
}

export async function UpdateUser(res:Response, req:Request) {
    const id = +req.params.id
    const body:UpdateUserDTO = req.body

    const user = await db<User>("user").where({ id }).first()

    if (!user) {
        return res.status(404).json({
            Error: "Usuário não Encontrado"
        })
    }

    await db<User>("user").where({ id }).update(body)
    return res.status(200).json({
        Success: "Usuário Atualizado com Sucesso", data:user
    })
}

export async function DeleteUser(res: Response, req: Request) {
    const id = +req.params.id
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

