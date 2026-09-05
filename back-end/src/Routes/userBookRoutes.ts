import { Router } from "express";
import { GetUserBooks, AddUserBook, RemoveUserBook, UpdateUserBook } from "../Controller/userBookController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/:user_id', GetUserBooks)
router.post('/', verificarToken, AddUserBook)
router.put('/:id', verificarToken, UpdateUserBook)
router.delete('/:id', verificarToken, RemoveUserBook)

export default router;
