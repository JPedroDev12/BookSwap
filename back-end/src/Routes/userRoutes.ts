import { Router } from "express";
import { GetUsers, DeleteUser, GetUserById, UpdateUser } from "../Controller/userController";
import { verificarToken } from "../Middleware/authMiddleware";

const router = Router()

router.get('/', verificarToken, GetUsers)
router.get('/:id', verificarToken, GetUserById)
router.put('/:id', verificarToken, UpdateUser)
router.delete('/:id', verificarToken, DeleteUser)

export default router;