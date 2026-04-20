import { Router } from "express";
import { GetChats, CreateChat } from "../Controller/chatController";

const router = Router()

router.get('/:user_id', GetChats)
router.post('/', CreateChat)

export default router;