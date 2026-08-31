import { Router } from "express";
import { GetSwapping, ReactToBook, UndoSwap } from "../Controller/swappingController";

const router = Router()

router.delete('/undo/:swapping_id', UndoSwap)
router.get('/:swapping_id', GetSwapping)
router.post('/', ReactToBook)

export default router;