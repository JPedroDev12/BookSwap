import { Router } from "express";
import { GetMessages, DeleteMessage } from "../Controller/messageController";

const router = Router()

router.get('/', GetMessages)
router.delete('/', DeleteMessage)

export default router