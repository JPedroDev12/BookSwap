import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "../config/knex"
import { User } from "../Interface/user.Interface"

const JWT_SECRET = process.env.JWT_SECRET || "bookswap_dev_secret"

export async function Register(req: Request, res: Response) {
    const { username, email, password, CPF } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ Error: "Preencha todos os campos" })
    }

    const existingUser = await db<User>("user").where({ email }).first()

    if (existingUser) {
        return res.status(409).json({ Error: "Email já cadastrado" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [id] = await db<User>("user").insert({
        username,
        email,
        password: hashedPassword,
        CPF: CPF || null,
    })

    const user = await db<User>("user").where({ id }).first()

    if (!user) {
        return res.status(500).json({ Error: "Erro ao criar usuário" })
    }

    const { password: _senha, ...userSemSenha } = user

    return res.status(201).json({ Success: "Usuário Criado com Sucesso", data: userSemSenha })
}

export async function Login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ Error: "Preencha email e senha" })
    }

    const user = await db<User>("user").where({ email }).first()

    if (!user) {
        return res.status(401).json({ Error: "Email ou senha inválidos" })
    }

    const senhaValida = await bcrypt.compare(password, user.password)

    if (!senhaValida) {
        return res.status(401).json({ Error: "Email ou senha inválidos" })
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" })
    const { password: _senha, ...userSemSenha } = user

    return res.status(200).json({ token, data: userSemSenha })
}
