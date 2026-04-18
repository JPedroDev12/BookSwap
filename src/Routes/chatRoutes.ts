import { Router } from "express";
import { GetChats, CreateChat } from "../Controller/chatController";

const router = Router()

router.get('/chat', GetChats)
router.get('/chat', CreateChat)

export default router