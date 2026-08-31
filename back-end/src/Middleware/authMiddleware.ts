import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bookswap_dev_secret";

export interface AuthRequest extends Request {
    usuario?: { id: number; email: string; username: string; is_admin?: boolean };
}

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ Error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuario = payload as AuthRequest["usuario"];
        next();
    } catch {
        return res.status(401).json({ Error: "Token inválido ou expirado" });
    }
}
