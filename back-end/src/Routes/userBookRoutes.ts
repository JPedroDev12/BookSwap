import { Router } from "express";
import { GetUserBooks, AddUserBook, RemoveUserBook, UpdateUserBook } from "../Controller/userBookController";

const router = Router()

router.get('/:user_id', GetUserBooks)
router.post('/', AddUserBook)
router.put('/:id', UpdateUserBook)
router.delete('/:id', RemoveUserBook)

export default router;