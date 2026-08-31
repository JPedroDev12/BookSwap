import { Router } from "express";
import { GetBooks, CreateBook, DeleteBook, GetBookById, UpdateBook } from "../Controller/bookController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/', GetBooks)
router.get('/:id', GetBookById)
router.post('/', verificarToken, CreateBook)
router.put('/:id', verificarToken, UpdateBook)
router.delete('/:id', verificarToken, DeleteBook)

export default router;