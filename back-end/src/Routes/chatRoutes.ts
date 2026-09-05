import { Router } from "express";
import { GetChats, GetChatById, CreateChat } from "../Controller/chatController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/single/:id', verificarToken, GetChatById)
router.get('/:user_id', verificarToken, GetChats)
router.post('/', verificarToken, CreateChat)

export default router;
