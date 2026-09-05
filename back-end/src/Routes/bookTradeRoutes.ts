import { Router } from "express";
import { GetTrades, OfferBook, RemoveOffer } from "../Controller/bookTradeController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/', GetTrades)
router.post('/', verificarToken, OfferBook)
router.delete('/:id', verificarToken, RemoveOffer)

export default router;
