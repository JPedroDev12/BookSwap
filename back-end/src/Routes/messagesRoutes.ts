import { Router } from "express";
import { GetMessages, DeleteMessage } from "../Controller/messagesController";

const router = Router()

router.get('/:chat_id', GetMessages)
router.delete('/:id', DeleteMessage)

export default router;