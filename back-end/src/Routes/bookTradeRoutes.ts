import { Router } from "express";
import { GetTrades,OfferBook,RemoveOffer } from "../Controller/bookTradeController";

const router = Router()

router.get('/', GetTrades)
router.post('/', OfferBook)
router.delete('/:id', RemoveOffer)

export default router;