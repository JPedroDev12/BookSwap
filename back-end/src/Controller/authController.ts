import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/knex";
import { User } from "../Interface/user.Interface";
import { RegisterUserDTO, LoginUserDTO } from "../Dto/auth.dto";

// Em produção, defina JWT_SECRET numa variável de ambiente (.env).
const JWT_SECRET = process.env.JWT_SECRET || "bookswap_secret_dev";

export async function Register(req: Request, res: Response) {
    const body: RegisterUserDTO = req.body;

    if (!body.username || !body.email || !body.password) {
        return res.status(400).json({
            Error: "Nome de usuário, email e senha são obrigatórios",
        });
    }

    const usuarioExistente = await db<User>("user")
        .where({ email: body.email })
        .first();

    if (usuarioExistente) {
        return res.status(409).json({
            Error: "Este email já está cadastrado",
        });
    }

    // Nunca salvamos a senha em texto puro: geramos um hash irreversível.
    const senhaCriptografada = await bcrypt.hash(body.password, 10);

    const [id] = await db<User>("user").insert({
        username: body.username,
        email: body.email,
        CPF: body.CPF,
        password: senhaCriptografada,
    });

    return res.status(201).json({
        Success: "Usuário cadastrado com sucesso",
        data: { id, username: body.username, email: body.email },
    });
}

export async function Login(req: Request, res: Response) {
    const { email, password }: LoginUserDTO = req.body;

    if (!email || !password) {
        return res.status(400).json({
            Error: "Email e senha são obrigatórios",
        });
    }

    const user = await db<User>("user").where({ email }).first();

    // Mensagem genérica de propósito: não revela se o erro foi o email ou a senha.
    if (!user) {
        return res.status(401).json({
            Error: "Email ou senha inválidos",
        });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
        return res.status(401).json({
            Error: "Email ou senha inválidos",
        });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return res.status(200).json({
        Success: "Login realizado com sucesso",
        token,
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            theme_status: user.theme_status,
        },
    });
}
