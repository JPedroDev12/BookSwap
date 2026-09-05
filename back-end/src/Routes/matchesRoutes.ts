import { Router } from "express";
import { GetMatches, GetMatchById, DeleteMatch } from "../Controller/matchesController";

const router = Router()

router.get('/:user_id', GetMatches)
router.get('/match/:id', GetMatchById)
router.delete('/:id', DeleteMatch)

export default router;