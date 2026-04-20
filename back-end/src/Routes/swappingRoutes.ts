import { Router } from "express";
import { GetSwapping, ReactToBook } from "../Controller/swappingController";

const router = Router()

router.get('/:swapping_id', GetSwapping)
router.post('/', ReactToBook)

export default router;