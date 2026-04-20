import { Router } from "express";
import { GetBooks, CreateBook, DeleteBook, GetBookById, UpdateBook } from "../Controller/bookController";

const router = Router()

router.get('/', GetBooks)
router.get('/:id', GetBookById)
router.post('/', CreateBook)
router.put('/:id', UpdateBook)
router.delete('/:id', DeleteBook)

export default router;