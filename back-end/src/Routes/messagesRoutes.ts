import { Router } from "express";
import { GetMessages, DeleteMessage } from "../Controller/messagesController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/:chat_id', verificarToken, GetMessages)
router.delete('/:id', verificarToken, DeleteMessage)

export default router;
