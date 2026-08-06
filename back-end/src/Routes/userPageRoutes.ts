import { Router } from "express"
import { createUserPage, getUserPage, updateUserPage } from "../Controller/userPageController"
import { verificarToken } from "../Middleware/authMiddleware"

const router = Router()

router.get('/:user_id', getUserPage)
router.post('/', verificarToken, createUserPage)
router.put('/:id', verificarToken, updateUserPage)

export default router;