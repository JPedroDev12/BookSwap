import { Request, Response } from "express";
import { db } from "../config/knex";
import { Matches } from "../Interface/matches.Interface";
import { CreateMatchesDTO, UpdateMatchesDTO } from "../Dto/matches.dto";

export async function GetMatches(res: Response, req: Request) {
    const user_id = +req.params.user_id

    const matches = await db<Matches>("matches")
        .where("user1_id", user_id)
        .orWhere("user2_id", user_id)
        .join("user as u1", "matches.user1_id", "u1.id")
        .join("user as u2", "matches.user2_id", "u2.id")
        .select (
            "matches.id",
            "u1.username as user1",
            "u2.username as user2",
            "matches.created_at"
        )
    return res.status(200).json({ matches })
}

export async function DeleteMatch(res: Response, req: Request) {
    const id = +req.params.id;

    const match = await db<Matches>("matches").where({ id }).first();
    if (!match) {
        return res.status(404).json({
            Error: "Match não Encontrado"
        })
    }

    await db<Matches>("matches").where({ id }).del()
    return res.status(200).json({
        Success: "Match apagado com sucesso"
    })
}